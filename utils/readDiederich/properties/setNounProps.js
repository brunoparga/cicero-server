// The word 'mīlle', "1000", behaves weirdly enough that its props object be explicitly defined
const milleProps = {
  number: 'plural',
  declension: 2,
  gender: 'neuter',
  miscellaneousNote: 'sg. is an indecl. adj.',
};

// Set which of the five declensions the noun belongs to, based on its genitive suffixes
const setDeclension = (lemma, number) => {
  if (lemma.includes('INDECL')) { return undefined; }

  const singular = [/ae$/, /ī$/, /is$/, /ūs$/, /(e|ē)ī$/];
  // Leaving the fourth and fifth declension endings here even though there are no plural
  // words in those declensions in the Diederich list.
  const plural = [/ārum$/, /ōrum$/, /[^(ā|ē|ō)r]um$/, /uum$/, /ērum$/];
  const correctSuffixes = number === 'singular' ? singular : plural;
  return correctSuffixes.reduce(
    (declension, suffix, index) => (suffix.test(lemma.split(', ')[1]) ? index : declension), 0,
  );
};

// Set the noun's grammatical gender
const setGender = (lemma) => {
  if (lemma.includes('mf.')) { return 'masculine/feminine'; }
  if (lemma.includes('f.')) { return 'feminine'; }
  if (lemma.includes('m.')) { return 'masculine'; }
  return 'neuter';
};

const specialCases = (lemma) => {
  if (lemma.includes('laurus')) { return '-ī'; }
  if (lemma.includes('vicis')) { return '(word is already a genitive)'; }
  if (lemma.includes('vīrēs')) { return '--'; }
  if (lemma.includes('sponte')) { return 'spontis'; }
  return undefined;
};

// Some words, especially in the second and third declension, have slightly irregular genitives
const setCorrectGenitive = (lemma, number, declension) => {
  if (lemma.includes('INDECL')) { return undefined; }

  const special = specialCases(lemma);
  if (special) { return special; }

  const singular = ['-ae', '-ī', '-is', '-ūs', '-ēī'];
  const plural = ['-ārum', '-ōrum', '-(i)um', '-uum', '-ērum'];
  const regularGenitive = (number === 'singular' ? singular : plural)[declension];
  if (lemma.split(', ')[1] !== regularGenitive) {
    return lemma.split(', ')[1];
  }
  return undefined;
};

// A noun properties are its gender, number, declension and optionally its correct genitive
// TODO: check the front-end for optionality of correctGenitive
module.exports = (lemma) => {
  if (lemma.includes('mīlle')) { return milleProps; }

  const number = /um$/.test(lemma.split(',')[1]) ? 'plural' : 'singular';
  const declension = setDeclension(lemma, number);
  const correctGenitive = setCorrectGenitive(lemma, number, declension);

  return {
    number,
    declension,
    gender: setGender(lemma),
    correctGenitive,
  };
};
