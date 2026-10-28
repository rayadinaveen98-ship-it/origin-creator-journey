#!/usr/bin/env node
import assert from 'node:assert/strict';
import {Script,createContext} from 'node:vm';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const ctx=createContext({window:{},URL,console});
for(const file of ['www/v11/studio/schema.js','www/v11/studio/governance.js']){
 new Script(read(file),{filename:file}).runInContext(ctx,{timeout:2000});
}
const s=ctx.window.ORIGIN_STUDIO_SCHEMA,g=ctx.window.ORIGIN_STUDIO_GOVERNANCE;
const plain=x=>JSON.parse(JSON.stringify(x));
const doc=plain(s.demo()),ch=doc.acts[0],scene=ch.scenes[0],source=ch.archive[0];
let review=g.blankReview();
let state=g.assess(doc,review,s);
assert.equal(state.form.ok,true,'Valid sample is previewable without editorial approval');
assert.equal(state.handoffReady,false,'Sample not ready for handoff');
assert.equal(state.counts.checkedScenes,0);
assert.equal(state.counts.checkedSources,0);
assert.equal(state.counts.reviewedMedia,0);
assert.throws(()=>g.mark(review,'sources',source,ch,'checked','too short'),/at least 12/);
assert.throws(()=>g.mark(review,'sources',source,ch,'approved','Source checked carefully against published record'),/Unknown/);
review=g.mark(review,'sources',source,ch,'checked','Confirmed article title and biographical fact in the linked archive.');
state=g.assess(doc,review,s);
assert.equal(state.counts.checkedSources,1);
assert.equal(state.handoffReady,false);
review=g.mark(review,'scenes',scene,ch,'fact-reviewed','Cross-referenced scene date with the biography source.');
review=g.mark(review,'assets',scene,ch,'original-only','CSS-original artwork only, no external media assets.');
state=g.assess(doc,review,s);
assert.equal(state.handoffReady,true,'All self-attestations allow review packet handoff');
assert.equal(state.issues.length,0);
assert.equal(state.counts.checkedScenes,1);
assert.equal(state.counts.reviewedMedia,1);
const packet=plain(g.createPacket(doc,review,s));
assert.equal(packet.status,'self-attested-handoff-ready');
assert.match(packet.disclaimer,/Not editorial approval/);
assert.equal(packet.draft.acts[0].scenes[0].title,'A life begins');
assert.equal(packet.reviews.sources[g.reviewKey(ch,source)].status,'checked');
doc.acts[0].scenes[0].lead+=' A new editorial sentence.';
state=g.assess(doc,review,s);
assert.equal(state.handoffReady,false,'Edited fact must invalidate review');
assert.ok(state.counts.stale>=1);
doc.acts[0].scenes[0].lead=scene.lead; // scene is the same object, restore explicit original below.
doc.acts[0].scenes[0].lead='Satyajit Ray was born in Calcutta on 2 May 1921.';
state=g.assess(doc,review,s);
assert.equal(state.handoffReady,true,'Exact original review content should recover same tag');
doc.acts[0].archive[0].url='https://satyajitray.org/other-page/';
state=g.assess(doc,review,s);
assert.equal(state.handoffReady,false,'Changing source URL invalidates both source and dependent scene reviews');
assert.ok(state.counts.stale>=1);
doc.acts[0].archive[0].url=source.url;
doc.acts[0].archive[0].url='https://satyajitray.org/biography/';
let checkpoints=g.createCheckpoint(doc,review,'Original documented review snapshot',[]);
assert.equal(checkpoints.length,1);
assert.equal(checkpoints[0].title,'Original documented review snapshot');
assert.throws(()=>g.createCheckpoint(doc,review,'Another identical snapshot',checkpoints),/matches/);
doc.profile.name='Version two — a revised biography';
checkpoints=g.createCheckpoint(doc,review,'Revision with changed profile',checkpoints);
assert.equal(checkpoints.length,2);
assert.equal(checkpoints[0].draft.profile.name,'Version two — a revised biography');
assert.equal(checkpoints[1].draft.profile.name,'Satyajit Ray — Studio Sample');
assert.equal(g.assess(plain(checkpoints[1].draft),plain(checkpoints[1].reviews),s).handoffReady,true);
for(let i=0;i<8;i++){doc.profile.subtitle+='!';checkpoints=g.createCheckpoint(doc,review,'Review version '+i,checkpoints);}
assert.equal(checkpoints.length,g.MAX_CHECKPOINTS);
assert.equal(g.cleanHistory([{title:'bad'},...checkpoints]).length,g.MAX_CHECKPOINTS);
assert.equal(g.cleanReviews({sources:{'bad__id':{status:'approved',note:'wrong',tag:'x'}},scenes:{},assets:{}}).sources.bad__id,undefined,'External imports cannot forge unsupported state values');
const editor=read('www/v11/studio/editor.js'),html=read('www/v11/studio/index.html'),css=read('www/v11/studio/studio.css');
for(const id of ['reviewPacket','createCheckpoint','restoreCheckpoint','checkpointList','reviewGateStatus','reviewMetrics','reviewIssues']){
 assert.ok(html.includes('id="'+id+'"'),'Missing review UI '+id);
}
for(const marker of ['reviewControls(','updateReviewGate()','governance.mark(','governance.createCheckpoint(','governance.createPacket(','saveReviews()']){
 assert.ok(editor.includes(marker),'Editor must expose '+marker);
}
assert.ok(html.indexOf('src="./governance.js"')<html.indexOf('src="./editor.js"'),'Governance must load before Editor');
assert.ok(html.includes('self-attested')||html.includes('self-attested records')||html.includes('self-attested')||
 html.includes('self-attest'),'UI must disclose self-attestation');
assert.ok(!html.includes('id="publishDraft"'),'No public publishing controls');
new Script(editor,{filename:'editor.js'});
assert.ok(css.includes('@media(max-width:720px)'),'Review UI must support mobile');
console.log('V11.4 governance QA PASS: source/scene/asset attestations, stale invalidation, six local checkpoints, export packet and no publish path.');
