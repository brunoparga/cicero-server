const setNounProperties = require('./setNounProps');

const setAdjectiveProperties = () => ({});

const setVerbProperties = () => ({});

module.exports = (partOfSpeech, lemma) => {
  if (partOfSpeech === 'Adjective') {
    // return setAdjectiveProperties(lemma);
  } if (partOfSpeech === 'Noun') {
    return setNounProperties(lemma);
  } if (partOfSpeech === 'Verb') {
    // return setVerbProperties(lemma);
  }
  // return {};
};
