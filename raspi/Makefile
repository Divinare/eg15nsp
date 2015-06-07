all: setlight

setlight: setlight.c
	gcc setlight.c -o setlight -lbcm2835 -lrt

clean:
	rm -rf setlight tmp006.tar.gz Adafruit_Python_TMP-master
