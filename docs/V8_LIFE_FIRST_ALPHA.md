# ORIGIN — V8 "A Life in Frames" (narrative/UI alpha)

## Why this exists
Creator feedback on V7: the viewer could not feel that they had entered Satyajit Ray's life, did not know what they were seeing, missed real work and family photographs, and did not understand the throughline from childhood to final years.

**This is an additive V8 life-first editorial prototype, not a completed documentary biography or replacement for V6/V7.** It lives at `/life/`.

## Meaning of the UI
- **Header**: person and life span, timeline entry, simple help.
- **Context strip**: where and when the viewer is, whether the moment is prologue, a deeply covered early-life scene or a later overview.
- **Archive panel**: photograph, its REAL photographic date, the exact interpretation of what is pictured, an image-file record and fallback if images fail.
- **Narrative panel**: date/era -> headline -> short opening -> *What happened* (documented account) -> *Why it matters* (interpretation) -> optional look-closer question -> sources/editorial boundaries -> Previous/Next -> numeric progress.
- **Life timeline**: navigation from 1921 through 1992, clearly distinguishing early-life storytelling depth from later-life summaries.
- **Resume**: browser-local last scene, deep link `#moment-N`. No accounts/sync.

## Historical research and source ledger
Primary biography and chronological scaffold:
- https://satyajitray.org/growing-up/
- https://satyajitray.org/biography/
- https://satyajitray.org/advertising-graphic-design/
- https://satyajitray.org/filmography/
- https://www.satyajitraysociety.org/biography.html
- https://tuliresearchcentre.org/person-film-maker/satyajit-ray/agraphy/integrated-timeline/
- Academy 1992 award: https://www.oscars.org/oscars/ceremonies/1992/memorable-moments
- Academy on Apu trilogy: https://www.oscars.org/events/satyajit-rays-apu-trilogy

Historical-photo file records used:
- Childhood portrait recorded as 1930: https://commons.wikimedia.org/wiki/File:Satyajit_ray_little.jpg
- Parents Sukumar and Suprabha dated 1914, **before** Satyajit's birth: https://commons.wikimedia.org/wiki/File:Sukumar_Ray_and_his_wife.jpg
- Young Satyajit portrait at Santiniketan, date **inconsistent** (Commons says 1940 and 1943): https://commons.wikimedia.org/wiki/File:Satyajit-Ray-Young.jpg

**Rights and provenance:** These files are marked public domain for India on their Wikimedia Commons record; Commons also discusses jurisdictional differences. Their metadata is imperfect. We must separately clear worldwide commercial reuse or replace with permissioned copies before a broad launch. This prototype hotlinks Commons files instead of embedding copies; image errors produce explicit accessible fallback art. No film stills, footage, film audio or reconstructed private dialogue are embedded.

## What is actually implemented
16 story moments spanning a prologue in 1992, formative years 1921–1940, advertising and cinéphile period 1943–1950, first film 1952–1955, then succinct overview scenes through the end of his life in 1992. History is separated from emotional inference and work-specific context. Early years contain contextual choices that reveal additional **documented interpretations**, not alternate history.

## Not yet implemented
- Thorough life chapters after 1955, complete film coverage and approved photographs/works from later eras.
- Voice narration, original documentary score, true shot-level return into V7 Studio, international rights clearance.
- Full assistive-technology and physical-phone verification.
- Real-user emotional response testing.
- Editorial fact-check by independent historian.

## Release safety
Release is additive: no V6, Story-First or V7 code changed. QA must pass before /life/ is published. Keep existing homepage unchanged. Never claim 1921–1992 is finished when later acts are explicitly overviews.
