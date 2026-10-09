# Design Lab 004 — visual correction, not a new theme

## Implemented

Keeps the light Core red/white/blue and the five existing seasonal token sets. Uses the owner's downtown Calgary photograph as a faint header backdrop; no mountains, invented skyline or new dark/cyan design. The homepage design itself is unchanged.

Year/make/model fields are above the visualizer, initially expanded. Explicit valid confirmation collapses them to an editable summary. Prices and a browse-without-vehicle path remain available without contact fields. A 2027 selection stays a ballpark rather than inheriting the 2026 price approval.

FRONT and FRONT+ now share a clean static crop of the earlier red CR-V artwork, with included mirror-cap annotations baked into that asset. There are no runtime base PPF masks and no inaccurate optional-area fill. FRONT+ has eight selection cards, image thumbnails and close-up dialogs. Opening a detail is not a selection. Unconfirmed-fitment requests are separate from the subtotal with a conditional menu-based total. No universal fitment or panel-accuracy approval is claimed.

Tint now uses the existing site's separate lighter-glass side-view and its registered PNG masks, not the dark CR-V glass. Front, rear door and rear quarter are independently controlled; windshield/visor uses the existing front-view reference. All source image/mask layers share one coordinate canvas and the same responsive crop. Original comparison changes only the selected glass layers. The opposite side is described rather than drawn through the vehicle. Real catalog shade choices and film/count prices retained.

MAX keeps Gloss/Satin/Matte controls, explicit 10YR upgrade/cancel and no colour offering. The misleading rough full-body reflection overlay is removed. The vehicle remains neutral; finish differences are shown by clearly labelled material samples while matching finish artwork remains pending. This is not a completed vehicle-finish renderer.

Homepage primary/PPF/tint entry points route to studio-004.html. The earlier visual-estimator.html URL redirects there, retaining only allowed skin/mode values. Existing glass demo remains available. No production source, rate input or lead integration is changed.

## Local vehicle-interest diagnostics

Optional sandbox check only; disabled by default, memory-only, no transport and no live customer dataset. Explicit opt-in enables allowlisted vehicle selection, price display, configuration and continuation records. Same-configuration event deduplication, at most 200 rows, unique increasing sequence, withdrawal clears memory, and no retroactive events. Only catalog/configuration fields; no names, emails, phones, VINs, free text, full URLs or contact payloads. Theme changes, autoplay and server-accepted enquiries are not fabricated as events. A continuation remains intent, not a received lead. Closing the page clears the log; export is an explicit local file download.

This validates an event contract, not a deployed analytics pipeline or legal-compliance certification. Live consent/storage/retention and server-confirmed enquiry linkage remain off and unimplemented.

## Evidence actually obtained

- 38/38 Node assertions: 24 model/privacy checks, 11 homepage-entry checks and 3 redirect checks.
- 61/61 focused Chromium checks on the actual fully self-contained page: vehicle prompt/summary/edit, base image instead of runtime PPF fill, requested extras/conditional arithmetic, close-ups/focus, finish upgrade/cancel, real shade inventory, all three visible glass layers, original comparison, five-theme price invariance, consent/dedupe/withdrawal, no contact gate, and 320/390/768/1024/1440px overflow checks in all four modes.
- Tint pixel regression: 24,190 changed pixels inside registered glass regions; zero changed pixels outside them, using a maximum-channel difference threshold of 4 and a 3px mask-edge/antialias allowance. This verifies mask containment in the test render, not independent physical fitment or installed VLT.
- No uncaught browser errors or remote tracking/lead requests in the isolated browser run. JavaScript syntax checks passed.

Browser method: localhost navigation was attempted but unavailable; a fresh system-Chromium page rendered the fully bundled source with page.set_content. No browser or authentication protections were disabled. Actual screenshots, JSON and reproducible Python browser source are in the conversation delivery ZIP. Hosted navigation, iOS Safari, production lead delivery and full-app regression are not established by this run. Full-repository build/lint was not run from this partial source mirror.

Re-run Node: node --test tests/studio-004.test.mjs tests/visual-launch.test.mjs tests/studio-004-redirect.test.mjs
Within the conversation delivery bundle: python build004.py, then python tests/browser004.py (requires Playwright, Chromium, Pillow and NumPy).

## Asset provenance

- crv-front-static.webp: derived from the earlier owner-approved red estimator concept in this conversation, crop (435,277,1367,830), lettering outside vehicle removed, cap-shell static annotations, optimized 640x380 WebP, 15,390 bytes. Blob ae08e6d5b5fe1fc83ec67ec3bd4f18589d93a1a1. Representative generated artwork, not exact model-year/trim proof. Final panel boundaries still need installer visual approval.
- calgary-downtown.webp: upper skyline/trees crop from the owner's IMG_2062.jpeg, faint header reference, 512x173 WebP, 8,970 bytes. Blob 667c3d4f00e4e5bd48372b3eb398a0c7ccba4063. No customer/vehicle identifiers in the crop.
- crv-neutral.webp: reused blob cf4200226767682fee0b96dd41aa441ef469c4eb.
- Tint sources copied from the prior owner-provided site source archive and byte hashes checked against the live repository at 3af4999ba909f19eee8a584548b17ad545c75b49. Existing blobs reused unchanged: side 5dc118ed5e866d183a48eb64d3dc791a580c88de; front-view 9b4dd36c2b489467d7a5cdf8f47e0e4db98eed42; mask-front a3420eda3c364a7fa1d3813b79d00e1435a72e68; mask-quarter a4496604c80f049ae6cd14f4bb3ed02f64e6e24c; mask-rear 0072d054eadee23b2566402b967e3d8af803a839; mask-visor 3104f75df07e1f68a5585451db93031bafbb5ca4; mask-windshield 6b9e9dce76b1d2f6701d5148462a63fcf103e295. These are separately labelled representative images, not members falsely inserted into the approved eight-car carousel.

No new generative mockup, private customer data, fonts or original private pricing workbook is part of the public commit.

## Remaining gates

Seven additional exact-body vehicle sets, active nearest-representative selection and the actual eight-car carousel are still pending. The helper preserves intended order but is not a completed matching renderer. Optional panel overlays stay replaced by close-ups until exact source-specific masks are approved. MAX matched gloss/satin/matte vehicle imagery remains pending.

Recovered reviewed-price records stay in private HQ. LOW/HIGH-to-film mapping, scoped approved-price integration, tax/extra-work treatment, production contact handoff and live customer analytics remain pending. No unsupported verified/guaranteed availability claim added. Existing public tariff inputs stay unchanged and are labelled estimates.

ChatGPT retains the independent sandbox. Elonos is requested for source/film mapping, remaining asset/hosted support; Zuckos for independent panel/window visual QA and data/price flow checks. Requests are not acknowledged completions. Production/main unchanged; PR remains draft.
