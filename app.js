const express = require('express');
const cors = require('cors');

const Word = require('./models/word');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/words', async (_, res) => {
  const words = await Word.fetch();
  console.log(words);
  // const words = await Word.findAll({
  // where: { lemma: 'crūdēlis' },
  //   attributes: [['partOfSpeech', 'questionType'], 'lemma', 'english', 'learned', 'properties'],
  // })
  res.json(words);
});

app.listen(3001);
