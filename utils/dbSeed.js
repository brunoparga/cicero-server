const fs = require('fs');

const Word = require('../models/word');

const { words } = JSON.parse(fs.readFileSync('db.json', 'utf8'));

(async () => {
  await Word.sync({ force: true });
  Word.bulkCreate(words)
    .then((res) => {
      const wordList = res.map((word) => word.lemma).sort()
      console.log(`${res.length} words added to the database: ${wordList.join('; ')}`
    )})
    .catch((err) => console.log(err))
})();