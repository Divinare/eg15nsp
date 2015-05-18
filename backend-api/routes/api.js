
var express = require('express'),
		router = express.Router(),
		sqlite3 = require('sqlite3').verbose(),
		Models = require('../models/api.js');


exports.measurements = function(req,res) {
	Models.Measurement.findAll().then(function(measurements){
		res.json(measurements);
	});

};

exports.measurement = function( req, res) {
	var sensorId = req.params.id;
	Models.Measurement.findOne({
		where: { id: sensorId}
	}).then(function( sensor) {
		res.json(sensor);
	})

}

exports.sensors = function (req, res) {
	Models.Sensor.findAll().then(function(sensors){
		res.json(sensors);
	});
};

exports.controls = function (req, res) {
	Models.Control.findAll().then(function(controls){
		res.json(controls);
	});
};
