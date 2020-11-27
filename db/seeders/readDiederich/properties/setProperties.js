"use strict";

const { isEmpty } = require("../helpers");

const setAdjectiveProperties = require("./setAdjectiveProperties");
const setNounProperties = require("./setNounProperties");
const setNumeralPronounProperties = require("./setNumeralAndPronounProperties");
const setVerbProperties = require("./setVerbProperties");
const wordNotes = require("./wordNotes");

function wordProperties(partOfSpeech, lemma) {
  if (partOfSpeech === "Adjective") {
    return setAdjectiveProperties(lemma);
  }

  if (partOfSpeech === "Noun") {
    return setNounProperties(lemma);
  }

  if (["Numeral", "Pronoun"].includes(partOfSpeech) && lemma.includes(",")) {
    return setNumeralPronounProperties(lemma);
  }

  if (partOfSpeech === "Verb") {
    return setVerbProperties(lemma);
  }
}

// Set the 'properties' attribute, which varies by part of speech and might
// contain grammar or usage notes
module.exports = (partOfSpeech, lemma) => {
  const result = {
    ...wordProperties(partOfSpeech, lemma),
    ...wordNotes(lemma),
  };

  return isEmpty(result) ? undefined : result;
};
