// Ignore explanations and parts of speech in parentheses before the actual definition
const treatDefinition = (string) => string
  .replace(/^(?:\(.*?\)[^\w(]*)+/, '')
  // I capriciously decide that the word 'egō' (I) must be the first one; for that, I need to
  // send the only one that's before it, 'tellus' (Earth) somewhere else.
  .replace(/^E/, 'e');

// Sort by ascending alphabetical order of definition
const compare = ([, definition1], [, definition2]) => {
  const def1 = treatDefinition(definition1);
  const def2 = treatDefinition(definition2);
  if (def1 < def2) { return -1; }
  if (def1 > def2) { return 1; }
  return 0;
};

// Remove duplicates from the list
const deduplicate = ([lemma], index, array) => (!index || lemma !== array[index - 1][0]);

// Given a string haystack and an array of string needles, returns true if any of the needles is a
// substring of the haystack.
const multiIncludes = (haystack, ...needles) => needles.some((needle) => haystack.includes(needle));

module.exports = {
  treatDefinition, compare, deduplicate, multiIncludes,
};
