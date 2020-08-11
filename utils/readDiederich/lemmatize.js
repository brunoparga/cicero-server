const { multiIncludes } = require('./helpers');

// Special cases
// Nouns whose nominative singular is not actually used
const defectiveNouns = ['sponte', 'vicis', 'vīrēs'];
// Words whose lemma must be split by the first comma
const specialSplit = ['rēs pūblica', 'ūsus est'];
// Words which must be listed by their full lemma
const fullLemma = [
  'āiō, ais, ait, aiunt',
  'inquam, inquis, inquit, inquiunt',
  'salvē (sg.), salvēte (pl.)',
];

// Set the appropriate lemma, which must be done in a special way for certain words.
module.exports = (lemma) => {
  // 'mīlle' is just weird
  if (lemma.includes('mīlle')) {
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
