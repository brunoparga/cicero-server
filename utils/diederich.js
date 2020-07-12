const fs = require('fs');

// Ignore explanations and parts of speech in parentheses before the actual definition
const treat = (string) => string.
  replace(/^(?:\(.*?\)[^\w(]*)+/, '')
  // I capriciously decide that the word 'egō' (I) must be the first one; for that, I need to
  // send the only one that's before it, 'tellus' (Earth) somewhere else.
  .replace(/^E/, 'e');

// To sort by ascending alphabetical order of definition
const compare = ([_lemma1, definition1], [_lemma2, definition2]) => {
  const def1 = treat(definition1);
  const def2 = treat(definition2);
  return def1 === def2 ? 0 : def1 < def2 ? -1 : 1;
}

const classify = (lemma) => {
  if (lemma.match(/(m|f|n)\.$/)) {
    return 'Noun';
  } else if (lemma.split('-').length === 4) {
    return 'Verb';
  } else if (lemma.split(', -').length > 1) {
    return 'Adjective';
  }
  return 'Etcetera';
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
  // Turn into an object for JSONification
  .map(([lemma, english]) => ({ partOfSpeech: classify(lemma), lemma, english, learned: false }));

// console.log(words2.map(({ lemma }) => lemma).sort((w1, w2) => w1 === w2 ? -1 : 1))
fs.writeFileSync('./array.txt', JSON.stringify(words, null, 2))