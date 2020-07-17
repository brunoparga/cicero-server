const setAdjectiveProperties = () => ({});

const setDeclension = (lemma, number) => {
  const singular = [/ae$/, /ī$/, /is$/, /ūs$/, /ēī$/];
  const plural = [/ārum$/, /ōrum$/, /um$/, /uum$/, /ērum$/];
  const correctSuffixes = number === 'plural' ? plural : singular
  return correctSuffixes.reduce((declension, suffix, index) => {
    return lemma.split(', ')[1].match(suffix) ? index : declension
  }, 0)
}

const setNounProperties = (lemma) => {
  const number = lemma.includes('pl.') ? 'plural' : 'singular';
  let gender = 'neuter';
  if (lemma.includes('mf.')) {
    gender = 'masculine/feminine';
  } else if (lemma.includes('f.')) {
    gender = 'f.';
  } else if (lemma.includes('m.')) {
    gender = 'masculine';
  }
  const declension = setDeclension(lemma, number)
  const singular = ['-ae', '-ī', '-is', '-ūs', '-ēī'];
  const plural = ['-ārum', '-ōrum', '-(i)um', '-uum', '-ērum'];
  const correctGenitive = (number === 'plural' ? plural : singular)[declension]
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
