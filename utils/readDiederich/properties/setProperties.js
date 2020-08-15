/* eslint-disable prefer-destructuring */
const setAdjectiveProperties = require('./setAdjProps');
const setNounProperties = require('./setNounProps');
const setNumeralPronounProperties = require('./setNumPronProps');
const setVerbProperties = require('./setVerbProps');

const wordProps = (partOfSpeech, lemma) => {
  if (partOfSpeech === 'Adjective') {
    return setAdjectiveProperties(lemma);
  } if (partOfSpeech === 'Noun') {
    return setNounProperties(lemma);
  } if (['Numeral', 'Pronoun'].includes(partOfSpeech) && lemma.includes(',')) {
    return setNumeralPronounProperties(lemma);
  } if (partOfSpeech === 'Verb') {
    return setVerbProperties(lemma);
  }
  return undefined;
};

// eslint-disable-next-line no-restricted-syntax, guard-for-in
const isEmpty = (object) => { for (const i in object) { return false; } return true; };

// Add notes in the form of spelling variants, indeclinable words, comments etc.
const wordNotes = (lemma) => {
  const result = {};
  // Add a note for words that should decline but do not
  if (lemma.includes('(indecl.')) {
    result.indeclinable = true;
  }
  // Add a note for alternate forms, different spellings
  const alternate = lemma.match(/\[(.*)\]/);
  if (alternate) {
    result.alternateForm = alternate[1];
  }
  // Add four other types of notes where appropriate
  const note = lemma.match(/<(((D|V|M)N|QUOD): )(.*)>/);
  const noteTypes = {
    DN: 'declensionNote',
    VN: 'verbNote',
    MN: 'miscellaneousNote',
    QUOD: 'quodNote',
  };
  if (note) {
    result[noteTypes[note[2]]] = note[4];
  }
  return isEmpty(result) ? undefined : result;
};

// Set the 'properties' attribute, which varies by part of speech and might contain grammar or
// usage notes
module.exports = (partOfSpeech, lemma) => {
  const result = {
    ...wordProps(partOfSpeech, lemma),
    ...wordNotes(lemma),
  };
  return isEmpty(result) ? undefined : result;
};
