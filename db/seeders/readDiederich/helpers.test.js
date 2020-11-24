/**
 * Unit tests for the word seed helper functions
 *
 * @group unit
 */
const { treatDefinition } = require('./helpers');

describe('treatDefinition', () => {
  it('trims explanations and parts of speech in parentheses', () => {
    const definition = '(foo) A bar that bazzes quuxly';
    expect(treatDefinition(definition)).toBe('A bar that bazzes quuxly');
  });

  it('lowercases a starting capital E', () => {
    const definition = 'Earth is the third planet from the Sun';
    expect(treatDefinition(definition)).toBe('earth is the third planet from the Sun');
  });

  it('leaves any other beginnings unchanged', () => {
    const definition = 'A corge is a grault with many garplies.';
    expect(treatDefinition(definition)).toBe(definition);
  });
});
