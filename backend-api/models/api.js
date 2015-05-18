
var Database = require('../db/connection.js');


var Measurement = Database.sequelize.define('Measurement', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  device_id: Database.DataTypes.INTEGER,
  sensor_id: Database.DataTypes.INTEGER,
  sensed_time: Database.DataTypes.DATE,
  stored_time: Database.DataTypes.DATE,
  value: Database.DataTypes.FLOAT

});

var Sensor = Database.sequelize.define('Sensor', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  device_id: Database.DataTypes.INTEGER,
  type: Database.DataTypes.STRING,
  description: Database.DataTypes.TEXT
});

var Control = Database.sequelize.define('Control', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  device_id: Database.DataTypes.INTEGER,
  type: Database.DataTypes.STRING,
  description: Database.DataTypes.TEXT
});

var Value = Database.sequelize.define('Value', {
  control_id: Database.DataTypes.INTEGER,
  current: Database.DataTypes.FLOAT,
  target: Database.DataTypes.FLOAT,
  current_time: Database.DataTypes.DATE,
  target_time: Database.DataTypes.DATE
});

module.exports = {
	Measurement: Measurement,
	Sensor: Sensor,
  Control: Control,
  Value: Value
};