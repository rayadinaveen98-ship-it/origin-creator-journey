# ORIGIN Chapter 1.5 — After the First Film

**Playable successor to the preserved Chapter 1.4.** The historical continuation explores Ray's move from *Pather Panchali* (1955) to *Aparajito* (1956), and the Apu trilogy's emergence (1959).

## How to build locally
```bash
python3 experiments/story-first-1-5/build_v15.py \
  --base-file experiments/story-first-1-4/ORIGIN_Story_First_Chapter_1_4.html \
  --output dist/ORIGIN_Story_First_Chapter_1_5.html
```
No npm dependencies or API keys are needed. Open the resulting HTML file in a browser, navigate through Chapter 1.4 to Act VIII, and choose **Enter the next chapter**.

## GitHub files
- `sequel-section.html`: semantic layout and original self-contained SVG cityscape
- `chapter-15.css`: responsive and reduced-motion cinematic styling
- `chapter-15.js`: six historically grounded acts, interactive study labs, source citations and local notes
- `build_v15.py`: produces complete playable HTML by extending the existing Chapter 1.4 (without modifying it)

## Tested
Four viewport widths (320 / 390 / 768 / 1440). Tested chapter handoff, six stages, choice states, framing lab, research links and page JS errors. No horizontal overflow in those runs. Chromium `page.set_content` was used because the sandbox disallowed direct `file://` navigation. Physical device tests, actual learner comprehension testing and screen-reader evaluation remain pending.

## Research
- [Criterion: Aparajito (1956)](https://www.criterion.com/films/28443-aparajito)
- [Satyajit Ray Archive: The Apu trilogy](https://satyajitray.org/apu-trilogy/)
- [BFI: Satyajit Ray in conversation (1970)](https://www.bfi.org.uk/sight-and-sound/features/satyajit-ray-conversation-1970-folke-isaksson)
- [Academy Museum: Aparajito](https://www.academymuseum.org/en/programs/detail/aparajito-the-unvanquished)
- [Tuli Research Centre: Aparajito](https://www.tuliresearchcentre.org/aparajito-1956)

Content is original instructional interpretation with source links; no unlicensed film stills, scores or Ray voice recreation are used.

## Production safety
All files on this branch are in `experiments/story-first-1-5` and do **not** change V6 `main`, Cloudflare Workers, or the published Android APK.
