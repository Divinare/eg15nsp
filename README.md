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

# HackLab Environment

*This is just notes to keep them somewhere accessible.*

Raspi is on `Hacklab` network, using DHCP, at least recently at
address `192.168.110.137`. Login to it is user `pi` with password
`pee1aiQuiuFo`. Please, after login, set up your own account with:

    sudo -s
    useradd -m -G sudo,i2c,spi,gpio <username>
    passwd <username>

# Backend Server

Backend server is a `t2.micro` AWS instance running with DynDNS
address `eg15nsp.hopto.org`.
