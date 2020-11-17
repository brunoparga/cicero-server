const { DataTypes, Model } = require('sequelize');

const sequelize = require('../db');

class User extends Model {}

module.exports = User.init({
  email: DataTypes.STRING,
  password: DataTypes.STRING,
}, { sequelize, modelName: 'user' });
