/* eslint-disable no-magic-numbers */
"use strict";

/**
 * Unit tests for functions that set noun properties
 *
 * @group unit
 */

const setNounProperties = require("./setNounProperties");

describe("works with fully irregular nouns", () => {
  it("correctly handles mīlle", () => {
    const milleProperties = {
      number: "plural",
      declension: 2,
      gender: "neuter",
      miscellaneousNote: "sg. is an indecl. adj.",
    };

    expect(setNounProperties("mīlle")).toEqual(milleProperties);
  });

  it("correctly handles nēmō", () => {
    const nemoProperties = {
      number: "singular",
      declension: 2,
      gender: "masculine/feminine",
      correctGenitive: "nūllīus",
    };

    expect(setNounProperties("nēmō")).toEqual(nemoProperties);
  });
});

describe("works with irregular genitive nouns", () => {
  it("laurus, -ī/-ūs", () => {
    expect(setNounProperties("laurus, -ī/-ūs")).toHaveProperty(
      "correctGenitive",
      "-ī"
    );
  });

  it("vicis", () => {
    expect(setNounProperties("vicis, acc. vicem, abl. vice")).toHaveProperty(
      "correctGenitive",
      "(word is already a genitive)"
    );
  });

  it("vīrēs", () => {
    expect(
      setNounProperties("vīs <DN: sg. only acc. vim, abl. vī; pl. vīrēs, -ium>")
    ).toHaveProperty("correctGenitive", "--");
  });

  it("sponte", () => {
    expect(
      setNounProperties(
        "sponte <DN: no nom., sponte is abl.; gen. spontis very rare>"
      )
    ).toHaveProperty("correctGenitive", "spontis");
  });
});

describe("with noun numbers", () => {
  it("works for singular nouns", () => {
    expect(setNounProperties("bar, baris")).toHaveProperty(
      "number",
      "singular"
    );
  });
  it("works for plural nouns", () => {
    expect(setNounProperties("corge, corgum")).toHaveProperty(
      "number",
      "plural"
    );
  });
});

describe("with noun genders", () => {
  it("works for masculine nouns", () => {
    expect(setNounProperties("Caesar, -is, m.")).toHaveProperty(
      "gender",
      "masculine"
    );
  });

  it("works for feminine nouns", () => {
    expect(setNounProperties("Minerva, -ae, f.")).toHaveProperty(
      "gender",
      "feminine"
    );
  });

  it("works for nouns that are both masculine and feminine", () => {
    expect(setNounProperties("bōs, bovis, mf.")).toHaveProperty(
      "gender",
      "masculine/feminine"
    );
  });

  it("works for neuter nouns", () => {
    expect(setNounProperties("fas, n. <INDECL>")).toHaveProperty(
      "gender",
      "neuter"
    );
  });
});

describe("with noun declensions", () => {
  it("detects a noun is indeclinable", () => {
    expect(setNounProperties("grault, n. <INDECL>")).toHaveProperty(
      "declension",
      undefined
    );
  });

  it("correctly classifies a first-declension noun", () => {
    expect(setNounProperties("Rōma, -ae, f.")).toHaveProperty("declension", 0);
  });

  it("correctly classifies a second-declension noun", () => {
    expect(setNounProperties("ferrum, -ī, n.")).toHaveProperty("declension", 1);
  });

  it("correctly classifies a third-declension noun", () => {
    expect(setNounProperties("āēr, āeris, m.")).toHaveProperty("declension", 2);
  });

  it("correctly classifies a fourth-declension noun", () => {
    expect(setNounProperties("Īō, Īūs, f.")).toHaveProperty("declension", 3);
  });

  it("correctly classifies a fifth-declension noun", () => {
    expect(setNounProperties("glaciēs, -ēī")).toHaveProperty("declension", 4);
  });

  it("correctly classifies a plural first-declension noun", () => {
    expect(setNounProperties("dīvitiae, -ārum, f. (pl.)")).toHaveProperty(
      "declension",
      0
    );
  });

  it("correctly classifies a plural second-declension noun", () => {
    expect(setNounProperties("arma, -ōrum, n. (pl.)")).toHaveProperty(
      "declension",
      1
    );
  });

  it("correctly classifies a plural third-declension noun", () => {
    expect(setNounProperties("moenia, -ium, n. (pl.)")).toHaveProperty(
      "declension",
      2
    );
  });
});
