const setAdjectiveProperties = () => ({});

const setDeclension = (lemma, number) => {
  const singular = [/ae$/, /ī$/, /is$/, /ūs$/, /(e|ē)ī$/];
  const plural = [/ārum$/, /ōrum$/, /[^(ā|ē|ō)r]um$/, /uum$/, /ērum$/];
  const correctSuffixes = number === 'singular' ? singular : plural
  return correctSuffixes.reduce((declension, suffix, index) => {
    return lemma.split(', ')[1].match(suffix) ? index : declension
  }, 0)
}

const setCorrectGenitive = (lemma, number, declension) => {
  const singular = ['-ae', '-ī', '-is', '-ūs', '-ēī'];
  const plural = ['-ārum', '-ōrum', '-(i)um', '-uum', '-ērum'];
  const regularGenitive = (number === 'singular' ? singular : plural)[declension]
  if (lemma.split(', ')[1] !== regularGenitive) {
    return lemma.split(', ')[1];
  }
  return undefined;
}

const setNounProperties = (lemma) => {
  const number = lemma.includes('pl.') ? 'plural' : 'singular';
  let gender = 'neuter';
  if (lemma.includes('mf.')) {
    gender = 'masculine/feminine';
  } else if (lemma.includes('f.')) {
    gender = 'feminine';
  } else if (lemma.includes('m.')) {
    gender = 'masculine';
  }
  const declension = setDeclension(lemma, number)
  const correctGenitive = setCorrectGenitive(lemma, number, declension)
  return {
    number,
    declension,
    gender,
    correctGenitive,
  };
};

const setVerbProperties = () => ({});

module.exports = (partOfSpeech, lemma) => {
  if (partOfSpeech === 'Adjective') {
    // return setAdjectiveProperties(lemma);
  } if (partOfSpeech === 'Noun') {
    return setNounProperties(lemma);
  } if (partOfSpeech === 'Verb') {
    // return setVerbProperties(lemma);
  }
  // return {};
};
