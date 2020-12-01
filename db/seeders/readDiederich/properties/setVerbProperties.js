"use strict";

// Latin has four conjugations. Some irregular verbs don't fall in any of them.
// The second and fourth don't need constants.
const irregular = -1;
const firstConjugation = 0;
const thirdConjugation = 2;
const lastThreeCharacters = -3;
const lastFourCharacters = -4;

// Set the conjugation, the pattern the verb follows as it inflects for person,
// number, tense, mood and voice
function setConjugation(infinitive, deponent) {
  if (deponent) {
    const suffixes = [/ārī$/u, /ērī$/u, /(?:[^()r|āēī]|mor)ī$/u, /īrī$/u];

    return suffixes.findIndex((suffix) => suffix.test(infinitive));
  }

  // Take care of odd verbs aio, (circum)dō, coepī, meminī, edō, and fiō
  if (infinitive.slice(lastThreeCharacters) === "are") {
    return firstConjugation;
  }

  if (
    infinitive.slice(lastFourCharacters) === "isse" ||
    infinitive.includes(")") ||
    infinitive === "ais"
  ) {
    return thirdConjugation;
  }

  // Conjugation is -1 for irregular verbs (not part of a conjugation),
  // 0 for first conjugation and so on
  return ["āre", "ēre", "ere", "īre"].indexOf(
    infinitive.slice(lastThreeCharacters)
  );
}

// Set the correct infinitive for the verb, if it is irregular
function setCorrectInfinitive(lemma, infinitive, conjugation) {
  // Weird verbs
  if (lemma.includes("inquis")) {
    return "No infinitive";
  }

  if (infinitive === "ais") {
    return "aiere";
  }

  // 'dare' is strange because its vowel is short
  // a parenthesis means there is an alternative infinitive form
  // '-isse' is the perfect infinitive suffix
  // Conjugation -1 means irregular verb (sum, ferō)
  const strangeInfinitives = ["(", "dare", "isse"].some((chars) =>
    infinitive.includes(chars)
  );

  if (strangeInfinitives || conjugation === irregular) {
    return infinitive;
  }
}

// The supine is used on its own and also to form participles. Some verbs don't
// have an independent supine, only the participle.
function setSupine(deponent, fourthForm) {
  // The last condition accounts for 'aio' and 'inquam', whose fourth listed
  // form is not the supine.
  if (deponent || fourthForm === "--" || fourthForm.endsWith("nt")) {
    return;
  }

  if (fourthForm.endsWith("s")) {
    return `${fourthForm} (part.)`;
  }

  return fourthForm;
}

// Set the correct properties for the verb: which conjugation it belongs to,
// whether it is deponent, and its principal parts - infinitive, perfect
// and supine.
module.exports = (lemma) => {
  const [, infinitive, perfect, supine] = lemma.split(", ");
  const deponent = infinitive.endsWith("ī");
  const conjugation = setConjugation(infinitive, deponent);

  return {
    conjugation,
    correctInfinitive: setCorrectInfinitive(lemma, infinitive, conjugation),
    perfect: perfect === "--" ? undefined : perfect,
    supine: supine ? setSupine(deponent, supine) : undefined,
    deponent,
  };
};
