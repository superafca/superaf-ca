# Design Lab 005.1 — owner review applied

## Owner acceptance and requested changes

The owner reviewed the corrected 005 artifact and approved the tint window alignment/shade appearance and windshield-protection view. PPF was accepted as passing with a slight remaining overlay mismatch. This is owner visual acceptance of this representative render, not verification of every vehicle/trim or measured installed VLT. Preserve these assets and masks; a replacement tint image is no longer a prerequisite for this accepted version.

Requested changes implemented in 005.1:
- Clicking a tint shade automatically includes tint in the estimate and updates the price. It no longer requires a separate Include checkbox click. Explicit removal is still possible; a later shade selection re-includes the service. Repeated selection does not duplicate any charge.
- Default counts are 2 front glass pieces and 5 rear glass pieces. Windshield defaults to None. Existing count controls remain editable; film/shade changes do not overwrite nonzero custom counts.
- Selecting a shade for an off front/rear group restores only that group to its default count. Selecting a windshield shade when None was selected includes full-windshield tint; an explicitly chosen visor remains a visor. Opening a service tab or comparing Original does not add a charge.
- The Extra tint zone label and Windshield / visor tab are now simply Windshield. None, Visor strip and Full windshield options remain available.
- Windshield-protection film is now CAD 299 per the owner's express instruction. This updates the protection rate, card, estimate, saved breakdown/handoff and pricing-version snapshot. It does not change windshield tint/visor prices or reprice existing locked commitments. The original equal-price clear/tinted protection catalog entries both use 299; the UI remains clear-protection only, with no new offering introduced.
- Hood, both front fenders, bumper and both mirror caps are fixed included coverage, displayed as noninteractive list items. Removed the per-panel isolation toggles; the complete FRONT base remains highlighted. FRONT+ optional extras remain interactive. Global Original/Inspect controls are retained.

## Source and visual integrity

The vehicle master, downtown Calgary asset and registered panel/window masks are byte-identical to the accepted 005 review. No image regeneration, recompression, resizing, new lighting or mask-coordinate changes occurred.

At identical viewport/configuration, actual browser stage screenshots compare pixel-identically between accepted 005 and 005.1: PPF 0 changed pixels; tint 0; windshield protection 0 (990 x 465 stage, zero-difference threshold). This preserves the owner's approved appearance; it does not certify physical-fitment accuracy.

## Fresh evidence

- 62/62 Node model/privacy assertions passed.
- 77/77 Chromium interaction/responsive checks passed, including 320/390/768/1024/1440px layouts, extras, upgrade/cancel, tint inventory, counts, arithmetic, focus, privacy and missing guaranteed-price claims.
- 51/51 additional owner-edit/visual-regression/staging/startup/image-failure checks passed.
- Mathematical containment remained PPF 48,863 changed pixels inside registered masks, zero outside; tint 16,058 inside, zero outside, using channel threshold 4 and 1px edge allowance. This is path containment, not physical panel verification.
- Cold-load listeners registered before first render: no uncaught script errors or remote submissions. Image failure removes floating masks while retaining correct pricing, including the new 299 protection amount.
- A test-harness await-parenthesis error was corrected before the final successful supplementary run; it was not an application defect.

Browser method: self-contained local artifact rendered in memory because localhost navigation was unavailable. No restrictions were disabled. Hosted Vercel navigation, Safari/iOS and production enquiry delivery are not verified by these tests.

Reproduce from the supplied source package:
`python3 build005.py`
`node --test tests/studio-005.test.mjs`
`python3 tests/browser005.py`
`python3 tests/review0051.py`
Python tests require Playwright, system Chromium, Pillow, NumPy and CairoSVG. The browser scripts use /usr/bin/chromium. The source package includes the original and corrected baseline HTML for exact visual/staging comparisons.

## Delivery — existing private HQ task #30

New tested standalone: 1,120,891 bytes.
SHA256: c0fcbcf6d5aabb337a400928fb6c4520b1e11b2644e2de0a0318c1075b31972e.

The committed helper `tools/stage-estimator0051.py` transforms either already supplied original 005 or corrected 005 into the identical 005.1 output. No new Drive upload or public sharing is needed. It also accepts the tested 005.1 artifact idempotently.

From the updated independent sandbox checkout:
`python3 tools/stage-estimator0051.py /absolute/path/to/reviewed-005.html`

It writes ONLY `public/design-lab/studio-005-1.html`. It checks known input/output hashes, exact replacement counts, repository, branch, symlinks and destination conflicts. No network, commit, push, homepage routing, production mutation or live analytics activation. Wrong input or different existing destination fails closed.

Elonos: import this new target instead of publishing the superseded 005 behavior; commit without force and provide the exact hosted commit/URL. Keep the parallel visualizer separate. Zuckos: verify the hosted 2/5 defaults, auto-inclusion, Windshield naming, separate 299 protection price, fixed base coverage and unchanged visuals. ACK/hosted proof still required.

This helper/documentation commit is NOT deployment of the 1.1MB visualizer. The hosted homepage still uses 004 until transfer and independent hosted checks succeed. Production remains unchanged. The owner's price change must also be synchronized through the site's controlled live-release process; this sandbox pass does not claim that happened.

Reviewed LOW/HIGH film mapping, expanded vehicle artwork and live consent-aware demand/enquiry linkage remain separate open items. No private pricing workbook, customer identity fields, invoices or email bodies were copied. Agent Logs remain AI-team only.
