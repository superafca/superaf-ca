# SUPERAF.CA Rebuild Sandbox

Branch: `sandbox/site-rebuild-2026-10-08`

## Purpose
Experiment with a new SUPERAF.CA experience without changing the production `main` branch.

## Guardrails
- No production deployment, DNS changes, or merging without explicit approval.
- Preserve existing lead submission, conversion tracking, confirmation emails, SEO and accessibility until replacements are tested.
- Do not copy customer personal information into source control, issues, screenshots or test fixtures.
- Use synthetic test data only.
- Run typecheck, lint, tests and build before requesting QA.
- Document preview URL and known failures when a preview deployment becomes available.

## Initial workflow
1. Inventory current routes, design system, conversion funnel and integration points.
2. Build alternative layouts on this branch.
3. Validate responsive behavior, performance, accessibility, lead capture and analytics.
4. Request independent QA and compare to production before proposing merge.

Status: sandbox branch established; design and implementation not yet completed.
