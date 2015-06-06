#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

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

  bcm2835_gpio_write(pin, on);
}

void transfer(uint8_t cs, char* wbuf)
{
  char rbuf[2];

  if (cs == OUR_CS2 || cs == OUR_CS3)
    set(cs, LOW);

  bcm2835_spi_transfernb(wbuf, rbuf, 2);

  if (cs == OUR_CS2 || cs == OUR_CS3)
    set(cs, HIGH);
}

int main(int ac, char *av[])
{
  uint8_t cs = BCM2835_SPI_CS0;
  int value = -1;

  if (ac > 1) {
    int v = atoi(av[1]);

    switch (v) {
    case 0: cs = BCM2835_SPI_CS0; break;
    case 1: cs = BCM2835_SPI_CS1; break;
    case 2: cs = OUR_CS2; break;
    case 3: cs = OUR_CS3; break;
    default:
      fprintf(stderr, "Invalid CS value %d\n", v);
    }
  }

  if (ac > 2)
    value = atoi(av[2]);

  if (!bcm2835_init())
    return 1;

  bcm2835_gpio_fsel(OUR_CS2_PIN, BCM2835_GPIO_FSEL_OUTP);
  bcm2835_gpio_fsel(OUR_CS3_PIN, BCM2835_GPIO_FSEL_OUTP);
  set(OUR_CS2, HIGH);
  set(OUR_CS3, HIGH);

  bcm2835_spi_begin();
  bcm2835_spi_setDataMode(BCM2835_SPI_MODE0);
  bcm2835_spi_setClockDivider(BCM2835_SPI_CLOCK_DIVIDER_65536);

  if (cs == BCM2835_SPI_CS0 || cs == BCM2835_SPI_CS1) {
    bcm2835_spi_chipSelect(cs);
    bcm2835_spi_setChipSelectPolarity(cs, LOW);
  }

  /* blinkelichts mode? */
  if (value == -1) {

    char off[2] = { 0x3f, 0x00 };
    char on[2] = { 0x30, 0x00 };
    char rbuf[2];

    while (1) {
      fprintf(stderr, "1");
      transfer(cs, on);
      sleep(1);

      fprintf(stderr, "0");
      transfer(cs, off);
      sleep(1);
    }
  }
  /* set the given value instead then */
  else {
    char wbuf[2];
    wbuf[0] = 0x30 | (value >> 8) & 0x0f;
    wbuf[1] = value & 0xff;
    transfer(cs, wbuf);

    fprintf(stderr, "%02x %02x\n", wbuf[0], wbuf[1]);
  }

  bcm2835_spi_end();
}
