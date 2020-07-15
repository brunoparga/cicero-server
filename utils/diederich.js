const fs = require('fs');

// Include some words that the general rules wouldn't send to the right part of speech
const {
  adjectives,
  advPreps,
  conjunctions,
  pronouns
} = require('./manualList')

// Ignore explanations and parts of speech in parentheses before the actual definition
const treat = (string) => string.
  replace(/^(?:\(.*?\)[^\w(]*)+/, '')
  // I capriciously decide that the word 'egō' (I) must be the first one; for that, I need to
  // send the only one that's before it, 'tellus' (Earth) somewhere else.
  .replace(/^E/, 'e');

// Sort by ascending alphabetical order of definition
const compare = ([_lemma1, definition1], [_lemma2, definition2]) => {
  const def1 = treat(definition1);
  const def2 = treat(definition2);
  return def1 === def2 ? 0 : def1 < def2 ? -1 : 1;
}

// Fix the special words that the general rules get wrong
const manualList = (lemma) => {
  if (lemma === 'satis') {
    return 'Adjective, Adverb';
  } else if (["nec (neque)", "ubī (ubi)"].includes(lemma)) {
    return 'Adverb, Conjunction'
  } else if (lemma === "rēs pūblica, reī pūblicae, etc.") {
    return 'Noun';
  } else if (lemma === "mīlle (sg. indecl., pl. mīlia, -ium n.)") {
    return 'Numeral';
  } else if (lemma === "quatiō, -ere, --, quassum (perf. -cussī only in composita)") {
    return 'Verb'
  } else if (adjectives.includes(lemma)) {
    return 'Adjective';
  } else if (advPreps.includes(lemma)) {
    return 'Adverb, Preposition';
  } else if (conjunctions.includes(lemma)) {
    return 'Conjunction';
  } else if (pronouns.includes(lemma)) {
    return 'Pronoun';
  }
};

// Sort words out into their appropriate parts of speech
const classify = (lemma, english) => {
  const listed = manualList(lemma)
  if (listed) {
    return listed
  } else if (lemma.match(/(m|f|n)\./)) {
    return 'Noun';
  } else if (lemma.split(',').length === 4 || treat(english).match(/^to /)) {
    return 'Verb';
  } else if (lemma.split(', -').length > 1) {
    return 'Adjective';
  } else if (lemma.match(/(- |-$)/)) {
    return 'Prefix';
  } else if (lemma.match(/^-/)) {
    return 'Particle'
  } else if (english.includes('adv. and prep.')) {
    return 'Adverb, Preposition'
  } else if (english.includes('pron.')) {
    return 'Pronoun'
  } else if (english.includes('conj.')) {
    return 'Conjunction'
  } else if (english.toLowerCase().includes('prep.')) {
    return 'Preposition'
  } else if (english.includes('num.')) {
    return 'Numeral'
  } else if (english.includes('!')) {
    return 'Interjection'
  }
  return 'Adverb'
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
  .filter(([lemma], index, array) =>
    index === array.length - 1 ? true : lemma !== array[index + 1][0])
  // Turn into an object for JSONification
  .map(([lemma, english]) => ({
    partOfSpeech: classify(lemma, english),
    lemma,
    english,
    learned: false
  }));

fs.writeFileSync('./db.json', JSON.stringify(words, null, 2))