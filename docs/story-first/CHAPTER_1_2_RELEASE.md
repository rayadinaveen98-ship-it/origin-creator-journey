# ORIGIN Story-First Chapter 1.2 — Production Journey
27 October 2026 · Independent prototype

## Scope and boundary
This version expands the historical narrative and interactive investigations of the 8-act Pather Panchali pilot. The public ORIGIN V6 Cloudflare Worker, Android APK, and repository main branch remain unchanged. The complete playable offline HTML and source archive are attached in the ChatGPT conversation; **those binaries have NOT been committed to GitHub**. This Git branch holds the verified research and release documentation.

## Changes implemented and tested
1. **Eight-act filmstrip navigation:** a horizontal clickable timeline connects the whole narrative. It reflects each historical act and retains original previous/next navigation.
2. **Act II — Proof versus proposal:** select notebooks, visual treatment or test footage to understand what Ray could show backers and why filming before complete financing transferred risk to him.
3. **Act V — Funding chain:** a five-step disclosure separates personal insurance financing, limited producer aid, sale/pawning of possessions, interrupted filming, and delayed state support. No fabricated budgets, financing percentages or direct speech.
4. **Act VI — The production pause:** three explorable states distinguish a halted production, the passage of time, and continuation. The environmental drawing is labeled a symbolic teaching simulation, not a dated production calendar.
5. **Act VII — Film completion:** explore picture, music and the exhibition print as related requirements, without claiming that the control order recreates the original production schedule.
6. **Art direction:** desktop chapter artwork stays visible next to the longer history; mobile keeps a non-sticky, readable vertical experience. Source links and uncertainty labels are present in every new investigation.
7. **Preserved:** all eight original acts, existing continuity slider, contextual research drawer, progress notes, three-question comprehension reflection, cinematic images, and reduced-motion support.

## Sourced anchors
- Ray’s retrospective 1970 interview: https://www.bfi.org.uk/sight-and-sound/features/satyajit-ray-conversation-1970-folke-isaksson
- Production research: https://satyajitray.org/making-of-pather-panchali/
- MoMA’s 3 May 1955 world-premiere record: https://www.moma.org/calendar/film/726
- Museum’s research account: https://www.moma.org/explore/inside_out/2012/11/13/satyajit-rays-pather-panchali/

Important editorial controls: separate memoir/recollection from independently documented records; no invented conversations, financial data, exact filming dates beyond vetted evidence, copyrighted film audio, or invented Ray voice.

## QA
The standalone prototype was built and interaction-tested in Chromium at 1440×900, 768×1024, 390×844 and 320×700. Automated checks covered all eight acts, four new research interactions, previously built continuity experiment, source links, and final comprehension screen. No JavaScript page exceptions or document-width overflow were found. Automation used tiny placeholder images in its functional passes to avoid the browser runner's large-file restrictions; separate screenshots used original full-resolution period artwork for each new interaction, proving those images render. Device-level performance and accessibility testing still remain pending.

## Product gate before merging
Run five to eight qualitative tests with film learners; require viewers to retell the production’s funding/interruptions and distinguish original simulation from historical source evidence. Prioritize narrative comprehension over animation approval. Only after user validation decide whether to promote the story-first chapter into ORIGIN's main experience.

## File reference
Local deliverable filename: `ORIGIN_Story_First_Chapter_1_2.html`
SHA-256: `e9d7cd9b19a453718995b5ad3ae6325d0b41e773e4fb3c4051db6a972545890a`
Source archive: `ORIGIN_Story_First_Chapter_1_2_Source.zip`
