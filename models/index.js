"use strict";

const fs = require("fs");
const path = require("path");

const Sequelize = require("sequelize");

// The linter won't be satisfied with any of the places I put lines (or not)
// eslint-disable-next-line import/order
const processConfig = require("../config");

const basename = path.basename(__filename);
const environment = processConfig.NODE_ENV || "development";

const config = require("../db/config.js")[environment];

const database = {};

const sequelize = new Sequelize(config.url, config);

const lastThreeChars = -3;

// This runs only once as the server starts
// eslint-disable-next-line node/no-sync
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(lastThreeChars) === ".js"
  )
  .forEach((file) => {
    // eslint-disable-next-line node/global-require, import/no-dynamic-require, security/detect-non-literal-require
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );

    database[model.name] = model;
  });

Object.keys(database).forEach((modelName) => {
  if (database[modelName].associate) {
    database[modelName].associate(database);
  }
});

database.sequelize = sequelize;
database.Sequelize = Sequelize;

module.exports = database;
