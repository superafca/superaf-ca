import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { reviewPresentation, validateReviewFile } from "./google-reviews.ts";

test("rejects missing text, bad stars, and invented fields", () => {
  assert.equal(validateReviewFile({ reviews: [{ name: "A B.", stars: 5, date: "2026-10-07" }] }).ok, false);
  assert.equal(validateReviewFile({ reviews: [{ name: "A B.", stars: 6, text: "Hi", date: "2026-10-07" }] }).ok, false);
  assert.equal(validateReviewFile({ reviews: [{ name: "A B.", stars: 0, text: "Hi", date: "2026-10-07" }] }).ok, false);
  assert.equal(
    validateReviewFile({ reviews: [{ name: "A B.", stars: 5, text: "Hi", date: "2026-10-07", vibe: "yes" }] }).ok,
    false,
  );
  assert.equal(validateReviewFile({ surprise: true, reviews: [] }).ok, false);
  const ok = validateReviewFile({
    asOf: null,
    rating: null,
    count: null,
    profileUrl: "https://example.com",
    reviews: [{ name: "A B.", stars: 5, text: "Hi", date: "2026-10-07" }],
  });
  assert.equal(ok.ok, true);
});

test("fewer than 3 reviews stays a static card", () => {
  assert.equal(reviewPresentation(0), "card");
  assert.equal(reviewPresentation(2), "card");
  assert.equal(reviewPresentation(3), "strip");
});

test("places key stays in server-only modules", () => {
  const hits: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(ts|tsx|mjs|js)$/.test(name)) continue;
      const text = readFileSync(full, "utf8");
      const needle = ["GOOGLE", "PLACES", "API", "KEY"].join("_");
      if (text.includes(needle)) hits.push(full);
    }
  };
  walk("src");
  assert.ok(hits.length > 0);
  for (const file of hits) assert.match(file, /\.server\.ts$/);
});
