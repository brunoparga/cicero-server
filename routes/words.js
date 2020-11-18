require('dotenv').config();
const jwt = require('jsonwebtoken');
const wordRouter = require('express').Router();

const User = require('../models/User');
const Word = require('../models/Word');

wordRouter.get('/words', async (req, res) => {
  const words = await Word.fetch();
  const token = req.get('Authorization').split(' ')[1] || '';
  let decodedToken;
  if (token) {
    decodedToken = jwt.verify(token, process.env.TOKEN_SIGNING_SECRET);
  }
  const user = await User.findByPk(decodedToken.id);
  let userWords = [];
  if (user) {
    // Get all the words the user has learned so far
    const db = await user.getWords({ raw: true });
    userWords = db.map((word) => word.id);
  }
  const wordsToSend = words.map((word) => ({ ...word, learned: userWords.includes(word.id) }));
  res.json(wordsToSend);
});

wordRouter.post('/words', async (req, res) => {
  const token = req.get('Authorization').split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_SIGNING_SECRET);
  const user = await User.findByPk(decodedToken.id);
  await user.addWords(req.body);
  res.status(202).json({ message: 'Accepted' });
});

module.exports = wordRouter;
