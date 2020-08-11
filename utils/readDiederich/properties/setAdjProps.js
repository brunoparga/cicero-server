const setFirstAndSecondDeclensionAdjectives = (lemma) => {
  const [masculine, feminine] = lemma.split(', ');
  if (feminine === '-ae') {
    return {
      suffixes: '1st/2nd (-us)',
      masculineGenitive: `${masculine.replace(/ī$/, 'ōrum')}`,
      feminine: `${masculine.replace(/ī$/, 'ae')}, -ārum`,
      neuter: `${masculine.replace(/ī$/, 'a')}, -ōrum`,
    };
  } if (['-a', '-era'].includes(feminine)) {
    return {
      suffixes: '1st/2nd (-us)',
      masculineGenitive: '-ī',
      feminine: `${masculine.replace(/us$/, 'a')}, -ae`,
      neuter: `${masculine.replace(/us$/, 'um')}, -ī`,
    };
  }
  return {
    suffixes: '1st/2nd (-er)',
    masculineGenitive: `${masculine.replace(/(.+?)(ch|b|c|g|t)er$/, '-$2rī')}`,
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
  if (/is$/.test(lemma)) {
    let space = lemma.indexOf(' ');
    space = (space + 1) ? space : 0;
    return { genitive: lemma.slice(space), suffixes: '3rd (all equal)' };
  } if (/(e|us)$/.test(lemma)) {
    return { genitive: '-is', ...setThirdDeclensionAdjectives(lemma) };
  } if (lemma.includes('indecl')) {
    return undefined;
  }
  return setFirstAndSecondDeclensionAdjectives(lemma);
};
