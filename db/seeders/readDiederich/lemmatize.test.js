"use strict";

/**
 * Unit tests for the function that corrects the word lemmas
 *
 * @group unit
 */

const lemmatize = require("./lemmatize");

describe("lemmatize", () => {
  it("works for the unusual lemma of mīlle", () => {
    expect(lemmatize("mīlle")).not.toEqual("mīlle");
    expect(lemmatize("mīlle")).toEqual("mīlle (sg.), mīlia (pl.)");
  });

  it("works for a word that falls into two exception groups", () => {
    expect(lemmatize("nēve ... nēve <ALT: neu ... neu>")).toEqual(
      "nēve ... nēve"
    );
  });

  it("works for lemmas (lemmata?) with spaces", () => {
    expect(lemmatize("rēs pūblica")).not.toEqual("rēs");
    expect(lemmatize("rēs pūblica")).toEqual("rēs pūblica");
  });

  it("works for lemmas that don't need to change", () => {
    expect(lemmatize("salvē (sg.), salvēte (pl.)")).not.toEqual("salvē");
    expect(lemmatize("salvē (sg.), salvēte (pl.)")).toEqual(
      "salvē (sg.), salvēte (pl.)"
    );
  });

  it("works for plain old boring lemmas", () => {
    expect(lemmatize("cultus, -ūs")).toEqual("cultus");
  });
});
