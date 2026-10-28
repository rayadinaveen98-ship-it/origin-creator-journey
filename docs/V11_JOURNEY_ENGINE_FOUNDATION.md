# ORIGIN V11 — Universal Journey Engine (foundation)

## Status (2026-10-28)
**Working developer preview, not a V10 replacement or a complete multi-creator production platform.** The stable Ray V10 viewer and existing welcome animation are unchanged. The experimental app lives separately at `/v11/`.

The initial architectural test uses:
- **Satyajit Ray:** 8 acts, **87 scenes**, extracted **losslessly** from V10's per-act scene objects and archival source indexes. V11 is not yet a pixel-accurate migration of all V10 bespoke artwork and craft exercises.
- **Akira Kurosawa:** a small, **5-scene, source-grounded preview**, rendered using exactly the same runtime and scene schema. This is not a full life journey or a cleared archival production.

## Why V11 exists
V10 has a different HTML/controller/stylesheet per Ray act. V11 moves historical content to standalone content modules, with one registry, one page, one renderer, one progress system, and one context/chapters UI. A third creator needs content files but no customized player code.

## Reusable content format

A creator profile (metadata only):

```js
window.ORIGIN_V11.registerCreator({
  id: 'creator-slug', name: 'Display name',
  subtitle: 'One-line hook', role: 'Creator role',
  years: 'Years / preview scope', culture: 'Place',
  preview: true, accent: '#c9a17d',
  description: 'Editorial status'
});
```

A journey act (editorial data only):

```js
window.ORIGIN_V11.registerAct({
  creatorId: 'creator-slug', index: 1,
  name: 'Chapter name', period: 'Years',
  archive: [{label: 'Source name', url: 'https://...'}],
  scenes: [{
    year: '1943', place: 'PLACE', name: 'Event',
    title: 'Safe <em>emphasis</em> only',
    lead: 'Documented moment', more: 'Story context',
    meaning: 'Editorial interpretation',
    history: 'Fact and source limitation',
    visual: 'Graphic provenance and limitations',
    prompt: 'Visual beat', mode: 'first',
    kind: 'frame', bg: 'radial-gradient(...)',
    sources: [0], observe: false
  }]
});
```

The registry checks creator and chapter identities, required scene fields, archive URLs, and source-index bounds. The reader escapes untrusted HTML (allowing only `<em>` and `<br>` title formatting), prevents unsafe source protocols, and supports chapters, sources, responsive scenes, optional observation exercises and scene-by-scene progress.

## User-visible behavior
- `/v11/`: a two-creator cinematic discovery catalogue.
- `/v11/?person=ray`: full 87-moment Ray narrative in the new shared renderer.
- `/v11/?person=kurosawa`: five-moment preview in the **same** renderer.
- `/v11/?person=ray#act=4&scene=2`: deep link to a specific scene (act and scene use 1-based/0-based indices).
- Saves per-person V11 progress to localStorage.
- The first Ray visit reads existing V10 act-progress keys without modifying them.
- Chapter navigator spans all acts and moments, with next/previous continuity and browser Back support.
- Source drawer distinguishes historical facts, interpretation and visual provenance.
- Navigation honors reduced-motion preferences.

## What is deliberately **not** done
- V10's bespoke chapter-specific visual artwork, custom framing interactions, precise typographic identity and full animated compositions are **not** migrated into shared V11 templates yet. The V11 visualization is a separate original generic art library. **Do not replace V10 with V11 as the polished canonical journey until visual parity is achieved.**
- No real archival footage, studio-owned stills, voiceover, or rights-restricted imagery has been added. Previously linked external Ray images and their caveats are retained; public licensing must still be reviewed.
- There is no authoring CMS, bulk ingestion, image rights register, review queue, accounts, server storage, publishing pipeline or generated APK for V11.
- Kurosawa’s material is five selectively chosen moments, not a claim to represent his complete life or the final curated narrative.
- Separate human research, archival rights, mobile-device testing, historian/editorial review, and accessibility acceptance are required.

## Quality gates
- `node scripts/verify-v10.mjs`: frozen releases and unchanged welcome.
- `node scripts/verify-v11.mjs`: schema, complete Ray migration with original scene objects and archive index data unchanged, no missing 87 moments, source links.
- `node tests/v11-browser.mjs`: Chromium desktop/mobile, full map, chapters, context, resume, URL/back, second creator, V10 progress import, overflow and smoke screenshots.
- `.github/workflows/origin-v11-engine.yml` executes these automatically in GitHub Actions.

## Next development slices
1. Resolve all QA failures and confirm /v11/ live assets from Cloudflare.
2. Build a compositional adapter library that can reproduce V10 visual modes and optional observations from declarative content, starting with Acts I and IV.
3. Introduce explicit story-beat pacing and scene archetypes (arrival, conflict, breakthrough, reflection, legacy) and compare visual parity in mobile screenshots.
4. Build a content linter/asset rights manifest and editorial workflow for a small second full journey.
5. Only after parity and device tests, decide whether to migrate the public homepage and package V11 on Android.
