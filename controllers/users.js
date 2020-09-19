require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
    return res.status(403).json({ message: 'Account exists. Please login.' });
  }
  const hashedPw = await bcrypt.hash(password, 12);
  const newUser = await User.create({ email, password: hashedPw });
  return res.status(201).json(newUser);
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(403).json({ message: 'Account does not exist. Please sign up.' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(403).json({ message: 'Wrong password. Please try again.' });
  }
  const token = jwt.sign(
    { id: user.id },
    process.env.TOKEN_SIGNING_SECRET,
    { expiresIn: '1h' },
  );
  return res.status(200).json({ email, token });
};
