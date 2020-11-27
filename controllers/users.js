"use strict";

const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("../config");
const { User } = require("../models");

function hashPassword(password) {
  const saltLength = 12;

  return bcrypt.hash(password, saltLength);
}

async function signup(request, response) {
  const { email, password, confirmPassword } = request.body;

  // False positive - this only compares two user-provided strings, and
  // it doesn't expose the app to attacks.
  // eslint-disable-next-line security/detect-possible-timing-attacks
  if (password !== confirmPassword) {
    return response
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Passwords don't match." });
  }

  const user = await User.findOne({ where: { email } });

  if (user) {
    return response
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Account already exists. Please login." });
  }

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({ email, password: hashedPassword });
  const token = jwt.sign({ id: newUser.id }, config.TOKEN_SIGNING_SECRET, {
    expiresIn: "1h",
  });

  return response.status(StatusCodes.CREATED).json({ email, token });
}

async function signin(request, response) {
  const { email, password } = request.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return response
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Account does not exist. Please sign up." });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return response
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Wrong password. Please try again." });
  }

  const token = jwt.sign({ id: user.id }, config.TOKEN_SIGNING_SECRET, {
    expiresIn: "1h",
  });

  return response.status(StatusCodes.OK).json({ email, token });
}

module.exports = { signup, signin };
