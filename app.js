const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const Word = require('./models/word');

const app = express();
const origin = process.env.NODE_ENV === 'production'
  ? 'https://master.d2ylwpfde239og.amplifyapp.com'
  : 'http://localhost:3000';
app.use(cors({ origin }));
app.use(helmet());
app.use(compression());

app.get('/words', async (_, res) => {
  const words = await Word.fetch();
  res.json(words);
});

app.listen(process.env.PORT || 3001);
