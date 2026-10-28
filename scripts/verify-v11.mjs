#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Script,createContext} from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const boot=['www/v11/registry.js','www/v11/data/ray-profile.js',
 ...Array.from({length:8},(_,i)=>'www/v11/data/ray-act-'+(i+1)+'.js'),
 'www/v11/data/kurosawa-preview.js'];
const win={};
const context=createContext({window:win,URL,console});
for(const path of boot)new Script(read(path),{filename:path}).runInContext(context,{timeout:2000});
const result=JSON.parse(JSON.stringify(win.ORIGIN_V11.inspect()));
assert.deepEqual(result,[{id:'ray',acts:8,scenes:87,preview:false},{id:'kurosawa',acts:1,scenes:5,preview:true}],'both creators and complete Ray must load through one registry');
const expected=[8,8,11,12,13,13,12,10],acts=win.ORIGIN_V11.acts('ray');
assert.deepEqual(JSON.parse(JSON.stringify(acts.map(a=>a.scenes.length))),expected);
for(let i=0;i<8;i++){
 const path=i===0?'www/v10/journey/story.js':'www/v10/journey/act'+(i+1)+'/act'+(i+1)+'.js';
 const full=read(path);
 const start=full.indexOf('const CHILD='),end=full.indexOf('const storeKey=');
 assert.ok(start>=0&&end>start,'V10 act data marker missing');
 const raw=full.slice(start,end);
 const legacyScenes=new Script('(function(){'+raw+';return {scenes,archive};})()',{filename:path}).runInNewContext({}, {timeout:2000});
 const plain=value=>JSON.parse(JSON.stringify(value));
 assert.deepEqual(plain(acts[i].scenes),plain(legacyScenes.scenes),'Ray Act '+(i+1)+' V10 scene data must remain identical');
 assert.deepEqual(plain(acts[i].archive),plain(legacyScenes.archive),'Ray Act '+(i+1)+' citations must remain identical');
}
const html=read('www/v11/index.html'),player=read('www/v11/player.js');
for(const id of ['catalogHeading','catalogItems','viewer','stage','storyTitle','storyLead','storyMore','openChapters','openContext','chapterList','contextSources','nextButton','prevButton','ending','progressBar']){
 assert.ok(html.includes('id="'+id+'"'),'Missing player DOM ID '+id);
}
for(const [,usedId] of player.matchAll(/\$\('([A-Za-z][A-Za-z0-9_-]*)'\)/g))assert.ok(html.includes('id="'+usedId+'"'),'Player binds missing DOM ID '+usedId);
for(const path of boot.concat(['www/v11/player.js'])){
 assert.ok(html.includes('src="./'+path.replace('www/v11/','')+'"'),'Script not registered: '+path);
}
const dataURLs=[...html.matchAll(/<script defer src="([^"]+)"/g)].map(m=>m[1]);
assert.equal(dataURLs[0],'./registry.js');
assert.equal(dataURLs.at(-1),'./player.js');
new Script(player,{filename:'www/v11/player.js'});
const css=read('www/v11/styles.css');
assert.ok(css.includes('prefers-reduced-motion')&&css.includes('max-width:750px'),'Mobile and reduced-motion styling required');
assert.ok(player.includes("origin_v10_act"),'Legacy Ray progress migration must be implemented');
assert.ok(player.includes('noopener noreferrer'),'Source links need safe external-link policy');
assert.ok(!player.includes('eval(')&&!player.includes('new Function('),'No dynamic script evaluation in player');
const directorCode=read('www/v11/visual-director.js');
const canvasCode=read('www/v11/visual-grammar.css');
new Script(directorCode,{filename:'www/v11/visual-director.js'}).runInContext(context,{timeout:2000});
const visual=win.ORIGIN_VISUAL_DIRECTOR;
assert.ok(visual&&visual.templates.length>=10,'Require diverse reusable visual templates');
const compositions=new Set();
for(const id of ['ray','kurosawa'])for(const act of win.ORIGIN_V11.acts(id))for(const [i,scene] of act.scenes.entries()){
 const spec=visual.direction(scene,i);
 assert.ok(visual.templates.includes(spec.template),'Every scene maps to a supported template');
 assert.ok(spec.label&&spec.description&&spec.layers.length>=3,'Every art direction must explain its original provenance');
 compositions.add(spec.template);
}
assert.ok(compositions.size>=9,'Real creator scenes must exercise at least nine visual templates');
for(const name of visual.templates)assert.ok(canvasCode.includes('data-template="'+name+'"'),'Visual template lacks styling: '+name);
for(const id of ['visualSet','visualTechnique'])assert.ok(html.includes('id="'+id+'"'),'Missing V11.1 visual DOM '+id);
assert.ok(html.includes('src="./visual-director.js"')&&html.includes('href="./visual-grammar.css"'),'Cinematic visual assets must be loaded');
assert.ok(html.indexOf('src="./visual-director.js"')<html.indexOf('src="./player.js"'),'Art director must load before reader');
assert.ok(canvasCode.includes('prefers-reduced-motion')&&canvasCode.includes('max-width:750px'),'Cinematic templates must support motion-sensitive/mobile users');
assert.ok(player.includes('visualDirector.mount('),'Shared player must use universal art director');
console.log('V11 schema/static QA PASS: 2 creators, 9 acts, 92 scenes; Ray 87 scenes and sources byte-equivalent as object data to V10; V11 engine structure and browser syntax valid.');
