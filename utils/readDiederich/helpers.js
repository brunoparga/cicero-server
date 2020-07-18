const treat = require('./treatDefinition');
const classify = require('./classify');
const setProperties = require('./setProperties')

// Sort by ascending alphabetical order of definition
exports.compare = ([, definition1], [, definition2]) => {
  const def1 = treat(definition1);
  const def2 = treat(definition2);
  if (def1 < def2) { return -1; }
  if (def1 > def2) { return 1; }
  return 0;
};

exports.deduplicate = ([lemma], index, array) => (index === array.length - 1
  ? true
  : lemma !== array[index + 1][0]);

exports.buildWord = ([lemma, definition]) => {
  const partOfSpeech = classify(lemma, definition)
  return {
    partOfSpeech,
    lemma: lemma.split(',')[0],
    english: definition,
    learned: false,
    properties: setProperties(partOfSpeech, lemma)
  }
};
