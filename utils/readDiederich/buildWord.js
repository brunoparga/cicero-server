const classify = require('./classify');
const lemmatize = require('./lemmatize');
const setProperties = require('./properties/setProperties');

module.exports = ([lemma, definition]) => {
  const partOfSpeech = classify(lemma, definition);
  return {
    partOfSpeech,
    lemma: lemmatize(lemma),
    english: definition,
    learned: false,
    properties: setProperties(partOfSpeech, lemma),
  };
};
