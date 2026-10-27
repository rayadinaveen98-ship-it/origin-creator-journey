from pathlib import Path
import hashlib

here=Path(__file__).resolve().parent
base=Path('/mnt/data/ORIGIN_Story_First_Chapter_1_4/ORIGIN_Story_First_Chapter_1_4.html')
# Local build; GitHub checkout uses --base-file pointing at the preserved v1.4 file.
import argparse
parser=argparse.ArgumentParser()
parser.add_argument('--base-file',type=Path,default=base)
parser.add_argument('--output',type=Path,default=here/'ORIGIN_Story_First_Chapter_1_5.html')
args=parser.parse_args()
text=args.base_file.read_text(encoding='utf-8')
style=(here/'chapter-15.css').read_text(encoding='utf-8')
markup=(here/'sequel-section.html').read_text(encoding='utf-8')
script=(here/'chapter-15.js').read_text(encoding='utf-8')
launch='''<aside id="o15Launch" hidden aria-label="Continue Ray's story"><span class="o15-launch__label">THE NEXT CHAPTER · 1955—1959</span><h2 class="o15-launch__heading">The film ended. The creator's journey didn't.</h2><p class="o15-launch__description">Discover why Satyajit Ray returned to Apu, what made Aparajito personal for him, and how a trilogy emerged without being planned.</p><button class="o15-launch__action" id="o15LaunchButton" type="button">Enter the next chapter →</button></aside>'''
assert '<div class="stepbar">' in text
assert '<div class="shell">' in text
assert '<div class="modal" id="sourcesModal"' in text
assert '</style>' in text and '</body>' in text
assert 'origin15' not in text, 'Refusing to duplicate v1.5'
text=text.replace('</style>',style+'\n</style>',1)
text=text.replace('<div class="stepbar">',launch+'\n<div class="stepbar">',1)
text=text.replace('<div class="modal" id="sourcesModal"',markup+'\n<div id="sourcesModal"',1)
text=text.replace('</body>','<script>'+script+'</script>\n</body>',1)
text=text.replace('<title>ORIGIN — The Film That Almost Didn\'t Exist | Story-First 1.3</title>','<title>ORIGIN — Story First 1.5 | From Pather Panchali to Aparajito</title>',1)
args.output.parent.mkdir(parents=True,exist_ok=True)
args.output.write_text(text,encoding='utf-8')
print(args.output, 'bytes',args.output.stat().st_size,'sha256',hashlib.sha256(args.output.read_bytes()).hexdigest())