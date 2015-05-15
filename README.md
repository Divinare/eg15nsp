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

## Running test environment under Docker

Fist ensure you have Docker and Docker Compose correctly set up:

    $ docker -v
    $ docker-compose -v

You'll need a working database in the `shared` directory:

    $ sqlite3 shared/database.sqlite <schema.sql

Build and run the setup:

    $ docker-compose build
    $ docker-compose up

Now you should be able to use the `collector` in mock mode (in another
terminal window):

    $ raspi/collector --mock 1

This should generate something like this on the mock collector output:

    INFO:collector:Sending mock temperature 19.14°C
    INFO:collector:Sending mock temperature 19.41°C

and correspondingly on the `docker-compose` window:

    broker_1 | 1431709838: mosquitto version 0.15 (build date 2013-08-23 19:23:43+0000) starting
    broker_1 | 1431709838: Opening ipv4 listen socket on port 1883.
    broker_1 | 1431709838: Opening ipv6 listen socket on port 1883.
    broker_1 | 1431709840: New connection from 172.17.0.39.
    broker_1 | 1431709840: New client connected from 172.17.0.39 as paho/DF70C67C6C7EDD79F1.
    storer_1 | INFO:storer:storer: Reading from broker:1883, storing to sqlite:////shared/database.sqlite
    storer_1 | INFO:storer:Connected
    broker_1 | 1431709843: New connection from 192.168.99.1.
    broker_1 | 1431709843: New client connected from 192.168.99.1 as paho/F871883EEC43CD9D57.
    storer_1 | INFO:storer:1.1 @ 2015-05-15 20:10:44.637692+00:00 = 19.14      (temperature)
    storer_1 | INFO:storer:1.1 @ 2015-05-15 20:11:44.640284+00:00 = 19.41      (temperature)

Then you should be able to access also the REST API:

    $ wget -qO- http://localhost:3000/
