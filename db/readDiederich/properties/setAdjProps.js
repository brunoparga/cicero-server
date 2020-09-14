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
  feminine: `${masculine.replace(/us$/, '')}a, -ae`,
  neuter: `${masculine.replace(/us$/, '')}um, -ī`,
});

// Some adjectives drop the letter E, so that 'integer' gives 'integral', for example.
const typeOneShortened = (masculine) => ({
  suffixes: '1st/2nd (-er)',
  masculineGenitive: `${masculine.replace(/(.+?)(ch|b|c|g|t)er$/, '-$2rī')}`,
  feminine: `${masculine.replace(/er$/, 'ra')}, -ae`,
  neuter: `${masculine.replace(/er$/, 'rum')}, -ī`,
});

// Alius is a "pronominal adjective", so it is odd
const aliusProps = {
  suffixes: '1st/2nd (-us)',
  masculineGenitive: 'alterīus',
  feminine: 'alia',
  neuter: 'aliud',
};

// Type I includes three-form adjectives that decline following the first and second declensions.
const typeOne = (lemma) => {
  if (lemma.includes('alius')) { return aliusProps; }

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
  // STRETCH: full forms for 3rd decl adjectives
  return { suffixes: '3rd (-er/-ris/-re)', feminine: '-ris', neuter: '-e' };
};

// Adjective properties must list the suffixes the adjective uses, and also information to inflect
// them by gender and case (except that some adjectives don't inflect).
module.exports = (lemma) => {
  if (lemma.includes('INDECL')) { return undefined; }

  const head = lemma.replace(/ <.*>/, '');
  if (/is$/.test(head)) {
    return {
      genitive: head.slice(head.indexOf(' ') + 1),
      suffixes: '3rd (all equal)',
    };
  }
  if (/(e|us)$/.test(head)) { return { genitive: '-is', ...typeTwo(head) }; }
  return typeOne(head);
};
