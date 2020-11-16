/* eslint-disable no-console */
const fs = require('fs');

const Word = require('../models/word');

// Read the JSON file and seed the DB word table
const words = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

(async () => {
  await Word.sync({ force: true });
  Word.bulkCreate(words)
    .then((res) => console.log(`${res.length} words added to the database`))
    .catch((err) => console.log(err));
})();
