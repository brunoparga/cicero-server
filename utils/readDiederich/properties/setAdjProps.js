// Some adjectives are always plural. In the current list, they always belong to type I.
const typeOnePlural = (masculine) => ({
  suffixes: '1st/2nd (-us)',
  masculineGenitive: `${masculine.replace(/ī$/, 'ōrum')}`,
  feminine: `${masculine.replace(/ī$/, 'ae')}, -ārum`,
  neuter: `${masculine.replace(/ī$/, 'a')}, -ōrum`,
});

// These are the commonest adjectives of all.
const typeOneCommon = (masculine) => ({
  suffixes: '1st/2nd (-us)',
  masculineGenitive: '-ī',
  feminine: `${masculine.replace(/us$/, 'a')}, -ae`,
  neuter: `${masculine.replace(/us$/, 'um')}, -ī`,
});

// Some adjectives drop the letter E, so that 'integer' gives 'integral', for example.
const typeOneShortened = (masculine) => ({
  suffixes: '1st/2nd (-er)',
  masculineGenitive: `${masculine.replace(/(.+?)(ch|b|c|g|t)er$/, '-$2rī')}`,
  feminine: `${masculine.replace(/er$/, 'ra')}, -ae`,
  neuter: `${masculine.replace(/er$/, 'rum')}, -ī`,
});

// Type I includes three-form adjectives that decline following the first and second declensions.
const typeOne = (lemma) => {
  const [masculine, feminine] = lemma.split(', ');
  if (feminine === '-ae') { return typeOnePlural(masculine); }
  if (['-a', '-era'].includes(feminine)) { return typeOneCommon(masculine); }
  return typeOneShortened(masculine);
};

// Type II includes adjectives that follow the third declension. They can have two or three gender
// forms (covered by this function) or just one (covered by the exported function).
const typeTwo = (lemma) => {
  if (lemma.split(',').length === 2) {
    return { suffixes: '3rd (-is/-e)', neuter: '-e' };
  }
  // TODO: full forms for 3rd decl adjectives
  return { suffixes: '3rd (-er/-ris/-re)', feminine: '-ris', neuter: '-e' };
};

// TODO: check exactly what this does (as in, which uniform adjectives it applies to, and how)
const genitive = (lemma) => {
  const spaceIndex = lemma.indexOf(' ');
  const space = (spaceIndex + 1) ? spaceIndex : 0;
  return lemma.slice(space);
};

// Adjective properties must list the suffixes the adjective uses, and also information to inflect
// them by gender and case.
module.exports = (lemma) => {
  if (/is$/.test(lemma)) { return { genitive: genitive(lemma), suffixes: '3rd (all equal)' }; }
  if (/(e|us)$/.test(lemma)) { return { genitive: '-is', ...typeTwo(lemma) }; }
  if (lemma.includes('indecl')) { return undefined; }
  return typeOne(lemma);
};
