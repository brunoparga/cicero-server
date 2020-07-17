// Include words that the general rules wouldn't send to the right part of speech
const uniqueWords = require('./manualList');
const treat = require('./treatDefinition');

const classifyByDefinition = (definition) => {
  const definitionStrings = {
    'pron.': 'Pronoun',
    'conj.': 'Conjunction',
    'prep.': 'Preposition',
    'num.': 'Numeral',
    '!': 'Interjection',
    'adv. and prep.': 'Adverb, Preposition',
  };

  return Object.keys(definitionStrings)
    .reduce((partOfSpeech, substring) => {
      if (definition.toLowerCase().includes(substring)) {
        return definitionStrings[substring];
      }
      return partOfSpeech;
    }, 'Adverb');
};

const classifyByLemma = (lemma, definition) => {
  if (lemma.match(/(m|f|n)\./)) {
    return 'Noun';
  } if (lemma.split(',').length === 4 || treat(definition).match(/^to /)) {
    return 'Verb';
  } if (lemma.split(', -').length > 1) {
    return 'Adjective';
  } if (lemma.match(/(- |-$)/)) {
    return 'Prefix';
  } if (lemma.match(/^-/)) {
    return 'Particle';
  }
  return '';
};

// Send words out into their appropriate parts of speech
module.exports = (lemma, definition) => {
  // First, send the words that wouldn't otherwise get correctly classified
  if (uniqueWords[lemma]) { return uniqueWords[lemma]; }
  const byLemma = classifyByLemma(lemma, definition);
  if (byLemma) { return byLemma; }
  return classifyByDefinition(definition);
};
