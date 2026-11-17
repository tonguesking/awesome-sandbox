import assert from "node:assert/strict";
import { test } from "vitest";
import { escapeCsvCell, toCsv } from "./csv";

test("plain cells are emitted unchanged", () => {
  assert.equal(escapeCsvCell("E2B"), "E2B");
});

test("commas and quotes are quoted per RFC 4180", () => {
  assert.equal(escapeCsvCell("Memory + processes, disk"), '"Memory + processes, disk"');
  assert.equal(escapeCsvCell('the "fast" one'), '"the ""fast"" one"');
});

test("rows join with CRLF and preserve column count", () => {
  const csv = toCsv([
    ["Sandbox", "Idle billing"],
    ["E2B", "Wall-clock"],
  ]);

  assert.equal(csv, "Sandbox,Idle billing\r\nE2B,Wall-clock");
  assert.equal(csv.split("\r\n").length, 2);
});
