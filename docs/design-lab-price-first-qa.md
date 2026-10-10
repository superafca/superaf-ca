# Design Lab: price-first estimator

Status: implemented for visual/interaction review only. Production is unchanged. PR #8 remains draft.

Review path: `/design-lab/index.html#estimate` on the sandbox deployment. The standalone review page and offline bundle are the same HTML/CSS/JS; the source asset hashes below were checked against GitHub.

## Owner direction implemented

- Show the cost before asking for name, email or phone. There are no contact fields in this preview.
- Retain the current FRONT / FRONT+ / MAX structure, HARD PP 5YR/10YR, add-ons, tint and glass choices.
- Give an immediate ballpark, optional year/make/model refinement, reactive itemized total, and a mobile total dock.
- Retain the five approved seasonal themes. Themes never change arithmetic.
- The continuation button demonstrates the post-price handoff only. No requests, bookings, payments, email or conversion events are sent.
- Dentologist remains only in arrival instructions.

## Pricing provenance and honesty boundary

Source repository files read from main:
- `src/lib/site.ts`, blob `23548442a5474a8f3e86862bdf9d5e9368eea8d3`.
- `src/lib/vehicles.ts`, blob `693e3e27a8ca47aa975a541b3cc089eae02d02ea`.

The review snapshot was transcribed from those source files, including the 32-make/235-model classification catalog. It is not a separate approved price list. No business rate was changed.

Labels distinguish ballpark, vehicle estimate, menu estimate and special-condition base estimate. A matched model or fixed computed number is NOT proof of an approved guaranteed quote. `verifiedPriceRecords` is empty and all results set `verified: false`. Unknown/out-of-range years do not inherit vehicle certainty. Existing film, damaged paint and modified panels flag unpriced extra work. A latent fallback size is cleared when leaving the unlisted-vehicle path.

Amounts are labeled CAD displayed subtotal; tax is explicitly not calculated. Tax treatment and preparation/removal pricing were not established in the inspected source. Do not present the subtotal as an all-in final price. Public launch needs approved tax/fee display and a documented rule for any verified-price badge.

The repo-native generator `scripts/build-design-lab-prices.mjs` is provided to export directly from the pricing functions and vehicle catalog. Its syntax was checked, but it was NOT executed against a complete checkout in this environment. Before release, run it from a current, reconciled checkout and compare the generated data to this review snapshot. No claim of full automated source parity is made.

## Tests actually run

1. **63/63 Node assertions passed** using `tests/design-lab-price-engine.test.mjs` (same test source run locally). Covers all 36 film/rank/size/package base combinations, extras/deduplication, colour rules, tint counts and zone exclusivity, combined totals, model/year lookup, special fitment, unknown range, empty selections and invalid inputs. Expectations were transcribed from the same source inputs; this is arithmetic regression, not independent business-price approval.
2. **67/67 focused Chromium assertions passed** on the complete self-contained review document. Covers immediate no-contact pricing, package/film/vehicle changes, combined services, hidden-state cleanup, direct tint/glass entry, all five themes with unchanged totals, CTA text contrast >=4.5:1, 320/390/768/1440px horizontal overflow checks, mobile total/breakdown, Escape/focus return, and reduced motion. Zero uncaught browser errors and zero HTTP requests during this isolated test.
3. JavaScript syntax checks passed for the data, engine, estimator, loader and generator.

Browser method: in-memory Playwright `page.set_content` with the actual bundled source and embedded image. Native file navigation was blocked by browser policy; hosted navigation/DNS also unavailable in this session. No access protections were disabled.

## Source integrity

The following published Git blob hashes equal the locally tested sources:

| File under public/design-lab | Git blob SHA |
| --- | --- |
| index.html | 34acd05d34644074fb3192de7a3da6bca52d4938 |
| estimate.css | 7a47991a988c10a89fd50e8637741ed63fa82941 |
| estimate.js | 5980936d98a86bc79edac04166081e2c636d355b |
| price-data.js | 2a115e3e77de21b4354a5e1e67bb00c1a0890f7d |
| price-engine.js | 7eaa313e0fadf9e8a03e50fd5e7d28e014d87ce8 |
| lab-price.js | d91e044d496975e97ecc98ce812e002c8771bc92 |
| lab.css (unchanged) | 958675f59d8154ebce6f3df814574e4ab9789013 |
| hero.svg (unchanged) | 0c27ded764bf1d2413601c696e516239602e197b |

## Exact release blockers / unverified surfaces

- Hosted browser, full-app `/sandbox` iframe, Safari/iOS, and native download behavior not tested.
- Full repository typecheck/lint/build/test suite not run locally. A Vercel status alone is not functional QA.
- Actual contact handoff, preserved selections through production submission, confirmation emails and conversion deduplication remain unconnected to this standalone preview.
- Verified-price authority/rules, tax treatment, special-fitment and extra-work charges must be established before presenting guaranteed/all-in quotes.
- Browser automation evidence was delivered in chat as `SUPERAF-Estimate-QA.json`; desktop/mobile screenshots and self-contained `SUPERAF-Price-First-Preview.html` also delivered there. These filenames are conversation artifacts, not GitHub-hosted files.

Re-run arithmetic: `node --test tests/design-lab-price-engine.test.mjs`.
Refresh snapshot in a full checkout: `node --experimental-strip-types scripts/build-design-lab-prices.mjs`.

No main write, merge, source invoice/email export, customer records, external lead submission or account-setting change was performed.
