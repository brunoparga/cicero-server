"use strict";

const classify = require("./classify");
const lemmatize = require("./lemmatize");
const setProperties = require("./properties/setProperties");

// Receive an array with a lemma, which is the dictionary form of a word,
// and also its definition; return an object that is used to seed the DB.
module.exports = ([lemmaFromList, definition]) => {
  const partOfSpeech = classify(lemmaFromList, definition);

  return {
    partOfSpeech,
    lemma: lemmatize(lemmaFromList),
    english: definition,
    learned: false,
    properties: setProperties(partOfSpeech, lemmaFromList),
  };
};
