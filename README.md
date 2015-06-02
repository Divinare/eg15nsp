# Exactum Greenhouse 2015 Project

Participants: Miro Sorja, Joe Niemi, Santeri Paavolainen

Quick overview of components and directories:

* Raspberry PI (directory `raspi`)

    * Hardware for measurements and light control
	* "Sampler" and "Controller" programs
	* MQTT broker to bridge local to backend (mosquitto)

* Data Storer  (`backend-storer`)

    * "Storer" that collects measurements from MQTT topic

* Broker (`backend-broker`)

	* MQTT broker (that is bridged to from raspi)

* API Backend (`backend-api`)

	* Node application providing REST API to the measurement and
	  device data

* UI Browser App (`frontend`)

	* Browser application to do all the fancy UI stuff

## How to run locally

WORK IN PROGRESS! Mock thingies work in progress.

`make setup-database` will set up a database with some mock values for
FE code to test with.

`raspi` and `backend-broker` contain `mosquitto.conf` files suitable
for testing MQTT bridging.

### collector

Collector is the process which runs on RasPi and collects measurements
from sensors and sends them to the backend via MQTT broker.

Currently the list of sensors used and their measurements functions
are hard-coded to the program, and cannot be changed. Some other
aspects of the program are configurable via command line (although the
defaults are correct ones for our deployment environment):

    $ ./collector --broker 1.2.3.4 --interval 300 --debug --mock 1

The id number (`1` in above) is mandatory. It identifies the
node. Collector can also provide dummy temperature measurement values
if `--mock` is given.

### storer

Storer subscribes to sensor and activity updates from nodes at MQTT
broker, and stores the updates in a database. Again, default values
should be valid for our environment, but additional options may be
given:

    $ ./storer --database mysql://user:pass@localhost/name --debug --broker 127.0.0.2 --broker-port 1884

## Running Test Environment With Docker

Fist ensure you have Docker and Docker Compose correctly set up:

    $ docker -v
    $ docker-compose -v

Then run the whole environment containing a mock temperature data
generator:

    $ make mock

You should be seeing something like this occur (among all other
output):

    api_1    | Express server listening on port 3000
    broker_1 | 1431753282: mosquitto version 0.15 (build date 2013-08-23 19:23:43+0000) starting
    broker_1 | 1431753282: Opening ipv4 listen socket on port 1883.
    broker_1 | 1431753282: Opening ipv6 listen socket on port 1883.
    broker_1 | 1431753283: New connection from 172.17.0.154.
    broker_1 | 1431753283: New client connected from 172.17.0.154 as paho/FDF40628712301904D.
    broker_1 | 1431753285: New connection from 172.17.0.156.
    broker_1 | 1431753285: New client connected from 172.17.0.156 as paho/D26E2D470C63D3D9E4.
    storer_1 | INFO:storer:storer: Reading from broker:1883, storing to sqlite:////shared/database.sqlite
    storer_1 | INFO:storer:Connected
    mock_1   | INFO:collector:Sending mock temperature 27.31°C
    storer_1 | INFO:storer:1.1 @ 2015-05-16 05:15:13.788781+00:00 = 27.31      (temperature)
    mock_1   | INFO:collector:Sending mock temperature 27.15°C
    storer_1 | INFO:storer:1.1 @ 2015-05-16 05:15:43.821647+00:00 = 27.15      (temperature)

Then you should be able to access also the REST API:

    $ wget -qO- http://localhost:3000/

## eg15nsp.hopto.org server

The "global" MQTT server is located at `eg15nsp.hopto.org`. It
requires authentication. The setup uses username `raspi` with password
`Zi9koochiDah`.

To deploy a new version of the code use:

    $ ssh -A eg15nsp.hopto.org
    $ cd eg15nsp
    $ git pull
    $ make setup-backend deploy-backend

The instance has ports 22 (SSH) and 1883 (MQTT) exposed. The API port
3000 is **not** public, so if you want to access it use SSH port
forwarding.

# HackLab Environment und das Blinkenlichts

*This is just notes to keep them somewhere accessible.*

Raspi is on `Hacklab` network, using DHCP, at least recently at
address `192.168.110.137`. Login to it is user `pi` with password
`pee1aiQuiuFo`. Please, after login, set up your own account with:

    sudo -s
    useradd -m -G sudo,i2c,spi,gpio <username>
    passwd <username>

Blinking of leds using the SPI bus:

    cd ~santtu/spincl
	sudo -s
    d=0.5; while true; do; ./spincl -ib -m0 -c0 -s0 -p0 2 0x30 0x00; sleep $d; ./spincl -ib -m0 -c0 -s0 -p0 2 0x3f 0xff; sleep $d; done

This assumes that SPI bus is connected, and CE0 is connected to CS of
the DAC. E.g.

    Raspi pin       <--->      MCP4821 pin
	19 (MOSI)                  4 (SDI)
	23 (SCKL)                  3 (SCK)
    24 (CE0)                   2 (C̅S̅)

Also on MCP4821 you'll need to

* Connect VDD and VSS to +5V and GND on Raspi, also add a small
  capacitor betweed VDD and GND and VOUT and GND
* Connect L̅D̅A̅C̅ to GND (VSS)

When connecting DAC (MCP4821) to the MOSFET driver board, remember
that you'll need to connect grounds from **both** Raspi and the LED
power transformer!

# Backend Server

Backend server is a `t2.micro` AWS instance running with DynDNS
address `eg15nsp.hopto.org`.


# Sensors

## Grove Digital Light Sensor

Grove digital light sensor pinout:

1. GND
2. VCC
3. SDA
4. SCL

`raspi/grove/grove` is a program that will do five samples and output
the values. `raspi/collector` knows how to use those values. Note that
`requirements-2.txt` is probably not up to date at the moment (it
works in the raspi, but probably not in a pristine environment).

Output from `./collector --debug 1` with the light sensor:

	~/eg15nsp/raspi eg15nsp $ ./collector 1 --debug
	DEBUG:collector:args=Namespace(broker='localhost', broker_port=1883, id='1', interval=60, logging=10, mock=False)
	DEBUG:collector:client=<paho.mqtt.client.Client object at 0xb69096f0>
	DEBUG:collector:Measuring ...
	DEBUG:collector:grove/grove output: b'{"lux": 0.0, "ir": 35078.0, "saturated": false, "ambient": 7777.2}\n'
	DEBUG:collector:values: {'light': 0.0}
	DEBUG:collector:Sending node/1/sensor/light = 0.0
	DEBUG:collector:Sending alive signal to node/1/active
	DEBUG:collector:Sleeping for 60s
	DEBUG:collector:Measuring ...
	DEBUG:collector:grove/grove output: b'{"lux": 202.07438, "ir": 20843.4, "saturated": false, "ambient": 35310.8}\n'
	DEBUG:collector:values: {'light': 202.07438}
	DEBUG:collector:Sending node/1/sensor/light = 202.07438
	DEBUG:collector:Sending alive signal to node/1/active
	DEBUG:collector:Sleeping for 60s

# Raspi to DAC to RGB drivers

LEDs are driven by a separate driver with a MOSFET, one for each
color. The driver gets its input from a DAC which in turn is driven
from Raspi via SPI bus. Thus the connections are:

    Raspi pin       <--->      MCP4821 pin
	19 (MOSI)                  4 (SDI)
	23 (SCKL)                  3 (SCK)
    24 (CE0)                   2 (C̅S̅)

Note that `CE0` needs to be changed to `CE1` and other lines, one for
each separate DAC.

From MCP4821 to the LED driver the pins are:

    MCP4821 pin     <--->      LED driver
	8 (VOUT)                   1 (DAC IN)

The pins in the LED driver are (watch for the orientation!!!):

    LED driver
    1  DAC IN
	2  GND
	3  GND
	4  VIN (+12 V)
	5  LED-
	6  LED+ 1 (for one LED series)
	7  LED+ 2 (another)
	8  LED+ 3 (third)
