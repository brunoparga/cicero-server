const { User, Word } = require('../models');

exports.getWordsLearn = async (req, res) => {
  const words = await Word.forLearn(req.userId);
  const wordsToSend = words.map((word) => ({ ...word, learned: false }));
  res.json(wordsToSend);
};

exports.getWordsReview = async (req, res) => {
  const words = await Word.forReview(req.userId);
  const wordsToSend = words.map((word) => ({ ...word, learned: true }));
  res.json(wordsToSend);
};

exports.postWords = async (req, res) => {
  const user = await User.findByPk(req.userId);
  await user.addWords(req.body);
  res.status(202).json({ message: 'Accepted' });
};
