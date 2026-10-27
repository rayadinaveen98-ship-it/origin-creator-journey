# ORIGIN V10 — Living Journey Pilot

## User goal and decisions
Keep V9 welcome animation **identical**. Make creator discovery feel like a real platform without filling the catalogue with images of Ray. Make Satyajit Ray's life feel like a chronological, visually directed story rather than a data reader with captions and cards.

## What is implemented
- **/v10/**: V9's existing ORIGIN particle-based opening and streaming-style homepage preserved; the three repetitive Ray biography tiles are replaced with four visually distinct, original **Coming Soon** type-based posters for Akira Kurosawa, Ritwik Ghatak, Agnès Varda and Stanley Kubrick.
- **/v10/journey/**: New immersive **Act I · The Boy**, eight connected scenes spanning 1921 through the threshold of 1940, with diverse symbolic and actual archival-image staging, large storytelling typography, understated progress, minimalist controls, chapter map and on-demand historically sourced context.
- The same existing V9 full-screen entry transition now enters the new Act I rather than the V8 document reader.
- Reader remembers exact local scene under `origin_v10_act1_scene_v1`; the new homepage Continue Journey shelf uses the same key. Old V8 progress remains untouched.
- Scenes 1 and 3–4 use original symbolic graphics instead of pretending to depict undocumented personal events. Ray's parents' portrait is explicitly dated 1914, his childhood portrait approximately 1930, his early-adult portrait approximately 1940–1943.
- End of Act I clearly links to the existing `/life/#moment-6` reader for the historical coverage following childhood. It never pretends V10 later-life acts are complete.
- Existing Story-First, V7 Studio, V8 biography and V9 remain live separately.

## Editorial policy
- No invented childhood dialogue, family conversations or fabricated photographs.
- Dates for family and training draw from established Ray archives.
- An image's photo date is distinct from its *illustrated scene's historical year*.
- Access to sources always available in "Context", but never dominates the scene.
- Future filmmaker catalogue posters are original typography/geometry and have no portrait licensing risk.

### Research starting points
- https://satyajitray.org/growing-up/
- https://satyajitray.org/biography/
- https://www.satyajitraysociety.org/biography.html
- Historical photo records:
  - https://commons.wikimedia.org/wiki/File:Sukumar_Ray_and_his_wife.jpg (1914)
  - https://commons.wikimedia.org/wiki/File:Satyajit_ray_little.jpg (circa 1930)
  - https://commons.wikimedia.org/wiki/File:Satyajit-Ray-Young.jpg (approximately 1940–1943, inconsistent Commons metadata)

## Explicit limits
This is a fully navigable **Act I pilot**, not a complete Ray biography. In the current source, no licensed film footage or documentary music is bundled. Photo reuse permissions require separate jurisdictional review before commercial launch. No online accounts, multi-device sync or native app features are added.

## QA gates
- `node scripts/verify-v10.mjs`: unchanged V6, V7, Story First, V8, byte-equivalent V9 welcome markup, exact V9 welcome animation function, scene controls and parser check.
- `node tests/v10-browser.mjs`: desktop and mobile Chromium, home/entry, original Coming Soon cards, archival context, jump-to-scene timeline, local progress resume, navigation, full chapter and bridge to next act.
- Publish `/v10/` and `/v10/journey/` additively, keep V9 `/app/` and original homepage unchanged.

## V10 next milestones
- Expand Act II through final years with the same living-scene standard.
- Source and clear additional genuinely relevant family photographs, correspondence, printed artwork, historical Kolkata imagery and film-production documentation.
- Add native/approved voiceover, optional environmental sound and explicit pacing choices with motion/accessibility controls.
- Replace the earlier-reader bridge once cinematic Act II has been validated.
