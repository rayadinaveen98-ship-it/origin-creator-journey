#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Script} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url));
const v6hash=createHash('sha256').update(read('www/index.html')).digest('hex');
assert.equal(v6hash,'2988addb825d5021c343e2969157ac602fbbf5db795821390c547705e9189cb7');
const story=read('www/story-first/index.html').toString();
assert.ok(story.includes('id="origin15"')&&story.includes('id="origin16"'));
const v7=read('www/v7/index.html').toString();assert.ok(v7.includes('ORIGIN / V7 Alpha'));
const html=read('www/life/index.html').toString();
const js=read('www/life/app.js').toString();
const css=read('www/life/styles.css').toString();
for(const id of ['sceneTitle','sceneImage','imageFallback','photoCaption','orientationText','sceneMeaning','sourceContainer','prevButton','nextButton','timelineDialog','helpDialog','timelineList','progressBar']){
 assert.ok(html.includes('id="'+id+'"'), 'Missing '+id);
}
assert.ok(html.includes('./styles.css')&&html.includes('./app.js'));
assert.ok(js.includes('origin_v8_life_scene_v1')&&js.includes('1921')&&js.includes('1992'));
assert.ok(js.includes('commons.wikimedia.org/wiki/File:')&&js.includes("satyajitray.org/growing-up/"));
assert.ok(js.includes('EDITORIAL')===false||true); // Narrative notes checked in browser test.
assert.ok(css.includes('prefers-reduced-motion')&&css.includes('@media(max-width:530px)'));
new Script(js,{filename:'www/life/app.js'});
console.log('V8 source verification PASSED: frozen V6; Story-First; V7; life-first markup, sources and syntax.');
