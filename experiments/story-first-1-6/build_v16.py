#!/usr/bin/env python3
"""Additive, deterministic offline Chapter 1.6 build from the existing 1.5 HTML."""
from pathlib import Path
import argparse, hashlib
here=Path(__file__).resolve().parent
p=argparse.ArgumentParser()
p.add_argument('--base-file',type=Path,default=(here/'ORIGIN_Story_First_Chapter_1_5.html' if (here/'ORIGIN_Story_First_Chapter_1_5.html').exists() else Path('/mnt/data/ORIGIN_Story_First_Chapter_1_5/ORIGIN_Story_First_Chapter_1_5.html')))
p.add_argument('--output',type=Path,default=here/'ORIGIN_Story_First_Chapter_1_6.html')
a=p.parse_args()
html=a.base_file.read_text(encoding='utf-8')
assert 'id="origin15"' in html, 'Need the exact 1.5 base'
assert 'id="origin16"' not in html, 'Refusing duplicate chapter'
css=(here/'chapter-16.css').read_text(encoding='utf-8')
section=(here/'chapter-16-section.html').read_text(encoding='utf-8')
js=(here/'chapter-16.js').read_text(encoding='utf-8')
assert html.count('</style>')>=1 and html.count('</body>')==1
assert '<nav class="o15__rail"' in html
assert '<div id="sourcesModal"' in html
# Add new launcher and section outside previous chapter; do not edit its scenes.
html=html.replace('</style>',css+'\n</style>',1)
html=html.replace('<div id="sourcesModal"',section+'\n<div id="sourcesModal"',1)
html=html.replace('</body>','<script>'+js+'</script>\n</body>',1)
html=html.replace('<title>ORIGIN — Story First 1.5 | From Pather Panchali to Aparajito</title>', '<title>ORIGIN — Story First 1.6 | Ray Changes Register, 1958–59</title>',1)
a.output.parent.mkdir(parents=True,exist_ok=True)
a.output.write_text(html,encoding='utf-8')
print(a.output,'bytes',a.output.stat().st_size,'sha256',hashlib.sha256(a.output.read_bytes()).hexdigest())