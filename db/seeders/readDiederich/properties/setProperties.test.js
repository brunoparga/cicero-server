"use strict";

/**
 * Unit tests for the function that calls all others in this directory
 *
 * @group unit
 */

const setProperties = require("./setProperties");

describe("correctly sets word properties and notes", () => {
  it("does nothing for words that do not need properties", () => {
    expect(setProperties("Interjection", "ō")).toBeUndefined();
  });

  it("sets only notes", () => {
    expect(setProperties("Interjection", "re- <ALT: red->")).toEqual({
      alternateForm: "red-",
    });
  });

  it("sets only properties", () => {
    expect(setProperties("Noun", "lyra, -ae, f.")).toEqual({
      number: "singular",
      declension: 0,
      gender: "feminine",
    });
  });

  it("sets both properties and notes", () => {
    expect(
      setProperties(
        "Verb",
        "feriō, -īre, --, -- <VN: as perfect use īcō or percūtiō>"
      )
    ).toEqual({
      conjugation: 3,
      correctInfinitive: undefined,
      deponent: false,
      perfect: undefined,
      supine: undefined,
      verbNote: "as perfect use īcō or percūtiō",
    });
  });

  // The previous two tests verify nouns and verbs. Now checking adjectives
  // and declined numerals and pronouns.
  it("works for adjectives", () => {
    expect(setProperties("Adjective", "quot <INDECL>")).toEqual({
      indeclinable: true,
    });
  });

  it("works for declined numerals and pronouns", () => {
    const duoProperties = {
      masculineGenitive: "duōrum",
      feminine: "duae",
      neuter: "duo",
      suffixes: "1st/2nd (-us)",
    };

    expect(setProperties("Numeral", "duo, duae, duo")).toEqual(duoProperties);
  });
});
