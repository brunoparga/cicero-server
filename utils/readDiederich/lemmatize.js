const { multiIncludes } = require('./helpers');

// Special cases
// Words whose lemma must be split by the first comma
const specialSplit = ['rēs pūblica', 'ūsus est'];
// Words which must be listed by their full lemma
const fullLemma = [
  'āiō, ais, ait, aiunt',
  'inquam, inquis, inquit, inquiunt',
  'salvē (sg.), salvēte (pl.)',
  'sīve ... sīve',
  'vel ... vel',
];

// Set the appropriate lemma, which must be done in a special way for certain words.
module.exports = (lemma) => {
  // 'mīlle' is just weird
  if (lemma.includes('mīlle')) { return 'mīlle (sg.), mīlia (pl.)'; }
  // This lemma has both an ellipsis in it and an alternate form
  if (lemma.includes('nēve ... nēve')) { return 'nēve ... nēve'; }
  if (multiIncludes(lemma, specialSplit)) { return lemma.split(',')[0]; }
  // The ellipsis string includes words like 'neither ... nor'
  if (multiIncludes(lemma, fullLemma)) { return lemma; }
  // In general, words should break whenever their letters end (with a dash for prefixes)
  return lemma.split(/[^A-Za-zāēīōū-]/)[0];
};
