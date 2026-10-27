#!/usr/bin/env node
// Read-only V7 Alpha 01 release smoke checks: verifies baseline preservation and route assets.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {Script} from 'node:vm';
const root = path.resolve(import.meta.dirname, '..');
const read = p => fs.readFileSync(path.join(root,p), 'utf8');
const html = read('www/v7/index.html');
const css = read('www/v7/styles.css');
const js = read('www/v7/app.js');
const v6 = fs.readFileSync(path.join(root,'www/index.html'));
const sha = createHash('sha256').update(v6).digest('hex');
assert.equal(sha,'2988addb825d5021c343e2969157ac602fbbf5db795821390c547705e9189cb7','Frozen V6 cannot change.');
const story = read('www/story-first/index.html');
assert.ok(story.includes('id="origin15"') && story.includes('id="origin16"'),'Story-First 1.6 must remain intact.');
for (const name of ['view-journey','view-studio','view-notebook','experience','storyFrame','legacyFrame','stage','distance','lightLevel','saveExperiment','notesList','exportNotes','closeExperience']) {
  assert.ok(html.includes('id="' + name + '"'),'Missing V7 UI anchor: '+name);
}
assert.ok(html.includes('./app.js') && html.includes('./styles.css'),'V7 assets must be relative to /v7/.');
assert.ok(js.includes("'/story-first/'") && js.includes("ui.legacy.src = '/'"),'V7 must connect real existing experiences.');
assert.ok(js.includes('localStorage') && js.includes('URL.createObjectURL'),'Notebook must persist and support export.');
assert.ok(css.includes('prefers-reduced-motion') && css.includes('@media(max-width:650px)'),'Responsive and motion accommodations required.');
new Script(js,{filename:'www/v7/app.js'});
assert.ok(!html.includes('https://fonts.') && !html.includes('https://cdn.'),'V7 should have no third-party runtime dependency.');
console.log('V7 Alpha 01 static checks passed: frozen V6 SHA, original Story-First, routes, labs, notebook, JavaScript syntax, responsive CSS.');
