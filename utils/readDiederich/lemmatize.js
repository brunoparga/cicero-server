const { multiIncludes } = require('./helpers');

// Special cases
const specialSplit = ['rēs pūblica', 'ūsus est'];
const fullLemma = [
  'āiō, ais, ait, aiunt',
  'inquam, inquis, inquit, inquiunt',
  'salvē (sg.), salvēte (pl.)',
  'sīve ... sīve',
  'vel ... vel',
];

// Set the appropriate lemma in the DB, which must be done in a special way for certain words.
module.exports = (lemmaFromList) => {
  // 'mīlle' is just weird
  if (lemmaFromList.includes('mīlle')) { return 'mīlle (sg.), mīlia (pl.)'; }
  // This lemma has both an ellipsis in it and an alternate form, so it wouldn't fit in fullLemma
  if (lemmaFromList.includes('nēve ... nēve')) { return 'nēve ... nēve'; }
  // Words whose lemma must be split at the first comma
  if (multiIncludes(lemmaFromList, specialSplit)) { return lemmaFromList.split(',')[0]; }
  // Words which must be listed by their full lemma
  if (multiIncludes(lemmaFromList, fullLemma)) { return lemmaFromList; }
  // In general, the lemma is the input up to the first word break (with a dash for prefixes)
  return lemmaFromList.split(/[^A-Za-zāēīōū-]/)[0];
};
