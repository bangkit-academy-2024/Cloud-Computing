const { Sequelize } = require('sequelize');
require('dotenv').config();

const username = process.env.DB_USERNAME || 'root';
const password = process.env.DB_USERNAME_PASSWORD || '';
const dbname = process.env.DB_NAME || 'capstone';

const sequelize = new Sequelize(dbname, username, password, {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
