"use strict";

const config = require("../config");

module.exports = {
  development: {
    url: config.DATABASE_URL,
    dialect: "postgres",
  },

  test: {
    url: config.TEST_DATABASE_URL,
    dialect: "postgres",
  },

  production: {
    url: config.DATABASE_URL,
    dialect: "postgres",
  },
};
