const { isEmpty } = require('../helpers');

// Add notes in the form of spelling variants, indeclinable words, comments etc.
module.exports = (lemma) => {
  const result = {};
  // Add a note for words that should decline but do not
  if (lemma.includes('INDECL')) {
    result.indeclinable = true;
  }
  // Add other types of notes where appropriate
  const note = lemma.match(/<(?:(?<noteType>(?:D|V|M)N|ALT|QUOD): )(?<noteText>.*)>/);
  const noteTypes = {
    DN: 'declensionNote',
    VN: 'verbNote',
    MN: 'miscellaneousNote',
    ALT: 'alternateForm',
    QUOD: 'quodNote',
  };
  if (note) {
    result[noteTypes[note.groups.noteType]] = note.groups.noteText;
  }
  if (result.quodNote) {
    const form = note.groups.noteText.match(/quod\w*/);
    result.quodNote = `Neuter form is subst.; ${form[0]} is adj.`;
  }
  return isEmpty(result) ? undefined : result;
};
