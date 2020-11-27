"use strict";

const fs = require("fs");

const parseList = require("./readDiederich/parseMainList");

module.exports = {
  up: async (queryInterface) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    parseList();

    // The sync method here is okay because this runs infrequently.
    // eslint-disable-next-line node/no-sync
    const words = JSON.parse(fs.readFileSync("./db/seeders/db.json", "utf8"));

    await queryInterface.bulkInsert("Words", words);
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Words", undefined, {});
  },
};
