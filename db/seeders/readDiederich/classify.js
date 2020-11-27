"use strict";

// Include words that the general rules wouldn't send to the right
// part of speech
const uniqueWords = require("./manualList");
const { treatDefinition } = require("./helpers");

// Verbs pass one of these criteria
function testVerb(lemma, definition) {
  const wordsInVerbLemma = 4;

  // Their lemma includes four or more words, because of different stems
  const fourWords = lemma.split(",").length >= wordsInVerbLemma;

  // The words are not contained in a <note>
  const notDueToNote = !lemma.includes("<");

  // Or the definition begins with "it [does something]" or, more commonly, "to"
  const definitionStart = /^(?:it|to) /u.test(treatDefinition(definition));

  return (fourWords && notDueToNote) || definitionStart;
}

// Some words can be classified by their lemma.
function byLemma(lemma, definition) {
  // Nouns have their gender specified
  if (/(?:m|[^r]f|[^e]n)\./u.test(lemma)) {
    return "Noun";
  }

  // Verbs get their own test
  if (testVerb(lemma, definition)) {
    return "Verb";
  }

  // Adjectives have suffixes indicated with a dash
  if (lemma.split(", -").length > 1) {
    return "Adjective";
  }

  // Prefixes end with a single dash
  if (/[^-]->?$/u.test(lemma)) {
    return "Prefix";
  }

  // A few words are enclitic, attaching to the end of other words
  if (lemma.startsWith("-")) {
    return "Particle";
  }
}

// Other words can be classified by what's in their definition
function byDefinition(definition) {
  // If the definition contains any of these keys as a substring...
  const definitionStrings = {
    "pron.": "Pronoun",
    "conj.": "Conjunction",
    "prep.": "Preposition",
    "num.": "Numeral",
    "!": "Interjection",
    "adv. and prep.": "Adverb, Preposition",
  };

  // ... the word gets classified as the key's value...
  return Object.keys(definitionStrings).reduce((partOfSpeech, substring) => {
    if (definition.toLowerCase().includes(substring)) {
      return definitionStrings[substring];
    }

    return partOfSpeech;

    // Otherwise, it is an adverb.
  }, "Adverb");
}

// Send words out into their appropriate parts of speech
module.exports = (lemma, definition) =>
  uniqueWords[lemma] || byLemma(lemma, definition) || byDefinition(definition);
