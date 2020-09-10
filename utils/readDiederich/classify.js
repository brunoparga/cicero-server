// Include words that the general rules wouldn't send to the right part of speech
const uniqueWords = require('./manualList');
const { treatDefinition } = require('./helpers');

// Verbs pass one of these criteria
const testVerb = (lemma, definition) => {
  // Their lemma includes four or more words, because of different stems
  const fourWords = lemma.split(',').length >= 4;
  // The words are not contained in a <note>
  const notDueToNote = !lemma.includes('<');
  // Or the definition begins with "it [does something]" or, more commonly, "to"
  const definitionStart = /^(it|to) /.test(treatDefinition(definition));
  return (fourWords && notDueToNote) || definitionStart;
};

// Some words can be classified by their lemma.
const byLemma = (lemma, definition) => {
  // Nouns have their gender specified
  if (/(m|[^r]f|[^e]n)\./.test(lemma)) {
    return 'Noun';
  } if (testVerb(lemma, definition)) {
    return 'Verb';
  // Adjectives have suffixes indicated with a dash
  } if (lemma.split(', -').length > 1) {
    return 'Adjective';
  // Prefixes end with a single dash
  } if (/[^-]->?$/.test(lemma)) {
    return 'Prefix';
  // A few words are enclitic, attaching to the end of other words
  } if (/^-/.test(lemma)) {
    return 'Particle';
  }
  // Not all words get classified this way, though.
  return '';
};

// Other words can be classified by what's in their definition
const byDefinition = (definition) => {
  // If the definition contains any of these keys as a substring...
  const definitionStrings = {
    'pron.': 'Pronoun',
    'conj.': 'Conjunction',
    'prep.': 'Preposition',
    'num.': 'Numeral',
    '!': 'Interjection',
    'adv. and prep.': 'Adverb, Preposition',
  };

  // ... the word gets classified as the key's value...
  return Object.keys(definitionStrings)
    .reduce((partOfSpeech, substring) => {
      if (definition.toLowerCase().includes(substring)) {
        return definitionStrings[substring];
      }
      return partOfSpeech;
    // Otherwise, it is an adverb.
    }, 'Adverb');
};

// Send words out into their appropriate parts of speech
module.exports = (lemma, definition) => (
  uniqueWords[lemma] || byLemma(lemma, definition) || byDefinition(definition)
);
