const wordRouter = require('express').Router();

const Word = require('../models/word');

wordRouter.get('/words', async (_, res) => {
  const words = await Word.fetch();
  res.json(words);
});

module.exports = wordRouter;
