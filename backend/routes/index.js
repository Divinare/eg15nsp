var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();

//var db = new sqlite3.Database('../../database.sqlite');
var Models = require('../models');






exports.index = function(req,res) {


	Models.Measurement.findAll().then(function(measurements){
	  	console.log(measurements);
		res.json(measurements);
	});

};



/*
exports.index = function(req, res){
  //res.render('index');

  Models.Measurement.findAll().then(function(measurements){
	  console.log(measurements);
	  res.json(measurements);

});

  res.send('hello world');
};
*/

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};

/*
app.get('/', function(req, res) {
  res.send('hello world');
});
*/