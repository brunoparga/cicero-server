"use strict";

/**
 * Unit tests for functions that set properties of declined numerals + pronouns
 *
 * @group unit
 */

const setNumeralAndPronounProperties = require("./setNumeralAndPronounProperties");

describe("gives the right properties to each type of word", () => {
  it("works with the irregular numeral duo (two)", () => {
    const duoProperties = {
      masculineGenitive: "duōrum",
      feminine: "duae",
      neuter: "duo",
      suffixes: "1st/2nd (-us)",
    };

    expect(setNumeralAndPronounProperties("duo, duae, duo")).toEqual(
      duoProperties
    );
  });

  it("works with -īus demonstratives", () => {
    const ipseProperties = {
      feminine: "ipsa",
      neuter: "ipsum",
      genitive: "-īus",
      suffixes: "3rd (-er/-ris/-re)",
    };

    expect(setNumeralAndPronounProperties("ipse, ipsa, ipsum")).toEqual(
      ipseProperties
    );
  });

  it("works with internal declension pronouns", () => {
    const quisqueProperties = {
      feminine: "quaeque",
      neuter: "quidque",
      genitive: "cuiusque",
      suffixes: "3rd (-er/-ris/-re)",
    };

    expect(setNumeralAndPronounProperties("quisque, quaeque, quidque")).toEqual(
      quisqueProperties
    );
  });

  it("works with irregular genitives", () => {
    const tresProperties = {
      neuter: "tria",
      genitive: "trium",
      suffixes: "3rd (-is/-e)",
    };

    expect(setNumeralAndPronounProperties("trēs, tria")).toEqual(
      tresProperties
    );
  });
});
