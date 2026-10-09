# Design Lab 003 — CR-V interaction slice

This revision is a working static visual-estimator slice, not the complete eight-car release. Production pages, pricing functions and lead integrations are unchanged. Branch: sandbox/site-rebuild-2026-10-08; PR #8.

## Implemented

- Real HTML price summary and controls around a neutral owner-supplied CR-V concept crop; no prices baked into artwork.
- FRONT includes hood, both front fenders, bumper and both mirror caps. Named scope and cap close-up remain available. Far-side fender is named, not falsely painted through the vehicle.
- FRONT+ has eight accessible numbered hotspots and corresponding cards. Selecting a visible part adds a dashed preview; door cups use a callout/close-up. Close-up alone does not select or charge.
- Fitment has not been commercially approved for this representative asset: extras remain requests, separate from the subtotal, with an explicit conditional combined estimate. Do not turn the geometric preview into applicability evidence.
- MAX offers Gloss / Satin / Matte on a fixed vehicle and camera. Satin/Matte require confirmed 10YR upgrade. Colour is rejected by the new model and removed from retained old-dialog controls. The finish effect is an illustrative paint-clipped reflection study, not photography of installed products.
- Tint offers all real carbon/ceramic catalog shades simultaneously, independent front/rear/extra-zone selection, and Original comparison. Shade browsing alone does not add a service. Film switching clears incompatible shades; glass counts remain explicit.
- Vehicle selector works without contact fields, removes stale uncertain extras and labels the CR-V as representative when the quote vehicle differs.
- All five themes, mobile subtotal dock, close-up dialogs, keyboard/focus return and reduced-motion CSS.
- Existing homepage PPF/primary/tint entry points route to the new static page. Existing glass demo is retained. No leads, payments or analytics are sent.

## Price boundary

Uses the unchanged existing public price-data.js and price-engine.js snapshot as estimates, not newly verified tariffs. Owner-reviewed LOW/HIGH records stay in private HQ; mapping to film options remains unresolved and is not guessed. Base scope correction adds no mirror fee. Existing customer price locks are unchanged. No new business-price approval is claimed.

## Evidence actually run

- 50 Node model/rule assertions plus 11 navigation assertions = 61/61 passed.
- 69/69 focused Playwright/system-Chromium checks passed on the actual self-contained build: coverage masks present, extras/conditional arithmetic, close-up and upgrade confirmation, shade compatibility, theme price invariance, year/make/model changes, zero-contact pricing, no horizontal overflow at 320/390/768/1024/1440px, mobile dock/focus and no uncaught browser errors or HTTP requests in that offline test.
- The rotation guard unit tests are preparatory only; there is no completed eight-car carousel in this slice.
- JavaScript syntax checked. No full-repository compile/lint/test claim: the runtime has a partial source mirror, and an actual clone attempt failed due to GitHub DNS resolution.
- Tests caught and fixed stale details-toggle state closing the vehicle selector, duplicate finish selectors, a tint mask overlapping the cap, and paint-clip holes affecting grille appearance.

Run Node checks: `node --test tests/visual-model.test.mjs tests/visual-launch.test.mjs`.
Browser check source and complete offline bundle are supplied in the source ZIP in the owner conversation. The evidence JSON is SUPERAF-Visual-003-QA.json. Screenshots are actual browser renders, not newly generated marketing mockups.

## Asset provenance

Source: owner-approved generated neutral CR-V tint concept already supplied in this conversation. Crop box (525,213,1325,659), output 800x446. Optimized 21,714-byte WebP, blob cf4200226767682fee0b96dd41aa441ef469c4eb. It is a representative concept, not verified model-year/trim photography or proof of installation. Coverage masks are separately drawn and require installer QA; no customer names, plates, VINs or invoices are present. No new image generation was performed in this pass.

The same binary is served by relative path in the hosted page and embedded as data in the offline copy. Hosted launch routing is unit tested; hosted navigation and Safari/iOS still require external observation. No authentication or browser restrictions were disabled.

## Release blockers and remaining work

- Independent panel-mask/part-applicability review, including CR-V fender geometry and cap boundaries; matching gloss/satin/matte physical references.
- Seven other vehicle assets, requested model-year validation, eight-car rotation/manual controls and per-vehicle applicability.
- LOW/HIGH film mapping and scoped approved-price import, new complexity-pricing policy, tax/extra-work policy and real production contact handoff.
- Consent-aware demand measurement remains OFF/unimplemented. No new private customer-data flow introduced.
- Hosted browser/full-app wrapper, iOS Safari, full repository regression and production delivery/booking tests are not verified by this local slice.

ChatGPT retains independent sandbox implementation. Zuckos review requested for panel/price/interaction QA; Elonos support requested for mapping and hosted/iOS observation where direct access is absent. Requests are not acknowledged completion. PR remains draft and unmerged.
