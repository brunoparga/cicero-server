const setConjugation = (lemma, deponent) => {
  if (!lemma.includes(',')) {
    return undefined;
  } if (!deponent) {
    return ['āre', 'ēre', 'ere', 'īre'].indexOf(lemma.split(',')[1].slice(-3));
  }
  const suffixes = [/ārī$/, /ērī$/, /([^((ā|ē|ī)r)]|mor)ī$/, /īrī$/];
  return suffixes.findIndex((suffix) => suffix.test(lemma.split(',')[1]));
};

const setCorrectInfinitive = (lemma, conjugation, deponent) => {
  // TODO: Verbs like ferō are not even getting here. I might have to actually tell the program
  // how a regular infinitive is formed, just so it can check these. What does get here are short
  // verbs whose infinitive is spelled out rather than use a hyphen.
  if (!lemma.split(', ')[1].includes('-')) {
    return lemma.split(', ')[1]
  }
  return undefined
};

module.exports = (lemma) => {
  const deponent = /or$/.test(lemma.split(',')[0]);
  const conjugation = setConjugation(lemma, deponent);
  // take care of āiō, inquam, ūsus est and other beasts
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
