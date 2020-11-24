/**
 * Unit tests for the word seed helper functions
 *
 * @group unit
 */
const {
  compare, deduplicate, isEmpty, multiIncludes, treatDefinition,
} = require('./helpers');

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

// A compare function used in sorting 2-element arrays alphabetically by the second element.
// Must return 1 if the arguments must be switched, -1 if not (and 0 if they're equal).
describe('compare', () => {
  const foo = ['foo', 'quux'];

  it('alphabetizes by word definition, not lemma', () => {
    const bar = ['waldo', 'baz'];
    expect(compare(foo, bar)).toEqual(1);
  });

  it('correctly uses treatDefinition', () => {
    const bar = ['waldo', '(bar) baz'];
    expect(compare(foo, bar)).toEqual(1);
  });

  it('correctly keeps already alphabetized words', () => {
    const fred = ['fred', 'plugh'];
    const xyzzy = ['xyzzy', 'thud'];
    expect(compare(fred, xyzzy)).toEqual(-1);
  });

  it('throws an error when given two identical definitions', () => {
    expect(compare(foo, foo)).toEqual(0);
  });
});

// A filtering function, returning true iff an element is either the first in the array
// or its head is different from the preceding one's head.
describe('deduplicate', () => {
  const array = [['foo', 'bar'], ['foo', 'foo'], ['baz', 'quux']];
  it('returns true if the index of the element is 0', () => {
    expect(deduplicate(['foo', 'bar'], 0, array)).toBe(true);
  });

  it('returns true if the head of the first element is different from the preceding one', () => {
    expect(deduplicate(['baz', 'quux'], 2, array)).toBe(true);
  });

  it('returns false on a duplicate', () => {
    expect(deduplicate(['foo', 'foo'], 1, array)).toBe(false);
  });
});

describe('isEmpty', () => {
  it('returns true with an empty argument', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('returns false with a non-empty argument', () => {
    expect(isEmpty({ foo: 'bar' })).toBe(false);
  });
});

describe('multiIncludes', () => {
  const description = `Given a string haystack and an array of string needles, this function
  returns true if any of the needles is a substring of the haystack.`;
  const needles = ['sewing', 'hypodermic', 'record player', 'indicator', 'pine', 'this'];
  const words = ['function', 'needle', 'haystack', 'JavaScript'];

  it('finds one needle', () => {
    expect(multiIncludes(description, needles)).toBe(true);
  });

  it('finds more than one needle', () => {
    expect(multiIncludes(description, words)).toBe(true);
  });

  it('correctly returns false when no needles are in the haystack', () => {
    expect(multiIncludes(description, ['nail', 'pin', 'thumbtack'])).toBe(false);
  });

  it('returns false when the haystack is empty', () => {
    expect(multiIncludes([], needles)).toBe(false);
  });
});
