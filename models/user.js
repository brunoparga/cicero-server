const { DataTypes, Model } = require('sequelize');

class User extends Model {}

module.exports = User.init({
  email: DataTypes.STRING,
  password: DataTypes.STRING,
}, { sequelize, modelName: 'user' });
