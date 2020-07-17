const fs = require('fs');

// Include words that the general rules wouldn't send to the right part of speech
const uniqueWords = require('./manualList');

// Ignore explanations and parts of speech in parentheses before the actual definition
const treat = (string) => string
  .replace(/^(?:\(.*?\)[^\w(]*)+/, '')
  // I capriciously decide that the word 'egō' (I) must be the first one; for that, I need to
  // send the only one that's before it, 'tellus' (Earth) somewhere else.
  .replace(/^E/, 'e');

// Sort by ascending alphabetical order of definition
const compare = ([, definition1], [, definition2]) => {
  const def1 = treat(definition1);
  const def2 = treat(definition2);
  if (def1 < def2) { return -1; }
  if (def1 > def2) { return 1; }
  return 0;
};

const classifyByDefinition = (definition) => {
  const definitionStrings = {
    'pron.': 'Pronoun',
    'conj.': 'Conjunction',
    'prep.': 'Preposition',
    'num.': 'Numeral',
    '!': 'Interjection',
    'adv. and prep.': 'Adverb, Preposition'
  }
  
  return Object
    .keys(definitionStrings)
    .reduce((partOfSpeech, substring) => {
      if (definition.toLowerCase().includes(substring)) {
        return definitionStrings[substring]
      }
      return partOfSpeech
    }, 'Adverb')
}

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
  return ''
}

// Send words out into their appropriate parts of speech
const classify = (lemma, definition) => {
  // First, send the words that wouldn't otherwise get correctly classified
  if (uniqueWords[lemma]) { return uniqueWords[lemma]; }
  const byLemma = classifyByLemma(lemma, definition)
  if (byLemma) { return byLemma; }
  return classifyByDefinition(definition);
};

const words = fs
  // Read the file, break it into lines, throw the header line away
  .readFileSync('./diederich.txt', 'utf8')
  .split('\r\n')
  .slice(1)
  // Break each row into columns, discard all except lemma and definition
  .map((ary) => ary.split('\t').slice(4))
  // Alphabetize by cleaned-up definition
  .sort(compare)
  // Remove duplicates
  .filter(
    ([lemma], index, array) => (index === array.length - 1 ? true : lemma !== array[index + 1][0]),
  )
  // Turn into an object for JSONification
  .map(([lemma, definition]) => ({
    partOfSpeech: classify(lemma, definition),
    lemma,
    english: definition,
    learned: false,
  }));

fs.writeFileSync('./db.json', JSON.stringify(words, null, 2));
