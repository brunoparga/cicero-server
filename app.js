const express = require('express');
const cors = require('cors');

const Word = require('./models/word');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/words', async (_, res) => {
  const words = await Word.fetch();
  res.json(words);
});

app.listen(3001);
