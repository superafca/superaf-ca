# Design Lab 005.3 — Canadian year-dependent vehicle selection

## Implemented

Year choices stop at 2000. Year -> make -> model -> optional trim are dependent menus with disabled downstream fields until their parent is selected. Changing year clears make/model/trim and the modified-exterior flag; changing make clears model/trim; changing model clears trim. Validation rejects stale or forged combinations at the model boundary, not just the UI. Unsubmitted vehicle edits do not change the current estimate; confirmed edits preserve tint settings and clear prior uncertain FRONT+ fitment requests.

Six official NRCan CSV releases contribute 18,260 unique source year/make/model records across 2000–2026. Grouping source variants into familiar model families produces 12,784 year/make/model menu rows. One separately documented announced 2027 Tucson Hybrid entry makes 12,785 menu rows across 62 distinct makes. These are model-year menu entries, NOT vehicles installed, universally complete retail lineups, trim approvals or price verifications. Source variant names and source IDs are retained. Grouping never invents years between endpoints.

2027 is labelled announced. Only the separately documented Tucson entry is currently in that year. Its Canadian trims and fitment are not inferred; it receives a ballpark rather than a current Tucson tariff.

Retail trim coverage is explicitly PARTIAL: exact Canadian OEM lists for 2026 Honda CR-V, 2026 Mazda MX-5 (soft-top/RF/package distinctions), and 2026 Toyota RAV4 HEV/PHEV provide 26 named choices across three model-year rows. No generic Standard body/Special body option is represented as a factory trim. Trims are not copied to another year/model. An aftermarket body-kit/modified-exterior checkbox is separate.

Missing trims allow Not sure / skip or typed trim. Missing makes/models have My vehicle is not listed. User-entered details remain unconfirmed and never create a verified-price badge. Missing heavy-duty/import records do not block estimates. Typed make/model/trim stay out of browsing diagnostics; the customer's explicit local saved breakdown can include their vehicle text. No live customer submissions or new network analytics.

## Canadian evidence and acquisition

Dataset: https://open.canada.ca/data/dataset/98f1a129-f628-4ce4-b24d-6f16bf24dd64 . Contains information licensed under the Open Government Licence – Canada: https://open.canada.ca/en/open-government-licence-canada . Attribution is included in the interface/data. Fuel-consumption model records are not a complete retail-trim, heavy-duty or import inventory; absence is not proof a vehicle was never sold in Canada.

OEM URLs/scoped trim lists: tools/build-vehicle-catalog.py. Raw data, source sizes/hashes and normalized variant provenance are in the owner source package under sources/nrcan. No US-only trim feed substituted; no manufacturer photography downloaded or republished.

Read-only public-source acquisition succeeded in Actions run 37989388963, commit 58a69d031e22da4e33ca61ac1d8e7463ad6f0403. Artifact 11644281588 contains original CSVs/JSON. The first two runs failed this job's own redirect-host check. Open Canada's actual public Azure storage host was explicitly accepted for the successful run. The completed one-time workflow was removed in ac2739bff2f1223b313cb8dd96fe05cf5a2594f8. No credentials sent to NRCan; final provenance does not retain expiring transfer URLs.

## Preserved

Accepted vehicle master, downtown Calgary asset, panel/window masks, price-data.js and price-engine.js are byte-identical to 005.2. Tint alignment/independent shades, benefit-first option lock, auto-inclusion, 2-front/5-rear defaults, MAX 10YR-only, $299 windshield protection and fixed FRONT inclusions are unchanged. No original owner price workbook, existing locked quote, production integration or Elonos parallel build changed.

## Actual tests

293 passed: 142 Node model/catalog/privacy assertions; 86 existing Chromium interaction/regression checks; 52 new selector/responsive/browser/source-integrity checks; 13 guarded delivery checks. Includes year floor, source-specific makes/models, OEM trims, stale resets, forged option rejection, manual/optional paths, no raw manual analytics, preserved tint, and no horizontal overflow at 320/390/768/1024/1440px. No uncaught startup/interaction errors or background HTTP requests in isolated browser runs.

Stage visual regression: zero changed pixels for PPF/tint/windshield at equal configuration/dimensions/common raster origin. The selector changes header height: comparison temporarily fixes ONLY the stage position during the image regression, preventing subpixel screenshot-origin artefacts. Owner screenshots are unmodified normal-page captures. Not physical fitment or installed-VLT certification.

Method: actual self-contained HTML in system Chromium with Playwright set_content. Hosted Vercel navigation, Safari/iOS, full application compilation and real lead delivery were not verified. Tests caught/fixed the new metadata row intercepting submit; current tests use normal clicks, not forced clicks.

## Exact delivery

Standalone: 2,419,811 bytes.
SHA256: 6679698809f2d1ef6c28d6d4faca5ecd54d8fcaafeafda5d62746a05ee1cba50
Git blob: eea73d516c970e4cb61006f18652585b588accd0
Public source JSON SHA256: 0f28168cbeec3767f494675ae030ba1f0bd9090578eb3628335a17d260783f4e

From the correct current sandbox checkout, use the existing authorized reviewed 005/005.1/005.2 HTML plus the native public-source workflow archive:

    python3 tools/stage-estimator0053.py /path/to/reviewed-estimator.html --catalog-source /path/to/SUPERAF-Canadian-Vehicle-Source-Review.zip

Alternatively pass the ready 005.3 HTML; no source argument is needed when its checksum matches. The helper accepts only reviewed inputs, checks source hash, and writes only public/design-lab/studio-005-3.html. It rejects another branch/repository, symlinks and divergent existing files. No downloads, commits, pushes, sharing/homepage/production writes. Compiler and helper were read back from GitHub; blob hashes match tested local files.

Review/commit ONLY the intended standalone. Obtain hosted QA before changing the working 004 homepage entry. These helper/compiler/docs commits do NOT mean the large standalone has been uploaded. No need for public Drive sharing, signed-link import workflows or a new owner file-transfer task.

## Remaining

Full year/model/body/powertrain-specific Canadian retail trim enrichment remains incomplete. Elonos execution support requested for an existing authorized Canadian feed or source-specific OEM evidence, with no new paid subscription/access change absent approval. Zuckos independent QA requested for year/trim associations, gas/hybrid distinctions, retired makes, optional fallback and deployed behavior. Missing data stays disclosed, never replaced by guesses. A catalogued trim does not approve service pricing or representative-image fitment.

Bounded hosted transfer remains private HQ #30, related #29. PR #8 remains draft/unmerged; production unchanged. No agent acknowledgement or hosted completion assumed. Agent Logs remain AI-team-only.
