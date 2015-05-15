
var Database = require('../db/connection.js');


var Measurement = Database.sequelize.define('Measurement', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  device_id: Database.DataTypes.INTEGER,
  sensor_id: Database.DataTypes.INTEGER,
  sensed_time: Database.DataTypes.DATE,
  stored_time: Database.DataTypes.DATE,
  value: Database.DataTypes.FLOAT

});

module.exports = {
	Measurement: Measurement
};