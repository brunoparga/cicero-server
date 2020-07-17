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

// Sort words out into their appropriate parts of speech
const classify = (lemma, english) => {
  if (uniqueWords[lemma]) {
    return uniqueWords[lemma];
  } if (lemma.match(/(m|f|n)\./)) {
    return 'Noun';
  } if (lemma.split(',').length === 4 || treat(english).match(/^to /)) {
    return 'Verb';
  } if (lemma.split(', -').length > 1) {
    return 'Adjective';
  } if (lemma.match(/(- |-$)/)) {
    return 'Prefix';
  } if (lemma.match(/^-/)) {
    return 'Particle';
  } if (english.includes('adv. and prep.')) {
    return 'Adverb, Preposition';
  } if (english.includes('pron.')) {
    return 'Pronoun';
  } if (english.includes('conj.')) {
    return 'Conjunction';
  } if (english.toLowerCase().includes('prep.')) {
    return 'Preposition';
  } if (english.includes('num.')) {
    return 'Numeral';
  } if (english.includes('!')) {
    return 'Interjection';
  }
  return 'Adverb';
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
  .map(([lemma, english]) => ({
    partOfSpeech: classify(lemma, english),
    lemma,
    english,
    learned: false,
  }));

fs.writeFileSync('./db.json', JSON.stringify(words, null, 2));
