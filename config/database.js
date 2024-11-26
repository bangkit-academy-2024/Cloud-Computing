const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('cloud', 'cloud', 'cloud123', {
  host: '178.63.100.123',
  dialect: 'mysql',
  port: '63306',
  logging: false,
});

module.exports = sequelize;
