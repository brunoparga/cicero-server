// Set the conjugation, the pattern the verb follows as it inflects for person, number, tense,
// mood and voice
const setConjugation = (infinitive, deponent) => {
  if (deponent) {
    const suffixes = [/ārī$/, /ērī$/, /([^((ā|ē|ī)r)]|mor)ī$/, /īrī$/];
    return suffixes.findIndex((suffix) => suffix.test(infinitive));
  }
  // Take care of odd verbs aio, (circum)dō, coepī, meminī, edō, and fiō
  if (infinitive.slice(-3) === 'are') { return 0; }
  if (infinitive.slice(-4) === 'isse'
      || infinitive.includes(')')
      || infinitive === 'ais') { return 2; }
  // Conjugation is -1 for irregular verbs (not part of a conjugation), 0 for first conjugation
  // and so on
  return ['āre', 'ēre', 'ere', 'īre'].indexOf(infinitive.slice(-3));
};

// Set the correct infinitive for the verb, if it is irregular
const setCorrectInfinitive = (lemma, infinitive, conjugation) => {
  // Weird verbs
  if (lemma.includes('inquis')) { return 'No infinitive'; }
  if (infinitive === 'ais') { return 'aiere'; }

  // 'dare' is strange because its vowel is short
  // a parenthesis means there is an alternative infinitive form
  // '-isse' is the perfect infinitive suffix
  // Conjugation -1 means irregular verb (sum, ferō)
  const strangeInfinitives = ['(', 'dare', 'isse'].some((chars) => infinitive.includes(chars));
  if (strangeInfinitives || conjugation === -1) { return infinitive; }
  return undefined;
};

// The supine is used on its own and also to form participles. Some verbs don't have an independent
// supine, only the participle.
const setSupine = (deponent, fourthForm) => {
  // The regex accounts for 'aio' and 'inquam', whose fourth listed form is not the supine.
  if (deponent || fourthForm === '--' || /nt$/.test(fourthForm)) { return undefined; }
  if (/s$/.test(fourthForm)) { return `${fourthForm} (part.)`; }
  return fourthForm;
};

// Set the correct properties for the verb: which conjugation it belongs to, whether it is deponent,
// and its principal parts - infinitive, perfect and supine.
module.exports = (lemma) => {
  const [, infinitive, perfect, supine] = lemma.split(', ');
  const deponent = /ī$/.test(infinitive);
  const conjugation = setConjugation(infinitive, deponent);

  return {
    conjugation,
    correctInfinitive: setCorrectInfinitive(lemma, infinitive, conjugation),
    perfect: perfect !== '--' ? perfect : undefined,
    supine: setSupine(deponent, supine),
    deponent,
  };
};
