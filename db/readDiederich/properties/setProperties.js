const setAdjectiveProperties = require('./setAdjProps');
const setNounProperties = require('./setNounProps');
const setNumeralPronounProperties = require('./setNumPronProps');
const setVerbProperties = require('./setVerbProps');
const { isEmpty } = require('../helpers');
const wordNotes = require('./wordNotes');

const wordProps = (partOfSpeech, lemma) => {
  if (partOfSpeech === 'Adjective') {
    return setAdjectiveProperties(lemma);
  } if (partOfSpeech === 'Noun') {
    return setNounProperties(lemma);
  } if (['Numeral', 'Pronoun'].includes(partOfSpeech) && lemma.includes(',')) {
    return setNumeralPronounProperties(lemma);
  } if (partOfSpeech === 'Verb') {
    return setVerbProperties(lemma);
  }
  return undefined;
};

// Set the 'properties' attribute, which varies by part of speech and might contain grammar or
// usage notes
module.exports = (partOfSpeech, lemma) => {
  const result = {
    ...wordProps(partOfSpeech, lemma),
    ...wordNotes(lemma),
  };
  return isEmpty(result) ? undefined : result;
};
