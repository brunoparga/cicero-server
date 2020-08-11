// Include words that the general rules wouldn't send to the right part of speech
const uniqueWords = require('./manualList');
const { treatDefinition } = require('./helpers');

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
  if (/(m|f|n)\./.test(lemma)) {
    return 'Noun';
  } if (lemma.split(',').length === 4 || /^(it|to) /.test(treatDefinition(definition))) {
    return 'Verb';
  } if (lemma.split(', -').length > 1) {
    return 'Adjective';
  } if (/[^-]-[\]]?$/.test(lemma)) {
    return 'Prefix';
  } if (/^-/.test(lemma)) {
    return 'Particle';
  }
  return '';
};

// Send words out into their appropriate parts of speech
module.exports = (lemma, definition) => (
  uniqueWords[lemma] || classifyByLemma(lemma, definition) || classifyByDefinition(definition)
);
