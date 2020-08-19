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

module.exports = (lemma) => {
  // TODO: genitive
  const commaSplit = lemma.split(' <')[0].split(', ');
  if (commaSplit.length === 3) {
    const [, feminine, neuter] = commaSplit;
    // STRETCH: improve this 'suffixes' thing;
    return { feminine, neuter, suffixes: '3rd (-er/-ris/-re)' };
  }
  const [, neuter] = lemma.split(' <')[0].split(', ');
  return { neuter, suffixes: '3rd (-is/-e)' };
};
