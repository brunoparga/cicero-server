"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Words", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      partOfSpeech: {
        type: Sequelize.STRING,
      },

      english: {
        type: Sequelize.STRING,
      },

      lemma: {
        type: Sequelize.STRING,
      },

      learned: {
        type: Sequelize.BOOLEAN,
      },

      properties: {
        type: Sequelize.JSONB,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Words", { cascade: true });
  },
};
