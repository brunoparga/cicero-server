"use strict";

const { isEmpty } = require("../helpers");

// This function is here for no other reason than to obey Lintia, the Roman
// goddess of linting. The main function would otherwise contain one too many
// statements.

// Apparently I'm also great at writing comments that are 1 word longer than 80
// characters.
function isDeclinable(lemma) {
  return lemma.includes("INDECL") ? { indeclinable: true } : {};
}

// Add notes in the form of spelling variants, indeclinable words, comments etc.
module.exports = (lemma) => {
  const result = isDeclinable(lemma);

  // Add other types of notes where appropriate. Regex is okay.
  // eslint-disable-next-line security/detect-unsafe-regex
  const note = lemma.match(/<(?<noteType>[DMV]N|ALT|QUOD): (?<noteText>.*)>/u);
  const noteTypes = {
    DN: "declensionNote",
    VN: "verbNote",
    MN: "miscellaneousNote",
    ALT: "alternateForm",
    QUOD: "quodNote",
  };

  if (note) {
    result[noteTypes[note.groups.noteType]] = note.groups.noteText;
  }

  // A handful of pronouns have different substantive and adjective forms
  if (result.quodNote) {
    const form = note.groups.noteText.match(/quod\w*/u);

    result.quodNote = `Neuter form is subst.; ${form[0]} is adj.`;
  }

  return isEmpty(result) ? undefined : result;
};
