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
  // TODO: what is left are the irregular verbs inquam, sum, ferō, volō
  const result = ['āre', 'ēre', 'ere', 'īre'].indexOf(infinitive.slice(-3));
  return result === -1 ? 'Irregular' : result;
};

const setCorrectInfinitive = (lemma, conjugation, deponent) => {
  // TODO: Verbs like ferō are not even getting here. I might have to actually tell the program
  // how a regular infinitive is formed, just so it can check these. What does get here are short
  // verbs whose infinitive is spelled out rather than use a hyphen.
  // TODO: coepisse is listed but shouldn't, circumdare isn't but should, aio is wrong
  if (!lemma.split(', ')[1].includes('-')) {
    return lemma.split(', ')[1];
  }
  return undefined;
};

module.exports = (lemma) => {
  const [, infinitive] = lemma.split(', ');
  const deponent = /ī$/.test(infinitive);
  const conjugation = setConjugation(infinitive, deponent);
  const result = { conjugation, deponent };

  // take care of verbs that don't fit conjugation paradigms: ferō, inquam, sum, volō
  if (![0, 1, 2, 3].includes(result.conjugation)) {
    console.log(lemma);
    return result;
  }
  return {
    conjugation,
    correctInfinitive: setCorrectInfinitive(lemma, conjugation, deponent),
    perfect: lemma.split(', ')[2],
    // TODO: supine won't work with aio, inquam, verbs without the stem, or those with only -urus.
    supine: deponent ? undefined : lemma.split(', ')[3],
    deponent,
  };
};
