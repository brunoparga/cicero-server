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

const lemmatize = (lemma, partOfSpeech) => {
  const irregularWords = [
    'āiō, ais, ait, aiunt',
    'inquam, inquis, inquit, inquiunt',
    'vīs (sg. only acc. vim, abl. vī; pl. vīrēs, -ium), f.',
    'vicis (gen. sg.), vicem (acc. sg.), vice (abl. sg.)'
  ]
  if (lemma.includes('sponte')) {
    return 'sponte (abl., gen. spontis very rare)';
  } if (['Numeral', 'Pronoun'].includes(partOfSpeech) || irregularWords.includes(lemma)) {
    return lemma
  }
  return lemma.split(',')[0]
}

exports.buildWord = ([lemma, definition]) => {
  const partOfSpeech = classify(lemma, definition)
  return {
    partOfSpeech,
    lemma: lemmatize(lemma, partOfSpeech),
    english: definition,
    learned: false,
    properties: setProperties(partOfSpeech, lemma)
  }
};
