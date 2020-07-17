const { Sequelize, Model, DataTypes } = require('sequelize');

const URI = 'postgres://bruno:Q8Pv8bX9xYZN2bx5SHLF8g3Bqcy@localhost:5432/cicero';
const sequelize = new Sequelize(URI);

class Word extends Model {
  static async fetch() {
    const words = await this.findAll({
      limit: 10,
      where: { partOfSpeech: 'Adverb' },
      attributes: [['partOfSpeech', 'questionType'], 'lemma', 'english', 'learned', 'properties'],
    });
    const wordsWithOptions = await Promise.all(words.map(async (word) => {
      const options = await this.findAll({
        order: [Sequelize.literal('RANDOM()')],
        limit: 3,
        where: { partOfSpeech: word.dataValues.questionType },
        attributes: ['lemma'],
      });
      return {
        ...word.dataValues,
        // Remove this to make teaching work
        learned: true,
        options: options.map((row) => row.dataValues.lemma),
        properties: {},
      };
    }));
    return wordsWithOptions;
  }
}

module.exports = Word.init({
  partOfSpeech: DataTypes.STRING,
  english: DataTypes.STRING,
  lemma: DataTypes.STRING,
  learned: DataTypes.BOOLEAN,
  properties: DataTypes.JSONB,
}, { sequelize, modelName: 'word' });
