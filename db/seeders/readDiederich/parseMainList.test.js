/* eslint-disable node/no-sync */
"use strict";

/**
 * Unit tests for the function that builds the JSON blueprint for the DB seed
 *
 * @group unit
 */

const fs = require("fs");
const path = require("path");

const parseMainList = require("./parseMainList");

describe("parseMainList", () => {
  it("idempotently creates a file named ../db.json", () => {
    const filename = path.join(__dirname, "../db.json");

    fs.rmSync(filename);
    expect(fs.existsSync(filename)).toBeFalsy();
    parseMainList();
    expect(fs.existsSync(filename)).toBeTruthy();

    // Repeating the assertion tests idempotence
    parseMainList();
    expect(fs.existsSync(filename)).toBeTruthy();
  });
});
