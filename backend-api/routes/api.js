
var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();

//var db = new sqlite3.Database('../../database.sqlite');
var Models = require('../models/api.js');


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
