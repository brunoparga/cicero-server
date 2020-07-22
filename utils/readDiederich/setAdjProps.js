const setFirstAndSecondDeclensionAdjectives = (lemma) => {
  const [masculine, feminine] = lemma.split(', ');
  if (['-a', '-era'].includes(feminine)) {
    return {
      suffixes: '1st/2nd (-us)',
      masculineGenitive: `${masculine.replace(/us$/, 'ī')}`,
      feminine: `${masculine.replace(/us$/, 'a')}, ${masculine.replace(/us$/, 'ae')}`,
      neuter: `${masculine.replace(/us$/, 'um')}, ${masculine.replace(/us$/, 'ī')}`,
    };
  }
  // TODO: correct terra, classified as adjective
  // TODO: correct singulī, which ironically is plural
  return {
    suffixes: '1st/2nd (-er)',
    masculineGenitive: `${masculine.replace(/er$/, 'rī')}`,
    feminine: `${masculine.replace(/er$/, 'ra')}, -ae`,
    neuter: `${masculine.replace(/er$/, 'rum')}, -ī`,
  };
};

const setThirdDeclensionAdjectives = (lemma) => {
  if (lemma.split(',').length === 2) {
    return { suffixes: '3rd (-is/-e)', neuter: '-e' };
  }
  // TODO: tener is classified wrong, so are comparatives
  // TODO: full forms for 3rd decl adjectives
  return { suffixes: '3rd (-er/-ris/-re)', feminine: '-ris', neuter: '-e' };
};

module.exports = (lemma) => {
  if (lemma.match(/is$/)) {
    let space = lemma.indexOf(' ');
    space = (space + 1) ? space : 0;
    return { genitive: lemma.slice(space), suffixes: '3rd (all equal)' };
  } if (lemma.match(/(e|us)$/)) {
    return { genitive: '-is', ...setThirdDeclensionAdjectives(lemma) };
  } if (lemma.includes('indecl')) {
    return undefined;
  }
  return setFirstAndSecondDeclensionAdjectives(lemma);
};
