#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {Script} from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const v6=fs.readFileSync(new URL('../www/index.html',import.meta.url));
assert.equal(createHash('sha256').update(v6).digest('hex'),'2988addb825d5021c343e2969157ac602fbbf5db795821390c547705e9189cb7','Frozen V6 must not change');
assert.ok(read('www/story-first/index.html').includes('id="origin16"'),'Story First release preserved');
assert.ok(read('www/v7/index.html').includes('ORIGIN / V7 Alpha'),'V7 release preserved');
assert.ok(read('www/life/app.js').includes('origin_v8_life_scene_v1'),'Existing life progress preserved');
const html=read('www/app/index.html'),js=read('www/app/app.js'),css=read('www/app/styles.css');
for(const id of ['welcome','particleCanvas','featureTitle','heroEnter','continueCard','journeysSection','librarySection','saveButton','entry','searchPanel','searchInput','infoDialog','closeInfo','featurePortrait']){
 assert.ok(html.includes('id="'+id+'"'),'Missing '+id);
}
assert.ok(html.includes('Satyajit Ray')&&html.includes('1921')&&html.includes('1992'));
assert.ok(js.includes("'/life/?from=origin#moment-'"),'Journey must use the real life reader');
assert.ok(js.includes('origin_v8_life_scene_v1')&&js.includes('sessionStorage'),'Progress and intro should persist');
assert.ok(js.includes('window.location.assign(url)'),'Journey entry must actually navigate');
assert.ok(css.includes('prefers-reduced-motion')&&css.includes('@media(max-width:720px)'),'Motion safety/mobile breakpoints');
assert.ok(read('www/life/index.html').includes('href="/app/"'),'Life reader must have a return route');
new Script(js,{filename:'www/app/app.js'});
console.log('ORIGIN V9 source checks passed: frozen V6, prior experiences, cinematic home, state, routes and syntax.');
