const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('cloud', 'cloud', 'cloud123', {
  host: 'localhost', // 34.142.170.117
  dialect: 'mysql',
  port: '3306',
  logging: false,
});

module.exports = sequelize;
