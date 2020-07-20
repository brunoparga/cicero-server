const setDeclension = (lemma, number) => {
  const singular = [/ae$/, /ī$/, /is$/, /ūs$/, /(e|ē)ī$/];
  // Leaving the fourth and fifth declension endings here even though there are no plural
  // words in those declensions in the Diederich list.
  const plural = [/ārum$/, /ōrum$/, /[^(ā|ē|ō)r]um$/, /uum$/, /ērum$/];
  const correctSuffixes = number === 'singular' ? singular : plural;
  return correctSuffixes.reduce((declension, suffix, index) => (lemma.split(', ')[1].match(suffix) ? index : declension), 0);
};

// Some words, especially in the second and third declension, have slightly irregular
// TODO: deal with words like culter (but not include puer in the same basket)
const setCorrectGenitive = (lemma, number, declension) => {
  const singular = ['-ae', '-ī', '-is', '-ūs', '-ēī'];
  const plural = ['-ārum', '-ōrum', '-(i)um', '-uum', '-ērum'];
  const regularGenitive = (number === 'singular' ? singular : plural)[declension];
  if (lemma.split(', ')[1] !== regularGenitive) {
    return lemma.split(', ')[1];
  }
  return undefined;
};

module.exports = (lemma) => {
  const number = lemma.split(',')[1].match(/um$/) ? 'plural' : 'singular';

  let gender = 'neuter';
  if (lemma.includes('mf.')) {
    gender = 'masculine/feminine';
  } else if (lemma.includes('f.')) {
    gender = 'feminine';
  } else if (lemma.includes('m.')) {
    gender = 'masculine';
  }

  const declension = setDeclension(lemma, number);
  const correctGenitive = setCorrectGenitive(lemma, number, declension);

  return {
    number,
    declension,
    gender,
    correctGenitive,
  };
};
