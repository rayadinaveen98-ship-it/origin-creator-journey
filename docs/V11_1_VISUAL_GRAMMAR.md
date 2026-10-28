# ORIGIN V11.1 — Reusable Cinematic Visual Grammar

**Status:** Experimental visual engine added only to `/v11/`; frozen V10 and V9 opening remain untouched.

## Purpose
V11 proved that Ray's 87 scene objects and a five-scene Kurosawa preview can be rendered by the same application. V11.1 addresses a major limitation: the original generic renderer repeated similar circles/frames over most of the life story.

## What is implemented
- **One visual director:** `www/v11/visual-director.js` selects a declarative composition from scene `visualTemplate` (optional), then existing `mode`/`kind` metadata.
- **Eleven reusable sets:** field/landscape, absence/negative space, studio lighting, print/drawing, camera composition, sound/rhythm, fictional film negative, archive materials, map/travel, ensemble silhouettes, and abstract light.
- **Original illustrative components:** layered CSS geometric art in `www/v11/visual-grammar.css`, including mobile-specific layouts and reduced-motion safeguards. No licensed footage or simulated historic photos.
- **Renderer-neutral:** identical composition rules for Ray and Kurosawa. A different creator may opt into a supported template using data alone; no new code or stylesheet per person.
- **Provenance:** each scene continues to display its existing visual provenance text, with a separate conspicuous illustration-technique label.
- **Scene variance:** mild deterministic angle/position changes prevent identical framing without injecting random historical information.
- **Still retained:** story text, archival context, source references, creator-specific resume, URL/deep-link navigation and progress keys.

## Safe content mapping
The order is explicit `visualTemplate` (if known) → mapped scene `mode` → mapped `kind` → generic abstract. Unsupported values fall back to abstract. All HTML for decorative layers is DOM-created from an internal whitelist; content cannot supply arbitrary HTML or image URLs. A photo is loaded only from the already-provided V11 scene `asset` URL and the original provenance drawer remains available.

**Important:** These are editorial visuals, not historically precise re-creations. A field illustration is not Ray's actual `Pather Panchali` camera frame. Sound shapes are not actual music notation. The fictional film negative represents no real stored archival object. No new footage/photos were licensed.

## QA
- Static content tests preserve V10 data parity and check that 92 scenes map to at least nine of eleven graphic templates.
- Chromium tests check scene-specific compositions for Ray Act IV field and Act VIII negative, second-creator reuse, mobile overflow, existing saved progress and source drawers.
- Review screenshots capture desktop landscape and phone-sized negative/Kurosawa views.
- Cloudflare deploy checks require the actual art director JS and CSS assets, never merely an index route with an SPA fallback.

## Remaining before replacing V10
- Bespoke, period-specific illustrations and Ray V10-like custom choreography; these generic original composition sets are a foundation, **not full pixel-level parity with V10**.
- More diverse artist voices using declarative typography/composition rules and a defined editorial style system.
- Historian review, photo-rights register, native-phone acceptance, accessibility testing, Creator Studio and secure publishing workflow.

## Next focused development
Try the live preview on phones and review 10 representative turning points (childhood, Santiniketan, first shooting, funding setback, first success, music, later films, illness, archive fire, restoration). Keep/revise the compositions that support emotion and replace those that do not. Then move visual configuration into the future Creator Studio.
