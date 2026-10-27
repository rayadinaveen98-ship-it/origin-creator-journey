# ORIGIN Story-First — Chapter 1.4: Beyond the Premiere

**Date:** 27 October 2026  
**Release type:** Working story-first research prototype, not production V6  
**Main app safety:** GitHub `main`, live Cloudflare Worker, and Android APK **unchanged**.

## Playable sources in this branch

- [Complete self-contained Chapter 1.4](../../experiments/story-first-1-4/ORIGIN_Story_First_Chapter_1_4.html): 2,778,430 bytes, original cinematic artwork and previous chapter interactions retained.
- [Small independent historical-evidence preview](../../experiments/story-first-1-4/interactive-evidence-preview.html): standalone, responsive demo of two historical perspectives for quick code review.

### Exact full HTML source fingerprint

- SHA-256: `05fb6dab4a581a037d64164fa17e4cc2f59f0fbe53283ab120137facd9568aae`
- Git blob SHA: `cb236a4218e0207ff7160e0f21275d0e2483822f`
- GitHub blob content matched local original exactly by Git-object SHA and byte length.

## What changed from Chapter 1.3

1. Act V / The personal cost: selectable, sourced accounts of Ray's advertising salary, filmed proof material (about 4,000 feet as recalled by Ray), and household possessions that supported the effort. Sources retain recollection limitations; no fabricated dialogue or money totals.
2. Act VIII / Beyond the premiere: 5-stage interactive narrative distinguishing MoMA premiere, Indian theatrical release, Ray's retrospective account of initially limited attendance, fuller theatres from the third week, and Cannes recognition.
3. Act VIII / What next: a bridge explaining that the Apu Trilogy evolved over subsequent productions rather than being a fixed plan from the outset.
4. Original artwork, previous 8 acts, crew interactive, audio comparisons, production disruptions, source drawer, and notebook unchanged.

## Evidence

- Ray's 1970 retrospective interview: https://www.bfi.org.uk/sight-and-sound/features/satyajit-ray-conversation-1970-folke-isaksson
- MoMA 1955 premiere: https://www.moma.org/calendar/film/726
- MoMA 1956 Cannes recognition: https://www.moma.org/calendar/events/5898
- Ray archive on trilogy: https://satyajitray.org/apu-trilogy/

## QA completed

- Chrom(ium) behavior with only artwork temporarily substituted during the automated 4-device suite: 1440×900, 768×1024, 390×844, 320×700: **PASS**.
- Investigated: chapter controls, switching source threads, five-part audience timeline, next/previous limits, trilogy disclosure, legacy crew and sound screens.
- No JavaScript runtime errors or document-level horizontal overflow.
- **Additionally** the entire unmodified source with the real original artwork loaded in Chromium at desktop (1440×900) and mobile (390×844); original-art screenshots captured with no page errors and no mobile overflow.
- Not yet tested: physical Android device, screen-reader audit, long-session performance, actual audience comprehension or rights-clearance for future archival assets.

## Future editorial priority

The journey needs a complete user research session with 5–8 aspiring filmmakers or serious cinephiles. Ask what happened between footage financing and eventual recognition, what depended on collaborators, and whether they understand the difference between verified record and teaching simulation. Do not merge into V6 simply because animations look good.

**NO CHANGE to production app, web deployment, or Android release.**
