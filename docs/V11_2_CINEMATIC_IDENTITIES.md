# ORIGIN V11.2 — Individual Cinematic Identity

## Goal
The same cinematic player should feel different for distinct creators without source-code branches keyed to people's names. V11.2 introduces **creator-authored visual identity data**: display typography, art direction, lighting palette, composition, and transition rhythm.

## Implemented
- `www/v11/identity.js` validates identity token values and applies them to both the catalogue tiles and story stage, with a shared implementation for any future person.
- `www/v11/identities.css` supports literary / graphic / neutral typography, observational / angular / balanced compositions, and dissolve / cut / steady transitions.
- A creator's `identity` field specifies **validated colors and enumerated variants**, not arbitrary CSS, code, or HTML.
- Satyajit Ray's visual treatment is editorial/observational: serif storytelling type, warm paper/light tones, slow dissolves and restrained chapter details.
- Akira Kurosawa's *five-scene technical preview* uses a graphic/kinetic treatment: bold sans-serif headers, angled cards, stronger contrasts, and faster cuts. This is an *editorial design interpretation*, not a claim to reproduce the director's exact visual language.
- Scene-specific visual sets from V11.1 continue functioning unchanged for both creators, preserving original non-film-frame artwork and source/provenance warnings.
- Existing Ray scene content, all 87 original citations and V10 stored keys are preserved.

## Data contract
```js
identity: {
  accent:'#e1b981',
  glow:'#826b4e',
  shadow:'#0d1b1a',
  paper:'#f8ebd9',
  typography:'literary',  // literary | graphic | neutral
  composition:'observational', // observational | angular | balanced
  motion:'dissolve', // dissolve | cut | steady
  signature:'AN OBSERVATIONAL LIFE IN CINEMA'
}
```

All colors must be six-digit hex values; the signature allows a short safe uppercase text label. CSS is supplied solely by the fixed application stylesheets. This is intentionally a **small design system**, not an unbounded user stylesheet or a claim that every director can be represented by three sliders.

## Quality
- `scripts/verify-v10.mjs` protects V10 and its opening.
- `scripts/verify-v11.mjs` checks all 87 Ray scenes/source objects against V10, identity validation, a hypothetical third creator profile, reduced motion and distinct style tokens.
- `tests/v11-browser.mjs` covers 1440px desktop, 390px phone and 320px narrow phone, different title fonts, creator style tokens, browser history, sources, visual scenes and the `prefers-reduced-motion` behavior.
- Cloudflare deployment checks for the real deployed JS/CSS assets as well as the existing 8-act story assets.

## Limitations / what is next
This is a genuine, declarative identity layer, but not a full artist-specific visual biography or V10 pixel-perfect parity. We still need individual period-sensitive layouts, more historically relevant cleared archival images, editorial review, physical Android evaluation, and the authoring tool. The Kurosawa preview remains only five scenes. Do not quietly promote the experimental V11 page over the established V10 homepage or package an APK as though it were final.
