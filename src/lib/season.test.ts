import assert from "node:assert/strict";
import test from "node:test";
import { resolveSeason, seasonFor } from "./season.ts";

const cases: Array<[string, string]> = [
  ["2026-09-21T18:00:00Z", "summer"],
  ["2026-09-22T18:00:00Z", "fall"],
  ["2026-11-30T18:00:00Z", "fall"],
  ["2026-12-01T18:00:00Z", "christmas"],
  ["2027-01-06T18:00:00Z", "christmas"],
  ["2027-01-07T18:00:00Z", "winter"],
  ["2027-03-19T18:00:00Z", "winter"],
  ["2027-03-20T18:00:00Z", "spring"],
  ["2027-06-20T18:00:00Z", "spring"],
  ["2027-06-21T18:00:00Z", "summer"],
  ["2026-01-01T18:00:00Z", "christmas"],
];

for (const [iso, season] of cases) {
  test(`season ${iso} is ${season}`, () => {
    assert.equal(seasonFor(new Date(iso)), season);
  });
}

test("11:30pm MT on Nov 30 is still fall", () => {
  assert.equal(seasonFor(new Date("2026-12-01T05:30:00Z")), "fall");
});

test("const override wins over the date", () => {
  assert.equal(resolveSeason({ override: "christmas", now: new Date("2026-07-01T18:00:00Z") }), "christmas");
});

test("invalid env is ignored", () => {
  assert.equal(
    resolveSeason({ override: null, env: "halloween", now: new Date("2026-10-08T18:00:00Z") }),
    "fall",
  );
});

test("valid env wins over the date", () => {
  assert.equal(resolveSeason({ override: null, env: "winter", now: new Date("2026-10-08T18:00:00Z") }), "winter");
});
