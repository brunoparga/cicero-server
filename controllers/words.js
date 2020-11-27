"use strict";

const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const { User, Word } = require("../models");

async function getWordsLearn(request, response) {
  const words = await Word.forLearn(request.userId);
  const wordsToSend = words.map((word) => ({ ...word, learned: false }));

  response.json(wordsToSend);
}

async function getWordsReview(request, response) {
  const words = await Word.forReview(request.userId);
  const wordsToSend = words.map((word) => ({ ...word, learned: true }));

  response.json(wordsToSend);
}

async function postWords(request, response) {
  const user = await User.findByPk(request.userId);

  await user.addWords(request.body);
  response
    .status(StatusCodes.ACCEPTED)
    .json({ message: ReasonPhrases.ACCEPTED });
}

module.exports = { getWordsLearn, getWordsReview, postWords };
