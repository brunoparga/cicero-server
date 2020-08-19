/*
SHAPE OF THE OBJECT THAT MUST BE RETURNED
export type AdjectiveProperties = {
  masculineGenitive?: string,
  feminine?: string;
  neuter?: string;
  genitive?: string;
  suffixes: string;
};
*/

const setGenitive = (lemma) => {
  // if the first word of lemma begins with qu, the genitive is cuius**
  // for three demonstratives, it is -īus
  // others on case-by-case basis
  const [head] = lemma.split(', ');

  // First, solve the case-by-case problems, as one of them would wrongly fit on the 'cuius' type
  const caseByCase = {
    quisquis: 'cuiuscuius',
    uterque: 'utrīusque',
    is: 'eius',
    īdem: 'eiusdem',
    hic: 'huius',
    trēs: 'trium',
  };
  if (caseByCase[head]) { return caseByCase[head]; }

  // Then solve the 'cuius' cases
  const match = head.match(/(?:qu(?:is|ī))(?<ending>.*)/);
  if (match) { return `cuius${match.groups.ending}`; }
  // What is left is ipse, iste, ille, which share the genitive '-īus'
  return '-īus';
};

module.exports = (lemma) => {
  if (lemma.includes('duo')) {
    return {
      masculineGenitive: 'duōrum',
      feminine: 'duae',
      neuter: 'duo',
      suffixes: '1st/2nd (-us)',
    };
  }
  const genitive = setGenitive(lemma);
  const commaSplit = lemma.split(' <')[0].split(', ');
  if (commaSplit.length === 3) {
    const [, feminine, neuter] = commaSplit;
    // STRETCH: improve this 'suffixes' thing;
    return {
      feminine, neuter, genitive, suffixes: '3rd (-er/-ris/-re)',
    };
  }
  const [, neuter] = lemma.split(' <')[0].split(', ');
  return { neuter, genitive, suffixes: '3rd (-is/-e)' };
};
