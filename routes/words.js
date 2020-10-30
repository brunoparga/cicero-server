const wordRouter = require('express').Router();

const Word = require('../models/word');

wordRouter.get('/words', async (_, res) => {
  const words = await Word.fetch();
  res.json(words);
});

wordRouter.post('/words', (_, res) => res.status(202).json({ message: 'Accepted' }));

module.exports = wordRouter;
