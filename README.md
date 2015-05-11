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
