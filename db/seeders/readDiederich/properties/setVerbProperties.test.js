/* eslint-disable no-magic-numbers */
"use strict";

/**
 * Unit tests for functions that set verb properties
 *
 * @group unit
 */

const setVerbProperties = require("./setVerbProperties");

describe("correctly sets deponent verbs", () => {
  it("sets verbs whose infinitive ends in 'e' to non-deponent", () => {
    expect(setVerbProperties("foō, foāre")).toHaveProperty("deponent", false);
  });

  it("sets verbs whose infinitive ends in 'ī' to deponent", () => {
    expect(setVerbProperties("bar, bārī")).toHaveProperty("deponent", true);
  });
});

describe("correctly sets conjugations", () => {
  it("works for deponent verbs", () => {
    expect(setVerbProperties("vamprubar, vamprubārī")).toHaveProperty(
      "conjugation",
      0
    );
  });

  it("works for first conjugation verbs", () => {
    expect(setVerbProperties("sitocō, sitocāre")).toHaveProperty(
      "conjugation",
      0
    );
  });

  it("works for irregular first conjugation verbs", () => {
    expect(setVerbProperties("simandō, simandare")).toHaveProperty(
      "conjugation",
      0
    );
  });

  it("works for second conjugation verbs", () => {
    expect(setVerbProperties("dēlēō, dēlēre")).toHaveProperty("conjugation", 1);
  });

  it("works for third conjugation verbs", () => {
    expect(setVerbProperties("whō, where")).toHaveProperty("conjugation", 2);
  });

  it("works for irregular third conjugation verbs", () => {
    expect(setVerbProperties("petisuī, petisuisse")).toHaveProperty(
      "conjugation",
      2
    );
  });

  it("works for fourth conjugation verbs", () => {
    expect(setVerbProperties("upior, upīrī")).toHaveProperty("conjugation", 3);
  });

  it("works for no-conjugation irregular verbs like ferō", () => {
    expect(setVerbProperties("ferō, ferre")).toHaveProperty("conjugation", -1);
  });
});

describe("handles irregular infinitives", () => {
  it("handles 'inquam'", () => {
    expect(
      setVerbProperties("inquam, inquis, inquit, inquiunt")
    ).toHaveProperty("correctInfinitive", "No infinitive");
  });

  it("handles 'āiō'", () => {
    expect(setVerbProperties("āiō, ais, ait, aiunt")).toHaveProperty(
      "correctInfinitive",
      "aiere"
    );
  });

  it("handles ferō, sum, etc.", () => {
    expect(setVerbProperties("ferō, ferre")).toHaveProperty(
      "correctInfinitive",
      "ferre"
    );
  });
});

describe("handles the fourth form of the verb", () => {
  it("works for no supine or participle", () => {
    expect(setVerbProperties("āiō, ais, ait, aiunt")).toHaveProperty(
      "supine",
      undefined
    );
  });

  it("works for only a participle", () => {
    expect(setVerbProperties("arcō, -ere, -ī, arctūrus")).toHaveProperty(
      "supine",
      "arctūrus (part.)"
    );
  });

  it("works for a supine", () => {
    expect(setVerbProperties("dō, dare, dedī, datum")).toHaveProperty(
      "supine",
      "datum"
    );
  });
});

describe("deals with the perfect", () => {
  it("recognizes the perfect", () => {
    expect(setVerbProperties("eō, īre, iī (īvī), itum")).toHaveProperty(
      "perfect",
      "iī (īvī)"
    );
  });

  it("recognizes verbs without a perfect stem", () => {
    expect(setVerbProperties("foō, bāre, --, quuctum")).toHaveProperty(
      "perfect",
      undefined
    );
  });
});
