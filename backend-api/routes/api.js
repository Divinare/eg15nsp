
var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();

//var db = new sqlite3.Database('../../database.sqlite');
var Models = require('../models');


exports.all = function(req,res) {
	Models.Measurement.findAll().then(function(measurements){
		res.json(measurements);
	});

};

exports.sensor = function( req, res) {
	var sensorId = req.params.id;
	Models.Measurement.findOne({
		  where: { id: sensorId}
	}).then(function( sensor) {
	      res.json(sensor);
	})

}
