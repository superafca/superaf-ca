# Design Lab 006 — eight-photo visual garage

## Owner correction and accepted roster

Keep the newly supplied eight generated Calgary-background vehicle images. The owner explicitly identifies the Tucson as the 2026 body reference and approves retaining the extra CX-5. Order: Ford F-150, Honda CR-V, Tesla Model Y, Toyota RAV4, Chevrolet Tahoe, Hyundai Tucson Hybrid (2026 reference), Mazda CX-5, Mazda MX-5. Model 3 and Cybertruck are not in the visual garage. The wider vehicle/price catalogue remains unchanged.

## Implemented in the delivered review artifact

- Eight full-size photo references and separate navigation thumbnails. Full WebPs retain original 1672 x 941 dimensions; original PNGs and SHA/provenance manifest are preserved in the source package.
- Previous/next, keyboard arrows/Home/End, native-size inspection, pause/play, reduced-motion behavior and image error/retry states.
- Automatic rotation every 6.5 seconds only when visible and untouched. Deliberate interaction stops it until explicit Play. Offscreen, focus/hover and modal states pause it as applicable.
- Model-family matching and explicit known-body reference routing. Generic/unsupported bodies are not called exact or closest matches. A 2027 Tucson selection is explicitly distinguished from the 2026 image.
- Gallery browsing and autoplay never replace the quoted identity, change an estimate, clear tint selections or record vehicle demand. Estimate this model prepares the vehicle fields; explicit form confirmation is still required.
- Light red/white/blue interface, all five skins, responsive desktop/mobile garage. No new page-wide dark theme or mountain scenery.

## Crucial readiness boundary

This is the photo garage interaction layer, NOT completed PPF/tint/windshield rendering for all eight bodies. Each new photo has photo=ready, ppf/tint/windshield=not-registered. Its own checked masks still need to be authored. The accepted interactive CR-V service studio remains separate; CR-V masks are not stretched over other vehicles. Generated photographs are visual references, not exact-year/trim fitment diagrams or independent OEM approval.

The existing PPF/tint/windshield canvas is pixel-identical to 005.3 at matching settings. MAX remains 10YR-only. Cosmetic/Solar Protection family locking, independent shades, automatic tint inclusion, 2-front/5-rear defaults and $299 windshield protection remain. The 2000+ dependent Canadian selector is preserved. No new 2027 model/trim rows or price-verification badges were created in this pass.

## Actual evidence

222 checks passed: 164 Node model/catalog/garage assertions; 37 focused Chromium functional/visual checks; 9 real-timing/theme checks; 12 staging safety checks. Tests checked all eight native decoded dimensions, quote/analytics isolation, matching, form handoff, inspector/focus, keyboard wrapping, loading failures, tint preservation, $299 glass, widths 320/390/768/1024/1440, reduced motion and three pixel-identical studio comparisons. No uncaught browser errors or external requests were observed during the isolated in-memory browser run.

This does not certify new panel masks, installed VLT, physical finishes, Safari/iOS, full-repository build or hosted operation. Test source, actual screenshots, machine-readable evidence and original assets are in the owner conversation's source package.

## Reproducibility and bounded delivery

Standalone: SUPERAF-Estimator-006.html
Bytes: 5,589,995
SHA256: 71a99ecf9f4fd741fad8131d224f58edbb7b139ea708936e6d651b80be3f4762
Source package: SUPERAF-Estimator-006-Source.zip
ZIP bytes: 26,163,210
ZIP SHA256: d20681d3be852d34a56b18726867251d73dc8ebd9ed9362242f0eb70ab7098c6

Run `python3 build006.py` in the source package. Node checks: `node --test tests/studio-005.test.mjs tests/vehicle-selector-ca.test.mjs tests/garage-006.test.mjs`. Browser checks: `python3 tests/browser006.py` and `python3 tests/browser006-timing.py`, requiring Playwright/Pillow and /usr/bin/chromium or an adjusted test-only executable path. Staging checks: `python3 tests/stage006.py`.

The checksum-guarded `tools/stage-estimator006.py` accepts the reviewed HTML or ZIP. From the existing sandbox checkout, run `python3 tools/stage-estimator006.py /absolute/path/to/SUPERAF-Estimator-006-Source.zip`. It stages only public/design-lab/studio-006.html, refuses wrong branch/repository, symlinks, altered inputs or divergent destination content, and does no network, commit, push or route changes. Review and normally commit that one file; no force push. A helper/documentation commit is NOT publication of the visual artifact.

Direct local GitHub transport was attempted and failed DNS (Could not resolve host: github.com). Authenticated connector reads/text writes work. Normal large-file upload is routed to Elonos in private HQ #30, followed by independent hosted QA from Zuckos. No acknowledgement assumed. Existing working 004 homepage entry remains until a new hosted target is observed. No new import workflow, public file sharing, security bypass, production change or alteration to Elonos's independent branch.

Private owner-price data, customer identities, invoice text and credentials are not in this package or public PR. Agent Logs remain AI-team only. No live analytics, messages, bookings or payments are sent.
