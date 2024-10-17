const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definisikan model User
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  history: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  // Opsi lain
  tableName: 'users',
});

module.exports = User;
