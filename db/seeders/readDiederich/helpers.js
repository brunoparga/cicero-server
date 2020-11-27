"use strict";

// Ignore explanations and parts of speech in parentheses before
// the actual definition
function treatDefinition(string) {
  return (
    string

      // this regex is never applied to user input. It runs on a closed set
      // of ~1500 strings from a file, only a minority of which even match.
      // eslint-disable-next-line security/detect-unsafe-regex, unicorn/no-unsafe-regex
      .replace(/^(?:\(.*?\)[^\w(]*)+/u, "")

      // I capriciously decide that the word 'egō' (I) must be the first one;
      // for that, I need to send the only one that's before it, 'tellus'
      // (Earth) somewhere else.
      .replace(/^E/u, "e")
  );
}

// Sort by ascending alphabetical order of definition
function compare([, definition1], [, definition2]) {
  const def1 = treatDefinition(definition1);
  const def2 = treatDefinition(definition2);
  const alreadyInOrder = -1;

  if (def1 < def2) {
    return alreadyInOrder;
  }

  if (def1 > def2) {
    return 1;
  }

  return 0;
}

// Remove duplicates from the list
function deduplicate([lemma], index, array) {
  return !index || lemma !== array[index - 1][0];
}

// Test if the argument object is empty.
function isEmpty(object) {
  return Object.keys(object).length === 0;
}

// Given a string haystack and an array of string needles, returns true
// if any of the needles is a substring of the haystack.
function multiIncludes(haystack, needles) {
  return needles.some((needle) => haystack.includes(needle));
}

module.exports = {
  compare,
  deduplicate,
  isEmpty,
  multiIncludes,
  treatDefinition,
};
