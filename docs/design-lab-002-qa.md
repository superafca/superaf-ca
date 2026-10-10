# Design Lab 002 — review build and QA evidence

Implementation: `public/design-lab/index.html`, `lab.css`, `lab.js`, `hero.svg`. The `/sandbox` route embeds this same review surface; direct review path is `/design-lab/index.html`.

Code commit checked: `c4694a0ad3e1370b9ed8f24a8b8c2948d881f961`.

## What is functional
- Manual Core / Valentine / Summer / Autumn / Christmas switching at the top of the page.
- Responsive homepage, service cards, studio section and expandable arrival directions.
- Local-only service selection dialog. No form submission, customer record, payment or email.
- Theme URL parameter and guarded storage/clipboard code. No calendar schedule has been enabled in this version.
- Dentologist appears only in arrival instructions. No claims of shared branding or ownership.
- Concept roadster is derived from an owner-provided generated studio reference and identified as a concept, not a completed customer installation.

## Executed checks
On 2026-10-09 at 03:12 UTC, Chromium via Python Playwright passed **50/50 focused assertions** on the standalone review document, and `node --check` passed for its JavaScript.

Assertions cover initial Core fallback, robots noindex, one H1, decoded final SVG/WebP asset, Dentologist mention placement; all five theme selections and pressed states; primary CTA contrast >= 4.5:1 in every theme; no horizontal overflow at 320, 390, 768 and 1440 px for every theme; all three service selections and explicit not-sent results; Escape and focus return; mobile dialog fit; arrival disclosure; reduced motion; absence of uncaught JavaScript errors or HTTP requests from the isolated review document; and usable fallback with unavailable browser storage.

These are **not** 50 distinct business workflows or a full app accessibility certification. Many assertions are the same check parameterized by theme or screen width.

## Exact source parity
Locally tested source was split into static HTML/CSS/JS for publication. GitHub blob SHAs were read back and matched the local bytes:

| File | Git blob SHA |
| --- | --- |
| index.html | 593d83dadcd0c4c2dd3275e2fdb2055c9d0ae6a0 |
| lab.css | 958675f59d8154ebce6f3df814574e4ab9789013 |
| lab.js | d558205ed3840b3405a6995f763dbb423eccc368 |
| hero.svg | 0c27ded764bf1d2413601c696e516239602e197b |

## Deployment evidence and remaining limits
Vercel reports success for code commit `c4694a0`, with deployment https://vercel.com/super-af/superaf-ca/7z1MeuQ9ibjwQfeVdEKugxydzLkk . The Vercel PR bot marks the branch preview Ready.

Direct review URL: https://superaf-ca-git-sandbox-site-rebuild-2026-10-08-super-af.vercel.app/design-lab/index.html

This execution environment could not resolve/open that external deployment. Its browser also blocks navigation to the local HTTP server. Local screenshots and interactions therefore used Playwright `set_content` with the actual document, styles, script and final SVG asset embedded. No navigation protections were disabled. The offline single-file HTML and screenshots were supplied to the owner in chat.

Still unverified: remote HTTP delivery of the static paths; iframe wrapper within the full application; native persistence across reloads; clipboard sharing; Safari/iOS; full repository typecheck/lint/test suite; production lead/email/analytics regression. No production database migrations or synthetic production submissions were performed.

Status: **READY FOR VISUAL CRITIQUE; NOT PRODUCTION-RELEASE READY**. PR remains draft; no merge or main-branch write.
