# Exactum Greenhouse 2015 Project

Participants: Miro Sorja, Joe Niemi, Santeri Paavolainen

Quick overview of components and directories:

* Raspberry PI (directory `raspi`)

    * Hardware for measurements and light control
	* "Sampler" and "Controller" programs
	* MQTT broker to bridge local to backend (mosquitto)

* Data Backend (`backend-data`)

    * "Storer" that collects measurements from MQTT topic
    * "Commander" that polls the database for changes in control
      metric values and sends them to the control topic
    * Database to store measurements
	* MQTT broker (that is bridged to from raspi)

* UI and front-end (`frontend` and `backend`)

    * Node.js server-side code to provide REST API to fetch
      measurements and set control values
	* Browser application to do all the fancy UI stuff

## How to run locally

WORK IN PROGRESS! Mock thingies work in progress.

`make setup-database` will set up a database with some mock values for
FE code to test with.

`raspi` and `backend-data` contain `mosquitto.conf` files suitable for
testing MQTT bridging.

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
