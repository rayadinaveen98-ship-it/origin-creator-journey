# ORIGIN V9 — Cinematic Home & Journey Entry (alpha)

## Goal
Transform ORIGIN from separate URLs into a cohesive creator-discovery app experience, with a dramatic full-screen opening and a streaming-inspired browse home. **This is the complete app shell milestone**, not a claim that Ray's entire biography has been fully researched or that a downloadable mobile APK exists.

## Implemented
- A full-screen animated ORIGIN welcome, automatically resolves on first visit in a browser tab (no skip UI), with hundreds of tiny light particles forming the title. Reduced-motion users see a brief static intro.
- Archive-led home using a properly attributed portrait of Ray taken in New York in 1981 by Dinu Alam (CC BY-SA 4.0), with source record link.
- Featured Ray hero and three journey discovery tiles (all link to real life-reader moments).
- Continue journey shelf built from the existing V8 browser-local `origin_v8_life_scene_v1` progress key (preserves existing data; does not write the key itself).
- Film journey (1955–59) and filmmaking Studio sections linking to existing Story-First and V7 releases.
- Search for the six currently supported experiences, with honest empty state.
- My List, stored in this browser, for the one available creator.
- Full-screen cinematic transition into /life/#moment-N, with chapter-specific entry and a clearly labeled return-to-home action in V8.
- Accessible buttons, labeled search, dialogs, mobile bottom navigation, keyboard focus and reduced-motion support.

## Scope and honesty
The current library has **one featured creator**, not fabricated additional filmmaker journeys. The V8 life reader has 16 moments and later-life decades are short summaries, not complete episodes. ORIGIN does not stream licensed films or pretend to be affiliated with Netflix or the Ray estate.

## Photo rights
Main hero: [Dinu Alam's 1981 New York portrait](https://commons.wikimedia.org/wiki/File:Satyajit_Ray_in_New_York.jpg), CC BY-SA 4.0; hotlinked and visually cropped/grayscaled through CSS, attributed in-page. Other Commons photos used in V8 are flagged with varying licenses/jurisdictional status, and should be reviewed before commercial release. No copyrighted film frames or music are added.

## Safety and QA
- V6, Story-First, and V7 are preserved; no existing source or storage key overwritten.
- Main production worker homepage remains original V6 at /. New shell is an additive /app/ URL until user approval.
- Run `node scripts/verify-v9-home.mjs` then `node tests/v9-home-browser.mjs` on a Chromium-equipped runner. New actions workflow runs these on feature branch and PR.

## Next product milestone
Upgrade V8 life's narrative itself: archival rights clearance, more real film and family materials, complete and emotional chronology into 1992, scene-level craft integration and user research; afterwards decide whether /app/ replaces legacy / as primary entry. Physical phone accessibility and performance remain unverified.
