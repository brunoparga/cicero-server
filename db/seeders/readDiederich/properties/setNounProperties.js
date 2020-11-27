"use strict";

// 'Mīlle', "1000", behaves oddly enough that its properties need to be
// explicitly defined
const milleProperties = {
  number: "plural",
  declension: 2,
  gender: "neuter",
  miscellaneousNote: "sg. is an indecl. adj.",
};

// Same for 'nēmō', "nobody"
const nemoProperties = {
  number: "singular",
  declension: 2,
  gender: "masculine/feminine",
  correctGenitive: "nūllīus",
};

// Set which of the five declensions the noun belongs to, based on its
// genitive suffixes
function setDeclension(lemma, number) {
  if (lemma.includes("INDECL")) {
    return;
  }

  const singular = [/ae$/u, /ī$/u, /is$/u, /ūs$/u, /[eē]ī$/u];

  // The fourth and fifth declension endings are left here even though there
  // are no plural words in those declensions in the Diederich list.
  const plural = [/ārum$/u, /ōrum$/u, /[^()r|āēō]um$/u, /uum$/u, /ērum$/u];
  const correctSuffixes = number === "singular" ? singular : plural;

  return correctSuffixes.reduce(
    (declension, suffix, index) =>
      suffix.test(lemma.split(", ")[1]) ? index : declension,
    0
  );
}

// Set the noun's grammatical gender
function setGender(lemma) {
  if (lemma.includes("mf.")) {
    return "masculine/feminine";
  }

  if (lemma.includes("f.")) {
    return "feminine";
  }

  if (lemma.includes("m.")) {
    return "masculine";
  }

  return "neuter";
}

// These words have a special genitive, or it cannot otherwise be
// correctly constructed
function specialCases(lemma) {
  if (lemma.includes("laurus")) {
    return "-ī";
  }

  if (lemma.includes("vicis")) {
    return "(word is already a genitive)";
  }

  if (lemma.includes("vīrēs")) {
    return "--";
  }

  if (lemma.includes("sponte")) {
    return "spontis";
  }
}

// Some words, especially in the second and third declension, have slightly
// irregular genitives
function setCorrectGenitive(lemma, number, declension) {
  if (lemma.includes("INDECL")) {
    return;
  }

  if (specialCases(lemma)) {
    return specialCases(lemma);
  }

  const [, genitive] = lemma.split(", ");
  const singular = ["-ae", "-ī", "-is", "-ūs", "-ēī"];
  const plural = ["-ārum", "-ōrum", "-(i)um", "-uum", "-ērum"];
  const regularGenitive = (number === "singular" ? singular : plural)[
    declension
  ];

  if (genitive !== regularGenitive) {
    return genitive;
  }
}

// A noun's properties are its gender, number, declension and optionally its
// irregular genitive
module.exports = (lemma) => {
  if (lemma.includes("mīlle")) {
    return milleProperties;
  }

  if (lemma.includes("nēmō")) {
    return nemoProperties;
  }

  const number = lemma.split(",")[1].endsWith("um") ? "plural" : "singular";
  const declension = setDeclension(lemma, number);
  const correctGenitive = setCorrectGenitive(lemma, number, declension);

  return {
    number,
    declension,
    gender: setGender(lemma),
    correctGenitive,
  };
};
