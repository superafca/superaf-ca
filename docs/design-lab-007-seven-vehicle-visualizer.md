# Design Lab 007 — seven vehicles inside the service visualizer

## Owner direction implemented

Remove CX-5 from the visual garage, keep its pricing and Canadian catalog records. Seven active examples: F-150, CR-V, refreshed-style Model Y, RAV4, Tahoe, 2026-reference Tucson Hybrid, MX-5. Do not refill the eighth slot. Future popular vehicles can be added later.

The delivered 007 artifact adds a seven-thumbnail selector directly above the main service image. Each example now routes to its own PPF, tint and clear windshield-protection rendering. The bottom garage's manual selection and Open Coverage Studio button connect to the corresponding service view. Automatic photo browsing remains separate from the actual quote, price and demand log.

Six new mask sets were authored against the exact 1672x941 source images. The existing approved bright CR-V service master and its mask object are retained unchanged instead of replacing them with the different garage CR-V photo. No new photo generation, resizing of source assets or stretched CR-V masks.

FRONT fixed inclusions remain hood, both fenders, bumper and mirror caps. FRONT+ has locally registered visible previews plus positioned callouts/close-ups for hidden or uncertain extras. Opening a detail does not select or charge. New geometry is a review preview, not a manufacturer cut file or installer approval.

Cosmetic/Solar Protection family locking, independent shades, auto tint inclusion, 2-front/5-rear defaults, 10YR-only MAX and $299 clear windshield protection are preserved. The darker new sources use a glass-clipped clear reference before shade preview; View Original restores the unchanged photograph. This is illustrative, not measured VLT. MAX finish treatment remains illustrative rather than installed-film photography.

## Explicit remaining visual exception

The accepted MX-5 photograph is top-down with its side windows lowered. Its PPF, MAX and windshield tint/protection views work. Side shades remain selected/priced and are summarized in a callout, but no fake raised glass is drawn over open air. A matching raised-side-glass reference is still required for photographic side tint. Do not mark this asset gap complete.

## Actual evidence

327 passed checks: 181 Node model/catalog/registry tests; 108 Chromium interactions; 17 screenshot comparisons; 9 real-timing/theme checks; 12 staging-safety checks. All results and test sources are in the review package.

The browser checks cover all seven service routes, quote/log isolation, actual vehicle matching, fixed base parts, optional mask/detail behavior, repeated front/rear shades, family confirmation/cancel, $299 windshield, 10YR MAX, keyboard navigation, five skins, 320/390/768/1024/1440px layouts, image failure and retry. No uncaught browser errors or external HTTP requests were observed in the isolated review run.

At a common review-frame size and matched settings, the original CR-V PPF/tint/windshield pixels were identical to 006. Front/rear shade changes stayed inside their registered glass masks (RGB threshold 6, 3px antialias allowance); lowered MX-5 side glass correctly changed zero pixels. This tests containment against authored masks, not independent physical alignment.

## Reproducible delivery

Standalone: SUPERAF-Estimator-007.html
Bytes: 5,215,393
SHA256: be0008443407734aa468a1bade44ef07f04e5926eb55a85413d62e11a328cbe8

Source ZIP includes modular source, exact active WebPs, preserved inputs, trace-data.json, build007.py, tests, screenshots and evidence. Run python3 build007.py to rebuild. tools/stage-estimator007.py stages only the checked HTML or exact HTML member from its source ZIP into public/design-lab/studio-007.html on sandbox/site-rebuild-2026-10-08. It does no network, commit, push or route changes and refuses wrong branches/repos, symlinks, differing existing files and checksum mismatches.

This documentation/helper commit is not hosted publication of the 5MB artifact. Transfer and independent hosted observation are still pending. Preserve working 004 entry until the new page is deployed and checked. No main merge, production route/pricing change, live analytics, customer submissions or edits to locked customer quotes. No private reviewed-price workbook copied here. LOW/HIGH mapping remains separate and unresolved. Safari/iOS and full-repository integration tests are not claimed.

Elonos: authenticated artifact transfer and separate matching raised-window MX-5 asset assistance requested in HQ. Zuckos: independent new panel/glass geometry and hosted interaction QA requested. Receipt is not assumed. Agent Logs remain AI-team only.
