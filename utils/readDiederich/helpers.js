const treat = require('./treatDefinition');
const classify = require('./classify');
const setProperties = require('./setProperties');

// Sort by ascending alphabetical order of definition
exports.compare = ([, definition1], [, definition2]) => {
  const def1 = treat(definition1);
  const def2 = treat(definition2);
  if (def1 < def2) { return -1; }
  if (def1 > def2) { return 1; }
  return 0;
};

exports.deduplicate = ([lemma], index, array) => (!index || lemma !== array[index - 1][0]);

// Given a string haystack and an array of string needles, returns true if any of the needles is a
// substring of the haystack.
const multiIncludes = (haystack, ...needles) => needles.some((needle) => haystack.includes(needle));

// Set the appropriate lemma, which must be done in a special way for certain words.
const lemmatize = (lemma) => {
  // Nouns whose nominative singular is not actually used
  const defectiveNouns = ['sponte', 'vicis', 'vīrēs'];
  // Words whose lemma must be split by the first comma
  const specialSplit = [
    'c(h)arta',
    'ex(s)tinguō',
    'hiem(p)s',
    'prosper(us)',
    'quotiē(n)s',
    'rēs pūblica',
    'ūsus est',
  ];
  // Words which must be listed by their full lemma
  const fullLemma = [
    'āiō, ais, ait, aiunt',
    'inquam, inquis, inquit, inquiunt',
    'salvē (sg.), salvēte (pl.)',
  ];
  if (lemma.includes('mīlle')) {
    // mīlle is just weird
    return 'mīlle (sg.), mīlia (pl.)';
  } if (multiIncludes(lemma, ...defectiveNouns)) {
    return lemma.slice(0, -4);
  } if (multiIncludes(lemma, ...specialSplit)) {
    return lemma.split(',')[0];
  } if (multiIncludes(lemma, '...', ...fullLemma)) {
    // The ellipsis string includes words like 'neither ... nor'
    return lemma;
  }
  // In general, words should break whenever their letters end (with a dash for prefixes)
  return lemma.split(/[^A-Za-zāēīōū-]/)[0];
};

exports.buildWord = ([lemma, definition]) => {
  const partOfSpeech = classify(lemma, definition);
  return {
    partOfSpeech,
    lemma: lemmatize(lemma),
    english: definition,
    learned: false,
    properties: setProperties(partOfSpeech, lemma),
  };
};
