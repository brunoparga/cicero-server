const setConjugation = (infinitive, deponent) => {
  if (deponent) {
    const suffixes = [/ārī$/, /ērī$/, /([^((ā|ē|ī)r)]|mor)ī$/, /īrī$/];
    return suffixes.findIndex((suffix) => suffix.test(infinitive));
  }
  // Take care of (circum)dō, coepī, meminī, edō, and fiō
  if (infinitive.slice(-3) === 'are') { return 0; }
  if (infinitive.slice(-4) === 'isse' || infinitive.includes(')')) { return 2; }
  // TODO: what is left are sum, ferō, volō (weird irregular ones)
  // also aio (3), inquam (irr)
  return ['āre', 'ēre', 'ere', 'īre'].indexOf(infinitive.slice(-3));
};

const setCorrectInfinitive = (lemma, conjugation, deponent) => {
  // TODO: Verbs like ferō are not even getting here. I might have to actually tell the program
  // how a regular infinitive is formed, just so it can check these. What does get here are short
  // verbs whose infinitive is spelled out rather than use a hyphen.
  // TODO: coepisse is listed but shouldn't, circumdare isn't but should
  if (!lemma.split(', ')[1].includes('-')) {
    return lemma.split(', ')[1];
  }
  return undefined;
};

module.exports = (lemma) => {
  if (!lemma.includes(',')) { return undefined; }

  const infinitive = lemma.split(', ')[1];
  const deponent = /ī$/.test(infinitive);
  const conjugation = setConjugation(infinitive, deponent);
  // take care of āiō, inquam and other beasts
  // TODO: but not quite. Maybe I need to split the infinitive and deal with that?
  if (![0, 1, 2, 3].includes(conjugation)) {
    return undefined;
  }
  return {
    conjugation,
    correctInfinitive: setCorrectInfinitive(lemma, conjugation, deponent),
    perfect: lemma.split(', ')[2],
    supine: deponent ? undefined : lemma.split(', ')[3],
    deponent,
  };
};
