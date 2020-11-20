// 'Duo', "two", behaves oddly enough that its properties need to be explicitly defined
const duoProps = {
  masculineGenitive: 'duōrum',
  feminine: 'duae',
  neuter: 'duo',
  suffixes: '1st/2nd (-us)',
};

// Set the word's correct genitive
const setGenitive = (head) => {
  // If the first word of the lemma begins with qu-, the genitive is cuius- ("internal" declension).
  // Three demonstratives have it in -īus, and the others have to be set case by case.

  // First, solve the case-by-case words, as one of them would wrongly fit on the 'cuius' type
  const caseByCase = {
    quisquis: 'cuiuscuius',
    uterque: 'utrīusque',
    is: 'eius',
    īdem: 'eiusdem',
    hic: 'huius',
    trēs: 'trium',
  };
  if (caseByCase[head]) { return caseByCase[head]; }

  // Then solve the 'cuius-' cases
  const match = head.match(/(?:qu(?:is|ī))(?<ending>.*)/);
  if (match) { return `cuius${match.groups.ending}`; }
  // What is left is ipse, iste, ille, which share the genitive '-īus'
  return '-īus';
};

// Several numerals and pronouns decline as adjectives, so we set AdjectiveProperties for them.
module.exports = (lemma) => {
  if (lemma.includes('duo')) { return duoProps; }

  const genitive = setGenitive(lemma.split(', ')[0]);

  // Check if the word behaves as...
  const commaSplit = lemma.split(' <')[0].split(', ');
  // ... a three-form Type II adjective...
  if (commaSplit.length === 3) {
    const [, feminine, neuter] = commaSplit;
    // STRETCH: improve this 'suffixes' thing;
    return {
      feminine, neuter, genitive, suffixes: '3rd (-er/-ris/-re)',
    };
  }
  // ... or a two-form one.
  const [, neuter] = lemma.split(' <')[0].split(', ');
  return { neuter, genitive, suffixes: '3rd (-is/-e)' };
};
