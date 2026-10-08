import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { frontPlusFrom, fullBodyFrom, fullFrontFrom, tintFrontsFrom, windshieldFilm } from "./price-anchors.ts";
import { proofStats, site } from "./site.ts";

test("price anchors match the estimator today", () => {
  assert.equal(fullFrontFrom, 849);
  assert.equal(fullBodyFrom, 2799);
  assert.equal(windshieldFilm, 269);
  assert.equal(tintFrontsFrom, 179);
  assert.equal(frontPlusFrom, 948);
});

test("listed pages do not hard-code the anchor prices", () => {
  for (const file of ["src/components/landing.tsx", "src/components/info-panels.tsx"]) {
    const source = readFileSync(file, "utf8");
    for (const literal of ["$849", "$2,799", "$269"]) {
      assert.equal(source.includes(literal), false, `${file} still has ${literal}`);
    }
  }
});

test("stat labels and phone stay exact", () => {
  const years = proofStats.find((stat) => stat.value === "14");
  assert.ok(years);
  assert.equal(years.label, "Combined years of installer experience");
  assert.equal(years.short, "Combined years of installer experience");
  assert.equal(years.text, "14 combined years of installer experience");
  assert.equal(site.installerYears, "14 combined years of installer experience");
  assert.equal(site.installerYearsValue, "14");
  const money = proofStats.find((stat) => stat.value === "Over $300M");
  assert.equal(money?.label, "in vehicles protected since 2016");
  assert.equal(money?.text, "Over $300M in vehicles protected since 2016");
  for (const stat of proofStats) assert.equal(stat.value.includes("+"), false);
  const tree = readFileSync("src/lib/site.ts", "utf8") + readFileSync("src/components/landing.tsx", "utf8");
  assert.equal(/403-|\(403\)/.test(tree), false);
});
