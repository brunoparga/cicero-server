require('dotenv').config();
const jwt = require('jsonwebtoken');
const wordRouter = require('express').Router();

const { sequelize } = require('../models/User');
const User = require('../models/User');
const Word = require('../models/Word');

wordRouter.get('/words', async (_, res) => {
  const words = await Word.fetch();
  res.json(words);
});

wordRouter.post('/words', async (req, res) => {
  const token = req.get('Authorization').split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_SIGNING_SECRET);
  const user = await User.findByPk(decodedToken.id);
  await user.addWords(req.body);
  const [results] = await sequelize.query('SELECT * FROM "user-words"');
  console.log(results);
  res.status(202).json({ message: 'Accepted' });
});

module.exports = wordRouter;
