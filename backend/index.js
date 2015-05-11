/**
* This is the main file of the app.
* Run in with the cmd: $ node index.js
* Get required libraries with: npm install
*/

var express = require('express');

//Create a new express.js web app:

var app = express();

//Conf the express with the settings in our conf.js

require('./config') (app);

//Add the routes that the app will react to,
// as def in our routes.js

/*
require('./routes')(app);
*/

//This file has been called directly with node index.js, start server:

app.listen(8080);
console.log('App running: http://localhost:8080');