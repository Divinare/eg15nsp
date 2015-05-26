
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

exports.value = function (req, res) {
	var controlId = req.params.id;
	Models.Value.findOne({
		where: { control_id: controlId}
	}).then(function( controlValue) {
		res.json(controlValue);
	})
};

exports.updateValue = function (req, res) {
	var controlId = req.params.id;
	Models.Value.findOne({
		where: { control_id: controlId}
	}).then(function( controlValue) {
		console.log("props:");
		for(prop in req.body) {
			 if(prop == "current" || prop == "target" || prop == "current_time" || prop == "target_time") {
			      controlValue[prop] = req.body[prop];
			 }
		}
		controlValue.save(function(err) {
	        if (err) {
	           return res.send(err);
	        }
		res.send(200);
		});
	});
}