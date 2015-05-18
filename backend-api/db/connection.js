
var Sequelize = require('sequelize');

var sequelize = new Sequelize('database', '', '', {
    dialect: 'sqlite',
    storage: process.env.BACKEND_SQLITE_DB || '../shared/database.sqlite'
});

console.log(sequelize);

module.exports = {
  DataTypes: Sequelize,
  sequelize: sequelize
};
