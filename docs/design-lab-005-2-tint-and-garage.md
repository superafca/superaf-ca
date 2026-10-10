# Design Lab 005.2 — tint option lock, MAX 10YR, garage correction

## Implemented and tested in the standalone review

MAX now offers only 10YR. Selecting MAX applies 10YR and its existing rate immediately; Gloss, Satin and Matte remain available without a further film-upgrade prompt. 5YR/MAX is rejected at both the configuration and lower-level arithmetic boundaries, including deep links. FRONT and FRONT+ retain 5YR/10YR and restore their prior film selection after browsing MAX. The exported MAX summary now correctly describes eligible painted exterior coverage, not only the FRONT panels.

The tint bug was a product-selection bug: clicking a chip from the other material row implicitly changed the product for the whole vehicle and cleared front/rear/windshield shades. It was not a changed window mask.

There is now a separate, benefit-first option control: **Cosmetic (Carbon)** or **Solar Protection (Ceramic)**. Cosmetic retains the previous default. Only the selected product's shade row is enabled. Native disabled controls and a model-level check prevent a shade tap from changing products. Front, rear and windshield choices remain independent.

An explicit product switch after choosing shades opens a confirmation with the subtotal change. Each product remembers its own exact shades for switching back. No approximate VLT substitutions. Material identifiers remain unchanged internally; benefit labels appear in quote lines and exports. The purpose labels are naming/copy, not numerical performance claims or a product certification.

Shade clicks still auto-include tint exactly once. Editable defaults remain two front and five rear glass pieces; Windshield initially None. Windshield protection remains separately priced at CAD 299. The vehicle master, Calgary backdrop, masks and pricing-data file are byte-identical to 005.1.

## Visual garage scope

New remaining order: Ford F-150, Honda CR-V, refreshed Tesla Model Y, Toyota RAV4, Chevrolet Tahoe, **2027 Hyundai Tucson Hybrid**, Mazda MX-5. Model 3 is removed from the visual garage only, not from the quote catalog or recovered price evidence. Seven named targets remain; no eighth replacement was invented.

Only the accepted CR-V renderer exists in this artifact. Model Y is explicitly tagged refreshed/body-art pending; Tucson is explicitly labelled 2027 Hybrid/coming/art pending. Shortcuts prepare the relevant year/make/model fields without silently changing the quote. These metadata changes do not constitute delivery of six more renders or exact-year fitment approval.

Official reference locks checked 2026-10-09:
- Tesla Canada: https://www.tesla.com/en_ca/modely
- Tesla redesign reference: https://www.tesla.com/learn/introducing-new-model-y — lower nose and full-width three-piece front lightbar. Use the refreshed body, not the older round-nose car. Confirm selected Canadian trim before asset/mask approval; do not universally reuse a Performance/other fascia.
- Hyundai Canada: https://www.hyundaicanada.com/en/coming-soon/tucson — next-generation Tucson arriving in Canada in 2027, hybrid option, international imagery with Canadian-spec caveat.
- Official Hyundai reveal: https://www.hyundaimotorgroup.com/en/news/hyundai-motor-unveils-the-all-new-tucson-its-boldest-suv — October 1, 2026 unveiling; North American rollout in 2027. There are now official reveal references, but that is not Canadian retail availability or final trim/installation approval.

Use these references for the next master/mask pass. Never relabel 2026 Tucson artwork as 2027 Hybrid or stretch the CR-V masks onto a different model. New renders must match the approved bright lighting, resolution and Core/seasonal treatment. No new image generation was done in this bug-fix pass.

## Actual evidence

- 73/73 Node tests, including two exhaustive tests spanning 280 within-product front/rear/windshield shade combinations.
- 86/86 Chromium browser checks on the actual self-contained page: repeated front/rear shade clicks, disabled row guarding, explicit product-switch cancel/restore, defaults, totals, exports, MAX and mode deep links, all five themes, 320/390/768/1024/1440 widths. No startup exceptions or remote requests observed.
- 15/15 delivery and unchanged-source checks: original/ready 005 and 005.1 inputs transform to identical 005.2 output; repeat staging, wrong branch/repository rejection, symlink rejection, divergent-destination preservation, and byte-identical accepted assets/catalog.
- Equal-setting stage screenshots versus accepted 005.1: PPF 0 changed pixels; tint 0; windshield 0, each 990 x 465, zero-difference tolerance.

These 174 passing tests do not certify every vehicle's installation geometry, installed VLT, physical finish, hosted wrapper or Safari/iOS behavior. Full source, tests, screenshots and evidence JSON are supplied in the owner conversation.

## Delivery and boundaries

Helper commit: `4f4bb840b5808e0c422635e1338a796e009ae25b`; `tools/stage-estimator0052.py` was read back and its Git blob matches the tested local file (`d252f88410674c1380fc311a94524efc9f1725f9`).

In the independent sandbox checkout, run:
`python3 tools/stage-estimator0052.py /absolute/path/to/reviewed-005.html`

This supports original 005, corrected 005, 005.1 or 005.2, using the existing earlier helper where needed. Output: `public/design-lab/studio-005-2.html`, 1,128,019 bytes, SHA256 `5f696ac6855a81ba1d9da17e264b828156a7b9218568430938eb072adf01abfc`, Git blob `586d166dd0bbd3a28de9fc29f6f6102abc3728bd`.

The helper does no network, sharing change, commit/push or routing change and preserves concurrent work. It contains compressed JSON text edits, not executable downloaded content; image bytes are untouched.

**Hosted upload/QA still pending in private HQ #30. The helper/documentation commit is not a deployed visualizer.** Keep the working 004 homepage entry until the new file is hosted and observed. Production, customer price locks, private reviewed-price registry, live analytics and Elonos's parallel creative branch remain unchanged. No new Drive upload or permissions workaround was used.
