"use strict";

const { Model, Op, Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Word extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Word.belongsToMany(models.User, { through: "user-words" });
    }

    // Public interface
    // Fetch learned words with their options and present them to controller
    static async forReview(userId) {
      const words = await this.findAll(await this.wordFindParams(userId, true));

      // STRETCH: do the options thing in one fell swoop
      return Promise.all(words.map(this.addOptions.bind(this)));
    }

    static async forLearn(userId) {
      const words = await this.findAll(
        await this.wordFindParams(userId, false)
      );

      return words.map((word) => word.dataValues);
    }

    // Private methods

    // SELECT only the relevant things from each drilled word for the front-end
    static async wordFindParams(userId, includeKnown) {
      let wordColumn = "wordId";
      let userColumn = "userId";

      // eslint-disable-next-line node/no-process-env, no-console
      console.log(`Environment is: ${process.env.NODE_ENV}`);

      // eslint-disable-next-line node/no-process-env
      if (process.env.NODE_ENV !== "production") {
        wordColumn = "WordId";
        userColumn = "UserId";
      }

      const [
        query,
      ] = await sequelize.query(
        `SELECT "${wordColumn}" FROM "user-words" WHERE "user-words"."${userColumn}" = ?`,
        { replacements: [userId] }
      );
      const knownWords = query.map((userWord) => userWord.WordId);
      const operator = includeKnown ? Op.in : Op.notIn;

      return {
        // STRETCH: make this LIMIT customizable
        limit: 10,

        // STRETCH: replace this shuffling with something smarter
        order: [Sequelize.literal("RANDOM()")],

        // Include or exclude the words that this user has already learned
        where: { id: { [operator]: knownWords } },

        attributes: [
          "id",
          ["partOfSpeech", "questionType"],
          "lemma",
          "english",
          "properties",
        ],
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
        order: [Sequelize.literal("RANDOM()")],
        limit: 3,

        where: {
          partOfSpeech: word.dataValues.questionType,
          lemma: { [Op.not]: word.dataValues.lemma },
        },

        attributes: ["lemma"],
      };
    }

    // Add the options to the word for dispatching to the front-end
    static buildWord(word, options) {
      return {
        ...word.dataValues,
        options: options.map((row) => row.dataValues.lemma),
      };
    }
  }

  Word.init(
    {
      partOfSpeech: DataTypes.STRING,
      english: DataTypes.STRING,
      lemma: DataTypes.STRING,
      learned: DataTypes.BOOLEAN,
      properties: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: "Word",
    }
  );

  return Word;
};
