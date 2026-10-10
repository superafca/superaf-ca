# Design Lab 005 — corrected review artifact and delivery gate

## Current status

The interactive 005 review is implemented and tested locally. It is NOT yet hosted in this repository: the working homepage still opens 004. PR #8 remains draft/unmerged. Production, commercial prices, existing customer commitments, live tracking and Elonos's independent version are unchanged.

The approved composition is light red/white/blue with owner-photographed downtown Calgary (no mountain imagery), prominent vehicle refinement, a large vehicle view and an itemized price panel. 005 uses the original-resolution 1672x941 neutral CR-V master and 2047x680 skyline crop. All PPF/tint/protection views share that master and lighting. The image dimensions were tested by actual browser decoding, not just metadata declarations.

## Corrections made in this continuation

1. A selected FRONT+ part previously received its normal request highlight plus a second close-up highlight. The detail layer now filters already-painted paths, preventing double-opacity on the same part.
2. MAX's summary now names eligible painted exterior panels and front/side/rear bodywork rather than reusing only the FRONT checklist.
3. A collapsed confirmed-vehicle summary retains the element ID used by its accessible label.
4. The coverage legend says Highlight instead of Red, so it remains accurate in seasonal skins.

No rates, source owner approvals or product inventory were changed.

## Tested output

Original standalone (normal authorized transfer source):
- bytes: 1120478
- SHA256: 26cc92fe9d0fb1add67bf5218de9699a712b6e31b2b33121817c96ce34f1f14c

Corrected standalone (the intended repository output):
- bytes: 1120738
- SHA256: 3f15b6912b846f1f7c666c2dff30e1f7ab923239b18e797d18e1f6bf64923e8b
- Git blob: 4b55c7aa2d2272dc072f738efcb9eebc3fc3f051

The two image payloads are unchanged; neither resolution nor compression was reduced to work around file transfer.

## Evidence run this cycle

- 42/42 Node model/privacy checks passed.
- 77/77 existing Chromium/Playwright checks passed against the corrected source/standalone, including 320/390/768/1024/1440px layouts and separate PPF, tint and windshield selections.
- 28/28 additional staging/cold-load/error/visual checks passed: input hash, protected destination, wrong branch/repository rejection, idempotence, no implicit commit, refusal to overwrite different work/symlinks, original image decoding, MAX scope, single-pass close-up mask, accessible summary, seasonal wording and missing-image behavior.
- The additional pass attached browser error/request listeners BEFORE first render. No startup script errors or external requests were seen. A deliberately corrupted master produced a clear unavailable-image state, removed floating fills/outlines and left price/service controls usable.
- PPF pixel containment: 48,863 changed inside declared masks, zero outside. Tint: 16,058 inside, zero outside. Channel threshold 4 and 1px edge tolerance at a 990x465 stage. This is geometric containment relative to our paths, not proof those paths match physical panels.

Browser method: isolated self-contained page rendered in memory; localhost navigation was unavailable. No browser/authentication protections were weakened. This is NOT evidence of hosted Vercel navigation, Safari/iOS or production form delivery.

The owner conversation contains actual corrected browser screenshots, the complete interactive file, updated source package and detailed JSON evidence.

## Bounded delivery — assigned in private HQ #30

Elonos execution / Zuckos independent QA. Obtain the original standalone through the private authorized handoff referenced in HQ. Do not change sharing permissions or embed signed transfer URLs in the repository.

After refreshing the current sandbox branch, from the repository root:

```sh
python3 tools/stage-estimator005.py /absolute/path/to/original-005.html
git diff --stat
git status --short
```

The helper verifies source and output checksums, repository and branch, and writes ONLY `public/design-lab/studio-005.html`. It does not commit, push, upload, activate tracking or switch homepage routing. Review that exact file, commit it to the existing sandbox without force-pushing, and obtain the actual deployment result. The complete file is self-contained; no separate asset URLs are required.

Do not redirect the working 004 entry until Zuckos has opened 005 with all images loaded and provided tested commit/browser/screenshots plus results. Keep each agent's independent visualizer separate. No acknowledgement or completion by either agent is assumed.

## Remaining visual/business work

Only the CR-V master is implemented; the eight buttons are model-refinement shortcuts, not eight finished renders or an autoplay carousel. Tint has matching bright glass and a side-glass close-up, but the dedicated true side-profile asset is still required. MAX remains an illustrative finish study, not physical finish photography. Panel/part suitability, other seven vehicle masters, reviewed LOW/HIGH film mapping, true verified-price eligibility, consent-aware private analytics and server-confirmed lead linkage remain open.

No deployment-success claim should be based on this documentation/helper commit alone. The failed one-time artifact transfer workflow was removed; the denied signed-URL route is not retried or bypassed.
