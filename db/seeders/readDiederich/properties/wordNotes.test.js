"use strict";

/**
 * Unit tests for functions that set grammar and usage notes
 *
 * @group unit
 */

const wordNotes = require("./wordNotes");

describe("correctly sets notes", () => {
  it("returns undefined on words that need no notes", () => {
    expect(wordNotes("dea, -ae, f.")).toBeUndefined();
  });

  it("returns the indeclinable flag where needed", () => {
    expect(wordNotes("nefas, n. <INDECL>")).toEqual({ indeclinable: true });
  });

  it("returns a general (non-quod) note where needed", () => {
    expect(wordNotes("egō <ALT: ego>")).toEqual({ alternateForm: "ego" });
  });

  it("returns a QUOD-note about substantive and adjective forms", () => {
    expect(
      wordNotes("quisque, quaeque, quidque <QUOD: subst., quodque, adj.>")
    ).toEqual({ quodNote: "Neuter form is subst.; quodque is adj." });
  });
});
