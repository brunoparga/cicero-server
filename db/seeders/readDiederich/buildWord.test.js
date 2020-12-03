"use strict";

/**
 * Unit tests for the function that builds a word object from a lemma and a
 * definition
 *
 * @group unit
 */

const buildWord = require("./buildWord");

describe("buildWord", () => {
  it("works with arbitrary input, thanks to default values", () => {
    expect(
      buildWord(["xyzzy <ALT: xuzzy>", "A very plugh place in Foo"])
    ).toEqual({
      partOfSpeech: "Adverb",
      lemma: "xyzzy",
      english: "A very plugh place in Foo",
      learned: false,

      properties: {
        alternateForm: "xuzzy",
      },
    });
  });
});
