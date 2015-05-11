
var Sequelize = require('sequelize');

var sequelize = new Sequelize('database', '', '', {
  dialect: 'sqlite',
  storage: '../database.sqlite'
});

console.log(sequelize);

module.exports = {
  DataTypes: Sequelize,
  sequelize: sequelize
};