/*
 * Usage:
 *
 *   setlight <CS>
 *
 * This will trigger 1 second on-off cycle.
 *
 *   setlight <CS> <VALUE>
 *
 * This will set the <CS> chip to the given value (valid values for
 * 10-bit DAC are 0 to 4095).
 *
 *   setlight <CS> <LOW> <HIGH>
 *
 * This will go from LOW to HIGH in 10 seconds, then back from HIGH to
 * LOW. Intervals are equidistant, e.g. this generates a triangle
 * wave. It tries to adjust to variable time in setting DACs etc.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>
#include <assert.h>
#include <time.h>

#include <bcm2835.h>

#define OUR_CS2 2
#define OUR_CS3 3

/* These are BCM numbers, not physical pin numbers on raspi board */
#define OUR_CS2_PIN 24
#define OUR_CS3_PIN 25

void set(uint8_t cs, uint8_t on)
{
  uint8_t pin;

  switch (cs) {
  case OUR_CS2: pin = OUR_CS2_PIN; break;
  case OUR_CS3: pin = OUR_CS3_PIN; break;
  default:
    return;
  }

  bcm2835_gpio_write(pin, on);}

void transfer(uint8_t cs, char* wbuf)
{
  char rbuf[2];

  if (cs == BCM2835_SPI_CS0 || cs == BCM2835_SPI_CS1) {
    bcm2835_spi_chipSelect(cs);
    bcm2835_spi_setChipSelectPolarity(cs, LOW);
  } else {
    bcm2835_spi_chipSelect(BCM2835_SPI_CS_NONE);
  }

  if (cs == OUR_CS2 || cs == OUR_CS3)
    set(cs, LOW);

  bcm2835_spi_transfernb(wbuf, rbuf, 2);

  if (cs == OUR_CS2 || cs == OUR_CS3)
    set(cs, HIGH);
}

void encode(int value, char* wbuf)
{
  wbuf[0] = 0x30 | (value >> 8) & 0x0f;
  wbuf[1] = value & 0xff;
}

int main(int ac, char *av[])
{
  int css[100] = {BCM2835_SPI_CS0};
  int ncs = 1;
  int value = -1, low = -1, high = -1;
  int i, debug = 0;

  if (ac > 1) {
    char *s;
    int cs;

    ncs = 0;

    for (s = strtok(av[1], ","); s != NULL; s = strtok(NULL, ",")) {
      assert(ncs < 100);

      int v = atoi(s);

      switch (v) {
      case 0: cs = BCM2835_SPI_CS0; break;
      case 1: cs = BCM2835_SPI_CS1; break;
      case 2: cs = OUR_CS2; break;
      case 3: cs = OUR_CS3; break;
      default:
        fprintf(stderr, "Invalid CS value %d\n", v);
      }

      css[ncs++] = cs;
    }

    for (i = 0; i < ncs; i++)
      printf("<%d> ", css[i]);

    printf("\n");
  }

  if (ac > 2)
    value = atoi(av[2]);

  if (ac > 3) {
    low = value;
    high = atoi(av[3]);
  }

  if (!bcm2835_init())
    return 1;

  bcm2835_gpio_fsel(OUR_CS2_PIN, BCM2835_GPIO_FSEL_OUTP);
  bcm2835_gpio_fsel(OUR_CS3_PIN, BCM2835_GPIO_FSEL_OUTP);
  set(OUR_CS2, HIGH);
  set(OUR_CS3, HIGH);

  bcm2835_spi_begin();
  bcm2835_spi_setDataMode(BCM2835_SPI_MODE0);
  bcm2835_spi_setClockDivider(BCM2835_SPI_CLOCK_DIVIDER_65536);

  /* blinkelichts mode? */
  if (value == -1) {
    char off[2] = { 0x3f, 0x00 };
    char on[2] = { 0x30, 0x00 };
    char rbuf[2];

    while (1) {
      fprintf(stderr, "1");
      for (i = 0; i < ncs; i++)
        transfer(css[i], on);
      sleep(1);

      fprintf(stderr, "0");
      for (i = 0; i < ncs; i++)
        transfer(css[i], off);
      sleep(1);
    }
  }
  /* triangle wave? */
  else if (low >= 0 && high > low) {
    int interval = 5 * 1000000 * (1.0 / (high - low));
    int step = 1;

    printf("interval = %d us", interval);

    while (1) {
      char wbuf[2];
      struct timespec start, end;
      long int measured;

      for (value = low; value <= high; value += step) {
        fprintf(stderr, "+%d \r", value);

        encode(value, wbuf);

        clock_gettime(CLOCK_MONOTONIC, &start);

        for (i = 0; i < ncs; i++)
          transfer(css[i], wbuf);

        clock_gettime(CLOCK_MONOTONIC, &end);

        measured = (end.tv_sec - start.tv_sec) * 1.0e6 +
          (end.tv_nsec - start.tv_nsec) / 1000.0 / step;

        if (((float) measured / (float) interval) > 1.1) {
          if (debug)
            fprintf(stderr, "> s %d m %d i %d\n", step, measured, interval);
          step++;
        } else if (((float) measured / (float) interval) < 0.9) {
          if (debug)
            fprintf(stderr, "< s %d m %d i %d\n", step, measured, interval);
          step--;
        } else if (measured < interval) {
          usleep(interval - measured);
        }
      }

      for (value = high - 1; value >= low; value -= step) {
        fprintf(stderr, "-%d \r", value);

        encode(value, wbuf);

        clock_gettime(CLOCK_MONOTONIC, &start);

        for (i = 0; i < ncs; i++)
          transfer(css[i], wbuf);

        clock_gettime(CLOCK_MONOTONIC, &end);

        measured = (end.tv_sec - start.tv_sec) * 1.0e6 +
          (end.tv_nsec - start.tv_nsec) / 1000.0 / step;

        if (((float) measured / (float) interval) > 1.1) {
          if (debug)
            fprintf(stderr, "> s %d m %d i %d\n", step, measured, interval);
          step++;
        } else if (((float) measured / (float) interval) < 0.9) {
          if (debug)
            fprintf(stderr, "< s %d m %d i %d\n", step, measured, interval);
          step--;
        } else if (measured < interval) {
          usleep(interval - measured);
        }
      }
    }
  }

  /* set the given value instead then */
  else {
    char wbuf[2];
    encode(value, wbuf);
    for (i = 0; i < ncs; i++)
      transfer(css[i], wbuf);

    fprintf(stderr, "%02x %02x\n", wbuf[0], wbuf[1]);
  }

  bcm2835_spi_end();
}
