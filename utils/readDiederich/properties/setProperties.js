const setAdjectiveProperties = require('./setAdjProps');
const setNounProperties = require('./setNounProps');
const setNumeralPronounProperties = require('./setNumPronProps');
const setVerbProperties = require('./setVerbProps');

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

// eslint-disable-next-line no-restricted-syntax, guard-for-in
const isEmpty = (object) => { for (const i in object) { return false; } return true; };

// Add notes in the form of spelling variants, indeclinable words, comments etc.
const wordNotes = (lemma) => {
  const result = {};
  if (lemma.includes('(indecl.')) {
    result.indeclinable = true;
  }
  const alternate = lemma.match(/\[(.*)\]/);
  if (alternate) {
    [, result.alternateForm] = alternate;
  }
  return isEmpty(result) ? undefined : result;
};

module.exports = (partOfSpeech, lemma) => {
  const result = {
    ...wordProps(partOfSpeech, lemma),
    ...wordNotes(lemma),
  };
  return isEmpty(result) ? undefined : result;
};
