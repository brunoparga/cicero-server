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
  const result = ['āre', 'ēre', 'ere', 'īre'].indexOf(infinitive.slice(-3));
  return result === -1 ? 'Irregular' : result;
};

const setCorrectInfinitive = (lemma, conjugation) => {
  if (lemma.includes('inquis')) { return 'No infinitive'; }

  const [, infinitive] = lemma.split(', ');
  if (infinitive === 'ais') { return 'aiere'; }
  if ((conjugation === 'Irregular' && !infinitive.includes('-'))
      || ['(', 'dare'].some((chars) => infinitive.includes(chars))) {
    return infinitive;
  }
  return undefined;
};

const setSupine = (deponent, fourthForm) => {
  if (deponent || fourthForm === '--' || /nt$/.test(fourthForm)) { return undefined }
  if (/s$/.test(fourthForm)) { return `${fourthForm} (part.)` }
  return fourthForm
}

module.exports = (lemma) => {
  const [, infinitive, perfect, supine] = lemma.split(', ');
  const deponent = /ī$/.test(infinitive);
  const conjugation = setConjugation(infinitive, deponent);

  return {
    conjugation,
    correctInfinitive: setCorrectInfinitive(lemma, conjugation),
    perfect: perfect !== '--' ? perfect : undefined,
    // TODO: supine won't work with aio, inquam
    supine: setSupine(deponent, supine),
    deponent,
  };
};
