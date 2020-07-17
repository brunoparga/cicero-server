// Ignore explanations and parts of speech in parentheses before the actual definition
module.exports = (string) => string
  .replace(/^(?:\(.*?\)[^\w(]*)+/, '')
  // I capriciously decide that the word 'egō' (I) must be the first one; for that, I need to
  // send the only one that's before it, 'tellus' (Earth) somewhere else.
  .replace(/^E/, 'e');
