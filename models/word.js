require('dotenv').config();
const {
  Sequelize, Model, DataTypes, Op,
} = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Word extends Model {
  // Public interface
  // Fetch words with their options and present them to controller
  static async fetch() {
    const words = await this.findAll(this.wordFindParams);
    // STRETCH: do the options thing in one fell swoop
    const wordsWithOptions = await Promise.all(words.map(this.addOptions.bind(this)));
    return wordsWithOptions;
  }

  /*
    Private methods
  */

  // SELECT only the relevant things from each drilled word to send to the front-end
  static get wordFindParams() {
    return {
      // STRETCH: make this LIMIT customizable
      limit: 10,
      // STRETCH: replace this shuffling with something smarter
      order: [Sequelize.literal('RANDOM()')],
      attributes: [['partOfSpeech', 'questionType'], 'lemma', 'english', 'learned', 'properties'],
    };
  }

  // Find the options to add to each word
  static async addOptions(word) {
    const options = await this.findAll(this.optionsFindParams(word));
    return this.buildWord(word, options);
  }

  // SELECT wrong options to accompany the correct word
  static optionsFindParams(word) {
    return {
      order: [Sequelize.literal('RANDOM()')],
      limit: 3,
      where: {
        partOfSpeech: word.dataValues.questionType,
        lemma: { [Op.not]: word.dataValues.lemma },
      },
      attributes: ['lemma'],
    };
  }

  // Add the options to the word for dispatching to the front-end
  static buildWord(word, options) {
    return {
      ...word.dataValues,
      // Remove this to make teaching work
      learned: true,
      options: options.map((row) => row.dataValues.lemma),
    };
  }
}

// Define the schema and model name, which doesn't get inferred from the class name.
module.exports = Word.init({
  partOfSpeech: DataTypes.STRING,
  english: DataTypes.STRING,
  lemma: DataTypes.STRING,
  learned: DataTypes.BOOLEAN,
  properties: DataTypes.JSONB,
}, { sequelize, modelName: 'word' });
