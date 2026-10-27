#!/usr/bin/env node
// Headless browser acceptance test for the isolated /v7/ preview.
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const root=path.resolve(import.meta.dirname,'..','www');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const candidate=path.resolve(root, '.' + pathname,pathname.endsWith('/')?'index.html':'');
    if(!candidate.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    const file=fs.statSync(candidate).isDirectory()?path.join(candidate,'index.html'):candidate;
    res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
    fs.createReadStream(file).on('error',()=>res.writeHead(404).end()).pipe(res);
  }catch{res.writeHead(404).end();}
});
let browser;
const waitServer=()=>new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try{
  await waitServer();
  const url='http://127.0.0.1:'+server.address().port+'/v7/';
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
  const errs=[];
  page.on('pageerror',err=>errs.push(err.message));
  await page.goto(url,{waitUntil:'load'});
  assert.match(await page.title(),/ORIGIN \/ V7 Alpha/);
  assert.equal(await page.locator('#view-journey').isVisible(),true);
  await page.locator('.top-nav [data-view="studio"]').click();
  assert.equal(await page.locator('#view-studio').isVisible(),true);
  await page.locator('#distance').evaluate(el=>{el.value='80';el.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.equal(await page.locator('#distanceValue').textContent(),'80%');
  assert.match(await page.locator('#compositionReading').textContent(),/emptiness dominates/);
  await page.locator('.studio-tabs [data-lab="lighting"]').click();
  await page.locator('#lightLevel').evaluate(el=>{el.value='22';el.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.match(await page.locator('#lightingReading').textContent(),/room disappears/);
  await page.locator('#labReflection').fill('Dimming the frame made the room feel abandoned.');
  await page.locator('#saveExperiment').click();
  assert.match(await page.locator('#studioStatus').textContent(),/Saved/);
  await page.locator('.top-nav [data-view="notebook"]').click();
  assert.equal(await page.locator('#savedCount').textContent(),'1');
  assert.match(await page.locator('.note-card').textContent(),/room feel abandoned/);
  await page.reload({waitUntil:'load'});
  await page.locator('.top-nav [data-view="notebook"]').click();
  assert.equal(await page.locator('#savedCount').textContent(),'1','Local notebook survives reload');
  const dl=page.waitForEvent('download');
  await page.locator('#exportNotes').click();
  assert.equal((await dl).suggestedFilename(),'origin-v7-discoveries.json');
  await page.locator('.top-nav [data-view="journey"]').click();
  await page.locator('[data-experience="story"]').first().click();
  await page.locator('#storyFrame').evaluate(el=>new Promise((resolve,reject)=>{
    if(el.contentDocument?.readyState==='complete' && el.contentDocument?.location.href!=='about:blank'){resolve();return;}
    el.addEventListener('load',resolve,{once:true});setTimeout(()=>reject(new Error('Story iframe failed to load')),20000);
  }));
  assert.equal(await page.locator('#experience').isVisible(),true);
  assert.equal(await page.locator('#storyFrame').isVisible(),true);
  assert.ok((await page.locator('#storyFrame').getAttribute('src')).includes('/story-first/'));
  assert.equal(await page.locator('#bridgeToStudio').isVisible(),true);
  await page.locator('#bridgeToStudio').click();
  assert.equal(await page.locator('#experience').isVisible(),false);
  assert.equal(await page.locator('#view-studio').isVisible(),true);
  assert.equal(await page.locator('#lab-composition').isVisible(),true);
  await page.locator('#openLegacyStudio').click();
  assert.equal(await page.locator('#legacyFrame').isVisible(),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#experience').isVisible(),false);
  await page.locator('#view-studio [data-experience="story"]').click();
  assert.equal(await page.locator('#storyFrame').isVisible(),true);
  await page.locator('#closeExperience').click();
  await mkdir(path.resolve(root,'../artifacts'),{recursive:true});
  await page.locator('.top-nav [data-view="journey"]').click();
  await page.screenshot({path:path.resolve(root,'../artifacts/origin-v7-desktop.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.resolve(root,'../artifacts/origin-v7-mobile.png'),fullPage:true});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=2,'Mobile viewport horizontal overflow: '+overflow);
  assert.deepEqual(errs,[],'JavaScript runtime errors found.');
  console.log('V7 browser QA passed: navigation, labs, notebook persistence/export, connected story/V6 overlays, mobile viewport and no JS errors.');
} finally {
  if(browser) await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
