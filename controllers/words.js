const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Word = require('../models/Word');

exports.getWordsReview = async (req, res) => {
  const token = req.get('Authorization').split(' ')[1] || '';
  let decodedToken;
  if (token) {
    decodedToken = jwt.verify(token, process.env.TOKEN_SIGNING_SECRET);
  }
  const words = await Word.forReview(decodedToken.id);
  const wordsToSend = words.map((word) => ({ ...word, learned: true }));
  res.json(wordsToSend);
};

exports.postWords = async (req, res) => {
  const token = req.get('Authorization').split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_SIGNING_SECRET);
  const user = await User.findByPk(decodedToken.id);
  await user.addWords(req.body);
  res.status(202).json({ message: 'Accepted' });
};
