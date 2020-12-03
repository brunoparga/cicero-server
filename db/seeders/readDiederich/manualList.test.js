"use strict";

/**
 * Unit tests for the word seed helper functions
 *
 * @group unit
 */

const ignore = require("expect-more-jest");

const manualList = require("./manualList");

describe("it is the correct object", () => {
  it("all values are strings", () => {
    expect(Object.values(manualList)).toBeArrayOf(expect.toBeNonEmptyString());
  });

  it("is 45 items long - the number of special words", () => {
    const specialWords = 45;

    expect(Object.values(manualList)).toHaveLength(specialWords);
  });
});
