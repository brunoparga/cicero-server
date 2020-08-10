const { Sequelize, Model, DataTypes } = require('sequelize');

const URI = 'postgres://bruno:Q8Pv8bX9xYZN2bx5SHLF8g3Bqcy@localhost:5432/cicero';
const sequelize = new Sequelize(URI);

class Word extends Model {
  // Public interface
  // Fetch words with their options and present them to controller
  static async fetch() {
    const words = await this.findAll(this.wordFindParams);
    // TODO: do the options thing in one fell swoop
    const wordsWithOptions = await Promise.all(words.map(this.addOptions.bind(this)));
    return wordsWithOptions;
  }

  /*
    Private methods
  */

  // SELECT only the relevant things from each drilled word to send to the front-end
  static get wordFindParams() {
    return {
      // TODO: make this LIMIT customizable
      limit: 10,
      // TODO: replace this shuffling with something smarter
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
  // TODO: make this smarter than three random words from the same part of spech
  static optionsFindParams(word) {
    return {
      order: [Sequelize.literal('RANDOM()')],
      limit: 3,
      where: { partOfSpeech: word.dataValues.questionType },
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

module.exports = Word.init({
  partOfSpeech: DataTypes.STRING,
  english: DataTypes.STRING,
  lemma: DataTypes.STRING,
  learned: DataTypes.BOOLEAN,
  properties: DataTypes.JSONB,
}, { sequelize, modelName: 'word' });
