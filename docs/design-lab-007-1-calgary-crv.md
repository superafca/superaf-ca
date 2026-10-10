# Design Lab 007.1 — Calgary CR-V correction

The owner approved 007 except for two remaining visual changes: the CR-V must match the other vehicles' Calgary setting, and MX-5 needs a roof-up/raised-side-window image for tint. This revision completes the CR-V part; it does not claim the second task is finished.

## Implemented and tested

The CR-V service visualizer now uses the same original 1672 x 941 downtown-Calgary image as its garage card. Native-coordinate hood, fender, bumper, mirror-cap, optional-part, windshield/visor and separate side-glass masks were registered to that exact image. The old white-background source is no longer embedded or loaded. CR-V now uses the same source-decoding, failure, retry and viewBox handling as the other vehicles.

The surrounding approved light red/white/blue layout and five seasonal skins are unchanged. The six other photographs and their traces are unchanged. Existing price data, price engine, vehicle catalog, business model, Cosmetic/Solar Protection locking, independent shade state, editable 2-front/5-rear defaults, 10YR-only MAX and $299 windshield protection remain unchanged. Browsing still cannot replace the quoted vehicle or change price/demand events.

Actual checks: 181 Node model/catalog/registry tests, 108 Chromium interaction/layout checks, 32 screenshot comparisons/containment checks and 25 asset/patch/failure checks passed (346 total). The six other vehicles' PPF/tint/windshield frames were pixel-identical to 007 at matching settings. New CR-V front/rear shade changes stayed inside the registered glass under RGB threshold 6 and 3px antialias allowance. Native image decoding and failed-source/retry behavior were actually tested. Code and screenshot checks do not independently certify physical fitment, installed VLT, Safari/iOS or hosted behavior.

## MX-5: explicit remaining blocker

The native generation attempts returned unrelated full website mockups rather than a usable standalone roof-up MX-5. They were rejected: no page redesign, invented prices, XPEL/ceramic-coating claims or low-resolution car thumbnails from those images were imported. The accepted top-down MX-5 remains with the honest lowered-side-glass note. Photographic MX-5 side tint is still not complete.

Elonos asset assistance requested: use public/design-lab/assets-006/mx5.webp from the existing private 007 handoff as the visual reference. Produce only the same white roadster with a black fabric roof closed and both side windows raised. Preserve the camera direction, wheels, lighting and downtown Calgary setting. No mountains, interface, labels, price text, coverage highlights or baked-in dark tint. Need light readable glass and a full-size original, not a crop of a UI render. Keep the accepted top-down PPF/garage variant separate. Any new image requires independently authored and reviewed glass masks; do not reuse old geometry without alignment checks.

Zuckos: independent CR-V panel/glass inspection and eventual roof-up MX-5/hosted QA requested in HQ #30. Requests are not acknowledged completions.

## Exact bounded delivery

Standalone: SUPERAF-Estimator-007.1.html
Bytes: 5,077,130
SHA256: 3775b9c6361be9b1d07937290f50b790498bb21d760c2a71204b3d0c26d057ae

The owner conversation has the interactive Browser ZIP (index.html), source/test ZIP, actual Chromium screenshot and QA JSON. Source rebuild: python3 build0071.py. README describes test commands and known limitations.

Committed helper tools/stage-estimator0071.py at dcb5e139a802acea6d8d1825fa545623b9a564e2 reconstructs this exact output from the already authorized 007 HTML/source ZIP, or accepts the exact 007.1 artifact. Its read-back Git blob matches tested local bytes: 7aad6a4481270864174548f18df504ec7febaea8.

Run from the authorized sandbox checkout root:
python3 tools/stage-estimator0071.py /absolute/path/to/existing-007.html

The helper stages only public/design-lab/studio-007-1.html, performs no network/commit/push and refuses wrong repository/branch, corrupted inputs, symlinks or divergent targets. No new Drive upload or sharing-permission change is needed. Existing private 007 transfer plus this small patch is sufficient.

This helper/documentation commit is NOT hosted publication of the 5MB review file. Keep existing hosted entry until the new target is deployed and observed. Production, lead delivery, live analytics and locked quotes are untouched; PR #8 remains draft/unmerged. Recovered LOW/HIGH pricing mapping is unchanged and unresolved. Agent Logs remain AI-team only.
