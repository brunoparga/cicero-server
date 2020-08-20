const setConjugation = (infinitive, deponent) => {
  if (deponent) {
    const suffixes = [/ārī$/, /ērī$/, /([^((ā|ē|ī)r)]|mor)ī$/, /īrī$/];
    return suffixes.findIndex((suffix) => suffix.test(infinitive));
  }
  // Take care of aio, (circum)dō, coepī, meminī, edō, and fiō
  if (infinitive.slice(-3) === 'are') { return 0; }
  if (infinitive.slice(-4) === 'isse'
      || infinitive.includes(')')
      || infinitive === 'ais') { return 2; }
  // Conjugation is -1 for irregular verbs, 0 for first conjugation and so on
  return ['āre', 'ēre', 'ere', 'īre'].indexOf(infinitive.slice(-3));
};

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

const setSupine = (deponent, fourthForm) => {
  if (deponent || fourthForm === '--' || /nt$/.test(fourthForm)) { return undefined; }
  if (/s$/.test(fourthForm)) { return `${fourthForm} (part.)`; }
  return fourthForm;
};

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
