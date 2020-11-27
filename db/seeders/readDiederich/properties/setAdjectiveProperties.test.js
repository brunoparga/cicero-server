"use strict";

/**
 * Unit tests for functions that set adjective properties
 *
 * @group unit
 */

const setAdjectiveProperties = require("./setAdjectiveProperties");

describe("setAdjectiveProperties", () => {
  it("gives undefined properties if adjective is indeclinable", () => {
    const indeclinableAdjective = "necesse <INDECL>";

    expect(setAdjectiveProperties(indeclinableAdjective)).toBeUndefined();
  });

  it("gives the genitive and suffixes of uniform adjectives", () => {
    const uniformAdjective = "ferōx, -ōcis";
    const properties = { genitive: "-ōcis", suffixes: "3rd (all equal)" };

    expect(setAdjectiveProperties(uniformAdjective)).toEqual(properties);
  });

  it("gives genitive, suffixes and neuter of two-form adjectives", () => {
    const twoFormAdjective = "caelestis, -e";
    const properties = {
      genitive: "-is",
      suffixes: "3rd (-is/-e)",
      neuter: "-e",
    };

    expect(setAdjectiveProperties(twoFormAdjective)).toEqual(properties);
  });

  it("gives the correct properties of three-form type II adjectives", () => {
    const threeFormTypeTwo = "ācer, ācris, ācre";
    const properties = {
      genitive: "-is",
      suffixes: "3rd (-er/-ris/-re)",
      feminine: "-ris",
      neuter: "-e",
    };

    expect(setAdjectiveProperties(threeFormTypeTwo)).toEqual(properties);
  });

  it("correctly handles the pronoun-like 'alius'", () => {
    const properties = {
      suffixes: "1st/2nd (-us)",
      masculineGenitive: "alterīus",
      feminine: "alia",
      neuter: "aliud",
    };

    expect(setAdjectiveProperties("alius, -a, -ud")).toEqual(properties);
  });

  it("correctly handles the always-plural adjective singulī", () => {
    const properties = {
      suffixes: "1st/2nd (-us)",
      masculineGenitive: "singulōrum",
      feminine: "singulae, -ārum",
      neuter: "singula, -ōrum",
    };

    expect(setAdjectiveProperties("singulī, -ae, -a")).toEqual(properties);
  });

  it("correctly handles common Type I adjectives", () => {
    const properties = {
      suffixes: "1st/2nd (-us)",
      masculineGenitive: "-ī",
      feminine: "Rōmāna, -ae",
      neuter: "Rōmānum, -ī",
    };

    expect(setAdjectiveProperties("Rōmānus, -a, -um")).toEqual(properties);
  });

  it("correctly handles Type I adjectives that drop a vowel in declension", () => {
    const properties = {
      suffixes: "1st/2nd (-er)",
      masculineGenitive: "-brī",
      feminine: "rubra, -ae",
      neuter: "rubrum, -ī",
    };

    expect(setAdjectiveProperties("ruber, -bra, -brum")).toEqual(properties);
  });
});
