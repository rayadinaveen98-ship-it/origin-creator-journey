# ORIGIN V10 — Experience audit and immersion priorities

**Date:** 2026-10-27  
**Scope:** V10 home and eight-act Satyajit Ray cinematic pilot. Source-based assessment; this is **not** an archival-rights audit, independently verified historical review, visual browser acceptance, or Android-device QA.

## Baseline (from current V10 scene data)
| Act | Period | Scenes | Optional observation/craft moments | External photo assets named in scene data |
| --- | --- | ---: | ---: | ---: |
| I — The Boy | 1921–1939 | 8 | 0 | 3 |
| II — The Artist | 1940–1943 | 8 | 2 | 1 |
| III — The Dream | 1943–1951 | 11 | 5 | 0 |
| IV — The First Film | 1952–1955 | 12 | 4 | 0 |
| V — Finding His Voice | 1956–1969 | 13 | 6 | 0 |
| VI — The Wider World | 1970–1983 | 13 | 10 | 0 |
| VII — The Final Years | 1984–1992 | 12 | 6 | 0 |
| VIII — The Legacy | 1992–2026 | 10 | 6 | 0 |
| **Total** | | **87** | **39** | **4** |

The remaining **83 scenes have no externally referenced historic image in their scene definition**. They rely on original symbolic CSS/typographic art, which is rights-conscious but can make distinct historical events feel like iterations of one graphic template. The four external image references are not proof of rights clearance or availability.

## Root cause of the weak journey feeling
The story material is detailed and historically attributed, but nearly every beat uses the same interaction grammar: year + large headline + two paragraphs + full-screen art + next/previous + context drawer. All eight act controllers use a fixed 165 ms scene-change handoff. The varied art modes help, but scene semantics rarely control pacing. Act boundaries are page-route navigations, with little dramatic connective tissue. The result can feel like sequential editorial panels rather than events lived through with changing dramatic stakes.

This diagnosis is **source-based** and should be validated by watching actual users and real mobile screen recordings. Avoid claiming it is measured engagement data.

## Immediate corrective work (V10 first-paint polish)
Four chapter HTML files had stale **beat** counters (III, IV, V, VIII) even though their rail counters and runtime values were correct. On a slow device those incorrect denominators can briefly appear. Bring the static placeholders into agreement, and guard both initial counters against the 87-scene structure in `scripts/verify-v10.mjs`.

## Priority roadmap
### P1 — Emotional continuity (first production slice)
- Design chapter threshold moments for I→II, III→IV, IV→V, VII→VIII and the final return to I. Each should have a meaningful title, timestamp, image motif, and action, not a generic interstitial.
- Allow transitions to breathe where a major loss, obstacle, breakthrough or final farewell merits a pause, while keeping regular navigation responsive. Reduced-motion users must not be forced to wait.
- Preserve exact scene resume, back navigation, browser history, chapter map, and the existing V9/V10 opening.
- Focus initial end-to-end review on **1923 family loss → Santiniketan → Pather Panchali first shoot → Cannes recognition → final years → archive fire and restoration**.

### P1 — Visual credibility and historical specificity
- Build a rights/provenance register for each proposed still, poster, letter, sketch, photo, title design or film extract: owner, source URL, permission/license, credit text, allowed platform and usage, expiry.
- Prioritize licensed or clearly reusable evidence at major turning points rather than adding filler portraits everywhere.
- Keep authentic evidence, reconstructed educational diagrams, and invented symbolic illustrations clearly separated. Never generate fake historical photos or imply fictional art is documentary footage.
- If rights are unavailable, use bespoke illustrations of **specific** objects, places or production constraints, labeled as editorial—not generic atmospheric texture.

### P2 — Scene rhythm and agency
- Classify every scene as arrival / discovery / conflict / consequence / turning point / reflection / legacy. Use each category to vary composition, movement, silence, and interaction, without slowing all scenes equally.
- Retain optional, short exercises only when they reveal a specific filmmaking or preservation concept. The current 39 optional observation moments should be reviewed for variety and non-repetition, not expanded indiscriminately.
- Give the viewer orientation at act boundaries: where, when, what changed, what decision follows. Never invent private dialogue or unverifiable emotions.

### P2 — Mobile and accessibility acceptance
- Review on physical Android devices, including compact phone screens, gesture navigation, display scaling, and reduced-motion settings. A passing Chrome simulation is necessary but not sufficient.
- Test overlap/clipping for every stage illustration, very long headlines and source drawers; large text, keyboard focus, safe areas and offline/error behavior.
- Any optional soundscape must remain off by default, controllable, licensed and compatible with accessibility expectations.

## Non-regression contract
Do not alter the acclaimed welcome animation or frozen older experiences without a separate request. Preserve original scene data, progress keys, the full 87-moment chronology, previous/next behavior, citations and context drawers. Maintain the eight-act map's truthful pilot-status language, Cloudflare deep links and existing CI suites.

## Release gates
1. V10 static and Chromium regressions pass for all eight acts.
2. Live Cloudflare check asserts each real HTML/JS file, not a fallback route.
3. Initial scene counts agree with each act's source on first paint.
4. Major continuity edits get dedicated phone-width screenshots and keyboard/reduced-motion coverage.
5. Archive imagery is cleared and credited before any public production release.
