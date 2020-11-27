"use strict";

const suffixes = "1st/2nd (-us)";

// Some adjectives are always plural. In the current list, they always belong
// to type I.
function typeOnePlural(masculine) {
  return {
    suffixes,
    masculineGenitive: String(masculine.replace(/ī$/u, "ōrum")),
    feminine: `${masculine.replace(/ī$/u, "ae")}, -ārum`,
    neuter: `${masculine.replace(/ī$/u, "a")}, -ōrum`,
  };
}

// These are the commonest adjectives of all.
function typeOneCommon(masculine) {
  return {
    suffixes,
    masculineGenitive: "-ī",
    feminine: `${masculine.replace(/us$/u, "")}a, -ae`,
    neuter: `${masculine.replace(/us$/u, "")}um, -ī`,
  };
}

// Some adjectives drop the letter E, so e.g. 'integer' gives 'integral'.
function typeOneShortened(masculine) {
  return {
    suffixes: "1st/2nd (-er)",

    // Regex is safe because doesn't apply to user input
    masculineGenitive: String(
      // eslint-disable-next-line security/detect-unsafe-regex
      masculine.replace(/.+?(?<consonant>ch|b|c|g|t)er$/u, "-$<consonant>rī")
    ),

    feminine: `${masculine.replace(/er$/u, "ra")}, -ae`,
    neuter: `${masculine.replace(/er$/u, "rum")}, -ī`,
  };
}

// Alius is a "pronominal adjective", so it is odd
const aliusProperties = {
  suffixes,
  masculineGenitive: "alterīus",
  feminine: "alia",
  neuter: "aliud",
};

// Type I includes three-form adjectives that decline following the first and
// second declensions.
function typeOne(lemma) {
  if (lemma.includes("alius")) {
    return aliusProperties;
  }

  const [masculine, feminine] = lemma.split(", ");

  if (feminine === "-ae") {
    return typeOnePlural(masculine);
  }

  if (["-a", "-era"].includes(feminine)) {
    return typeOneCommon(masculine);
  }

  return typeOneShortened(masculine);
}

// Type II includes adjectives that follow the third declension. They can have
// two or three gender forms (covered by this function) or just one (covered by
// the exported function).
function typeTwo(lemma) {
  const twoWords = 2;

  if (lemma.split(",").length === twoWords) {
    return { suffixes: "3rd (-is/-e)", neuter: "-e" };
  }

  // STRETCH: full forms for 3rd decl adjectives
  return { suffixes: "3rd (-er/-ris/-re)", feminine: "-ris", neuter: "-e" };
}

// Adjective properties must list the suffixes the adjective uses, and also
// information to inflect them by gender and case (except that some adjectives
// don't inflect).
module.exports = (lemma) => {
  if (lemma.includes("INDECL")) {
    return;
  }

  // Remove any note information, contained between <mathy brackets>
  const head = lemma.replace(/ <.*>/u, "");

  if (head.endsWith("is")) {
    return {
      genitive: head.slice(head.indexOf(" ") + 1),
      suffixes: "3rd (all equal)",
    };
  }

  if (/(?:e|us)$/u.test(head)) {
    return { genitive: "-is", ...typeTwo(head) };
  }

  return typeOne(head);
};
