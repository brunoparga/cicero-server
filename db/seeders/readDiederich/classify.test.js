"use strict";

/**
 * Unit tests for the function that sets the part of speech a word belongs to
 *
 * @group unit
 */

const classify = require("./classify");

describe("classify with special words", () => {
  it("correctly classifies a word from the special list", () => {
    expect(classify("igitur")).toEqual("Conjunction");
  });
});

describe("classify with words classified by lemma", () => {
  it("classifies a lemma that specifies a gender as a noun", () => {
    expect(classify("foō, foūs, n.", "a type of bar")).toEqual("Noun");
  });

  describe("classifies as verbs", () => {
    it("four-word lemmas", () => {
      expect(
        classify("foo, bar, baz, quux", "metasyntactic variables")
      ).toEqual("Verb");
    });

    it("(but not those that have <notes>", () => {
      expect(
        classify("foo, bar, baz, <quux>", "notes have arbitrary length")
      ).not.toEqual("Verb");
    });

    it("also uses the definition to decide something is a verb", () => {
      expect(classify("", "to corge all graults")).toEqual("Verb");
    });
  });

  it("classifies a lemma with 2 or 3 words as an adjective", () => {
    expect(classify("xyzzy, -e", "garply in appearance")).toEqual("Adjective");
  });

  it("classifies a lemma ending in a dash as a prefix", () => {
    expect(classify("waldo-", "fred-")).toEqual("Prefix");
  });

  it("classifies a lemma beginning in a dash as a particle", () => {
    expect(classify("-plugh", "thuddingly")).toEqual("Particle");
  });
});

describe("classify with words classified by definition", () => {
  it("classifies a definition with an exclamation mark as an interjection", () => {
    expect(classify("foo!", "an expression of bazness; 'bar!'")).toEqual(
      "Interjection"
    );
  });

  it("sends any words as yet unclassified to the adverb pile", () => {
    expect(classify("quux", "metasyntactically")).toEqual("Adverb");
  });
});
