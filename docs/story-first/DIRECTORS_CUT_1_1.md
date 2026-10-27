# Director's Cut — Story-First Pilot 1.1 (27 October 2026)

**Production invariant:** `main` stays frozen at ORIGIN V6; neither Cloudflare Workers nor the Android APK is modified. This is research-branch work only.

## Runnable deliverable

A self-contained, offline HTML prototype and complete source ZIP were produced in the current ChatGPT project workspace. The standalone HTML includes the existing original V6 illustrations. The large self-contained HTML is delivered as an attached artifact in chat; **it has not yet been uploaded to this GitHub branch**. This file is a release manifest/editorial record, not a false claim of a web deployment.

## Functional improvements since story pilot 1.0

1. **Film-in-progress status:** Three qualitative labels change at every historical beat: funding/resources, material already produced, and next filmmaking obstacle. The values are editorial summaries, not fabricated budgets or statistics.
2. **Human-journey connective tissue:** All eight scenes now have a historical question, stronger explanation, cause-to-effect handoff, an expandable research layer, and a clearly marked limitation on what can be known.
3. **Two-frame continuity demonstration:** The 1952 field setback compares two original illustrated field states and lets a slider remove simulated plants in only the second frame. It is not footage from Ray's film.
4. **Comprehension check:** Three interactive questions test comprehension of the pitching/financing choice, environment and continuity, and the release chronology (MoMA May 1955, India August 1955, Cannes 1956).
5. **Preservation:** Original pilot navigation, research links, writing notes, illustrations, and no-autoplay/no-account/offline behavior retained.

## QA record

Chromium passed scripted interactions at 1440×900, 768×1024, 390×844, and 320×700; tests include navigation, research drawer, notes/source controls, two-frame continuity, recap, JavaScript error logging, and document-level horizontal overflow checks.

Because automated file:// navigation was denied for the large standalone file, the browser test used the **exact JS/CSS with lightweight placeholder images**, then independently loaded the original V6 artwork into each test screen and captured real-art screenshots. Do not misrepresent this as a successful full-file navigation test or physical-device signoff.

## Editorial verification notes

- Ray's 1970 interview: https://www.bfi.org.uk/sight-and-sound/features/satyajit-ray-conversation-1970-folke-isaksson
- Ray's production narrative: https://satyajitray.org/making-of-pather-panchali/
- BFI presentation of Ray's first-day account: https://bfidatadigipres.github.io/satyajit%20ray%3Cbr%3Ethe%20language%20of%20film/2022/07/03/pather-panchali/
- MoMA May 3, 1955 premiere: https://www.moma.org/calendar/film/726
- The precise October first-shoot day is deliberately not asserted in the interface because retrospective source chronology and weekday descriptions can conflict.
- No recreated conversation, private motive, Ray voice imitation, film footage or Ravi Shankar score is presented as historical material.

## Next checkpoint

Conduct a 5–8 person qualitative beta: can viewers explain the financing stoppages and continuity setback in their own words, distinguish simulation from history, and want to continue into Ray's next life period? Only then decide how to incorporate the pilot into the public application.
