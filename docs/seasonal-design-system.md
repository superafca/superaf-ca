# SUPERAF — Future Nostalgia Design System (Sandbox)

Status: design direction proposed; not approved for production.

## Permanent identity
- Creative automotive studio, futuristic precision meets retro Americana and tactile shop craft.
- Avoid heavy black and generic local wrap-shop styling.
- Base palette: porcelain #F6F4EE, electric blue #1254A1, safety orange #F47721, champagne gold #D7AB55, graphite #25282D.
- Typography: bold condensed display, clean accessible body; use licensed or open-source fonts.
- Photographic approach: real shop/car work + controlled white cyclorama, editorial compositions, no fabricated customer testimonials.
- Motifs: orange packaging, retro blue plate, gold frames, clouds, polished material, technical UI microdetails.

## Theme architecture
Use semantic CSS variables, never hard-code seasonal color values in individual components.
Theme IDs: default, spring, summer, autumn, winter; optional campaign overrides.
Store theme setting centrally; default is always available; allow manual selection and automatic date-based selection with an explicit override.
Never let seasonal visuals alter services, prices, legal copy, booking logic, analytics or conversion tracking.
Respect reduced-motion settings; keep WCAG contrast, accessible focus, keyboard navigation, mobile performance.

## Seasonal treatments
- Default: porcelain + electric blue, orange CTA, restrained gold accents.
- Spring: soft sky and fresh pale-green environmental hints; keep core orange CTA.
- Summer: brighter blue, sunlit white, energetic photography.
- Autumn: copper/orange, warm cream, tactile packaging texture.
- Winter: icy porcelain, cool blue, subtle metallic silver and atmospheric clouds.

## Proposed homepage
1. Distinctive editorial hero with real automotive photography and short positioning.
2. Services: PPF, tint, vinyl and relevant offerings only after inventory verification.
3. Product/material story using actual orange SUPER A.F. CORPORATION packaging.
4. Selected real project gallery with permissions checked.
5. Quote/consultation conversion funnel; preserve existing lead handling.
6. Trust details, service area and contact.

## Reference usage
User-supplied photos and generated concepts are visual direction only; review any customer identifiers, license plates, trademarks and rights before publishing. Do not commit raw uploads or sensitive metadata without review.

## QA gates
Contrast, keyboard, reduced motion, responsive, performance, SEO, real lead-flow regression, synthetic test data, independent QA and explicit approval before production deployment.
