# ORIGIN Story-First Chapter 1.3 — Beyond the Director

This release is another **independent narrative prototype**, not an update to the public V6 website or APK. The live product remains frozen.

## What was built

- **Act III — The team:** Five interactive, source-linked research cards showing how camera, art direction, editing and music contributed alongside Ray's direction. The copy deliberately distinguishes first-shoot crew members from contributors who worked at later stages.
- **Act VII — The sound deadline:** An original opt-in synthesized audio experiment: silence, atmosphere or motif over the same illustrative image. No playback occurs without a click. The sounds are not Ravi Shankar's music or a reconstruction of the historical score.
- **Act VIII — Three receptions:** Date-sensitive interactive filmstrip separating the May 3, 1955 MoMA premiere, the August 26, 1955 Indian theatrical opening, and the 1956 Cannes award. A short recognition question checks understanding.
- All eight prior narrative scenes and Chapter 1.2 investigations remain in the full standalone HTML.

## Verified research

- Ray's first-day narrative: https://bfidatadigipres.github.io/pdf/2022-07-03-pather-panchali.pdf
- Ray's cinematography account: https://satyajitray.org/cinematography-camera-and-lighting/
- Film crew credits: https://www.satyajitraysociety.org/cast_and_crew.html
- Ray's production history: https://satyajitray.org/making-of-pather-panchali/
- MoMA world-premiere record: https://www.moma.org/calendar/film/726
- Indian release record: https://www.bengalfilmarchive.com/filmography-details.php?t=NjY0
- MoMA Cannes award summary: https://www.moma.org/calendar/events/5898

## QA report

Four Chromium screen widths tested (1440, 768, 390, 320 px): crew switching, previous funding investigations, sound-mode selection/stop, three-date filmstrip, interactive comprehension check, and original final recap all worked. No page JavaScript errors or document-width overflow observed. Separate full-resolution artwork renders were loaded in Chromium and screenshots inspected. Synthesized audio needs physical-device listening validation.

## Release handoff

The **full playable self-contained HTML** and source ZIP are attached in the ChatGPT conversation. The GitHub branch contains the content model and editorial/QA notes; **the large HTML and image-embedded assets are not in this branch yet**. Do not equate this document with a deployed preview.

Standalone file: `ORIGIN_Story_First_Chapter_1_3.html`
SHA-256: `e400e2f632f410fb78d10488278601723e1e9ebd33c7e9fdbde1316130b6cedf`

## Product evaluation

Test whether users understand **the crew, the deadline, and three separate reception dates** without referring back to the text. Better historical understanding and desire to continue are the acceptance criteria, not animation count.

Do not merge this branch into `main` or point Cloudflare at it before editorial approval and broader usability QA.
