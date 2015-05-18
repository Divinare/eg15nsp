var express = require('express'),
  app = module.exports = express()
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorhandler = require('errorhandler'),
  morgan = require('morgan'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var ;


app.set('port', process.env.PORT || 3000);
  .use(morgan('dev'))
  .use(bodyParser())
  .use(methodOverride())
  .use(express.static('build'))
  .use(bodyParser.json());

var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  app.use(errorhandler());
}

if (env === 'production') {
  // TODO
}


app.get('/api/sensors', api.sensors);
app.get('/api/measurements', api.measurements);
app.get('/api/measurements/:id', api.measurement);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
