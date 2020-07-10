const { Sequelize, Model, DataTypes } = require('sequelize');
const URI = 'postgres://bruno:Q8Pv8bX9xYZN2bx5SHLF8g3Bqcy@localhost:5432/cicero';
const sequelize = new Sequelize(URI);

class Word extends Model {};
module.exports = Word.init({
  questionType: DataTypes.STRING,
  english: DataTypes.STRING,
  lemma: DataTypes.STRING,
  learned: DataTypes.BOOLEAN,
  properties: DataTypes.JSONB
}, { sequelize, modelName: 'word' });