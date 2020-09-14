const express = require('express');

const Word = require('../models/word');

const router = express.Router();

router.get('/words', async (_, res) => {
  const words = await Word.fetch();
  res.json(words);
});

module.exports = router