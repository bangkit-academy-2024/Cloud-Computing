const { Sequelize } = require('sequelize');

// Konfigurasi koneksi database
const sequelize = new Sequelize('capstone', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
