#!/usr/bin/env python3
"""Assemble a separate ORIGIN Story-First 1.6 preview; never modify frozen V6."""
from pathlib import Path
import subprocess
import sys

root = Path(__file__).resolve().parents[2]
out = root / "dist"
out.mkdir(parents=True, exist_ok=True)
base14 = root / "experiments/story-first-1-4/ORIGIN_Story_First_Chapter_1_4.html"
build15 = root / "experiments/story-first-1-5/build_v15.py"
build16 = root / "experiments/story-first-1-6/build_v16.py"
intermediate = out / "_temporary_1_5.html"
page = out / "index.html"
for p in (base14, build15, build16):
    if not p.is_file():
        raise SystemExit("Missing required source: " + str(p))
subprocess.run([sys.executable, str(build15), "--base-file", str(base14), "--output", str(intermediate)], check=True)
subprocess.run([sys.executable, str(build16), "--base-file", str(intermediate), "--output", str(page)], check=True)
intermediate.unlink()
html = page.read_text(encoding="utf-8")
for marker in ('id="origin15"', 'id="origin16"', '<title>ORIGIN'):
    if marker not in html:
        raise SystemExit("Missing expected journey content: " + marker)
print("ORIGIN story-first Chapters 1.4 + 1.5 + 1.6 assembled at", page)
