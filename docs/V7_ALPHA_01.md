# ORIGIN V7 Alpha 01 — Journey × Studio

Status: feature branch only until QA. **Do not replace** the original V6 home or Story-First 1.6.

## Scope implemented

- A standalone responsive entry at `/v7/`, with original cinematic symbolic art and separate Journey, Studio and Notebook views.
- Chapter map for the verified 1955–1959 Story-First 1.6 journey; click **Enter Ray's journey** to load the **existing complete** Story-First app as an embedded same-origin experience.
- **Composition** study with adjustable distance and contextual interpretation linked to themes in `Apur Sansar`.
- **Atmosphere** study with adjustable light and contextual interpretation linked to `Jalsaghar`.
- Access to the frozen V6 interactive experience from Studio, without changing its contents.
- Browser-only reflections: save, review, delete (with confirmation), reload, export as JSON.
- Limited in-tab progression hints when the Story-First document exposes visible chapter markers. **The original story's internal scene position is not restored after a full page refresh.** The iframe remains mounted while switching V7 views in the same tab.
- Mobile-responsive layout, visible keyboard focus, keyboard dismissal of embedded-viewer overlay, reduced-motion support.

## What V7 Alpha 01 is NOT yet

- Not a rewrite of the original Story-First or V6 scripts into unified reusable components.
- Not a new chapter, full feature-complete V7 release, production-ready Android build, account sync or multi-device progress system.
- No assertion that original lab art reproduces Ray's actual film frames or historical lighting diagrams.

## Regression checks

`node scripts/verify-v7-alpha.mjs` validates frozen V6 SHA-256, original story content markers, new app presence, app JavaScript syntax and offline-source assertions.

`node tests/v7-browser.mjs` uses Playwright to exercise desktop and 390px mobile navigation, composition and lighting controls, local notebook persistence and JSON export, Story-First and V6 same-origin overlays, screenshot capture and horizontal-overflow check.

The CI workflow `.github/workflows/origin-v7-alpha.yml` runs both checks on `feature/v7-unified-journey-alpha`. It does **not** deploy to Cloudflare or alter `www/index.html` / `www/story-first/index.html`.

## Deployment plan

Once tests pass, merge this **additive** feature branch to `main`. Existing Cloudflare deployment workflow watches `www/**`, and will publish `/v7/` independently alongside `/` (V6) and `/story-first/` (Story-First 1.6). Do not point the homepage at V7 until it passes creator review.

## Next acceptance milestones

1. Manual creator walkthrough: the Ray journey feels coherent when transitioning from story to a craft choice.
2. Restore a meaningful Story-First scene position after full reload via explicit integration with the Story-First engine (not DOM guessing).
3. Deep linking from specific story choices to specific studio labs and back.
4. Accessibility QA with screen reader, physical mobile checks, better focus management, performance budget, Android packaging strategy.
