require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const Word = require('./models/word');

const app = express();
app.use(cors({ origin: process.env.FRONT_END_URL }));
app.use(helmet());
app.use(compression());

app.get('/words', async (_, res) => {
  const words = await Word.fetch();
  res.json(words);
});

app.listen(process.env.PORT || 3001);
