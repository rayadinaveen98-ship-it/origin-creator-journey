import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const root=path.resolve(import.meta.dirname,'..','www');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=http.createServer((req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const fp=path.resolve(root,'.'+p,p.endsWith('/')?'index.html':'');
  if(!fp.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  const actual=fs.statSync(fp).isDirectory()?path.join(fp,'index.html'):fp;
  res.setHeader('Content-Type',types[path.extname(actual)]||'application/octet-stream');
  fs.createReadStream(actual).on('error',()=>{if(!res.headersSent)res.writeHead(404);res.end();}).pipe(res);
 }catch{res.writeHead(404).end();}
});


let browser;
try{
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await mkdir('artifacts',{recursive:true});

 // Act V must flow into the cinematic new Act VI rather than reverting to the older life overview.
 await page.goto(base+'/v10/journey/act5/#scene-12',{waitUntil:'domcontentloaded'});
 await page.locator('#next').click();
 assert.equal(await page.locator('#completion').isVisible(),true);
 await page.locator('.complete-primary').click();
 await page.waitForURL('**/v10/journey/act6/#scene-0',{timeout:11000});
 assert.match(await page.locator('#actName').textContent(),/ACT VI/);
 assert.match(await page.locator('#yearPlace').textContent(),/1970/);
 assert.match(await page.locator('#storyTitle').textContent(),/city was restless/);
 assert.equal(await page.locator('#railCaption').textContent(),'01 / 13');
 await page.waitForTimeout(950);
 await page.screenshot({path:'artifacts/origin-v10-act6-city-desktop.png'});

 // Strong text/art separation at desktop & tablet widths.
 for(const width of [1440,1180,960,800]){
  await page.setViewportSize({width,height:900});
  const position=await page.evaluate(()=>{
   const art=document.querySelector('#filmStage').getBoundingClientRect();
   const text=document.querySelector('#sceneCopy').getBoundingClientRect();
   return {artLeft:art.left,textRight:text.right};
  });
  assert.ok(position.artLeft>=position.textRight-5,'Art crosses copy at '+width+'px: '+JSON.stringify(position));
 }
 await page.setViewportSize({width:1440,height:900});
 await page.locator('#mapButton').click();
 assert.equal(await page.locator('#mapList button').count(),13);
 assert.equal(await page.locator('.life-arc-link').count(),8);
 assert.match(await page.locator('.life-arc-link').nth(5).textContent(),/YOU ARE HERE/);
 assert.match(await page.locator('.life-arc-link').nth(7).textContent(),/CINEMATIC ACT/);

 // Famine and documentary moments explicitly separate original artwork from historical evidence.
 await page.locator('#mapList button').nth(4).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('Ashani Sanket'));
 await page.locator('#contextButton').click();
 assert.match(await page.locator('#documentaryNote').textContent(),/Golden Bear/);
 assert.match(await page.locator('#imageExplanation').textContent(),/Original|original/);
 await page.locator('[data-close="contextDialog"]').click();
 await page.locator('#observeButton').click();
 assert.equal(await page.locator('#observeButton').getAttribute('aria-pressed'),'true');
 assert.equal(await page.locator('#exerciseNote').isVisible(),true);
 await page.locator('#observeButton').click();
 assert.equal(await page.locator('#exerciseNote').isVisible(),false);

 // The Feluda journey should receive a different desert composition and an on-demand clue study.
 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(5).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('Sonar Kella'));
 assert.equal(await page.locator('#stage').getAttribute('data-mode'),'desert');
 await page.waitForTimeout(900);
 const desertNav=await page.evaluate(()=>({
   bottom:document.querySelector('.controls').getBoundingClientRect().bottom,
   viewport:window.innerHeight,
   scroll:document.documentElement.scrollHeight
 }));
 assert.ok(desertNav.bottom<=desertNav.viewport+2,'Desert scene bottom controls must remain visible without scrolling: '+JSON.stringify(desertNav));
 await page.screenshot({path:'artifacts/origin-v10-act6-desert-desktop.png'});
 await page.locator('#observeButton').click();
 assert.match(await page.locator('#exerciseNote').textContent(),/Original clue-selection/);
 await page.locator('#observeButton').click();

 // Chess is original symbolism, not a photograph or actual historical movie set.
 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(8).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('Shatranj Ke Khilari'));
 assert.equal(await page.locator('#stage').getAttribute('data-mode'),'chess');
 await page.locator('#contextButton').click();
 assert.match(await page.locator('#documentaryNote').textContent(),/Premchand/);
 assert.match(await page.locator('#imageExplanation').textContent(),/original|Original/);
 await page.locator('[data-close="contextDialog"]').click();
 await page.waitForTimeout(900);
 await page.screenshot({path:'artifacts/origin-v10-act6-chess-desktop.png'});
 await page.reload({waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('#railCaption').textContent(),'09 / 13','Exact scene persists');

 // Next thematic pivot, next documentary and truthful health/1984 boundary.
 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(10).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('Hirak Rajar Deshe'));
 assert.equal(await page.locator('#stage').getAttribute('data-mode'),'kingdom');
 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(11).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('Sadgati'));
 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(12).click();
 await page.waitForFunction(()=>document.querySelector('#storyTitle')?.textContent?.includes('conditions changed'));
 await page.locator('#contextButton').click();
 assert.match(await page.locator('#documentaryNote').textContent(),/1984/);
 await page.locator('[data-close="contextDialog"]').click();

 // Mobile viewport + progress + complete Act VI and return home.
 await page.setViewportSize({width:390,height:844});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForTimeout(950);
 await page.screenshot({path:'artifacts/origin-v10-act6-mobile.png',fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=2,'Act VI mobile horizontal overflow');
 await page.locator('#next').click();
 assert.equal(await page.locator('#completion').isVisible(),true);
 assert.equal(await page.locator('.complete-primary').getAttribute('href'),'/v10/journey/act7/#scene-0');
 await page.locator('#restart').click();
 assert.match(await page.locator('#storyTitle').textContent(),/city was restless/);
 await page.locator('.reader-logo').click();
 await page.waitForURL('**/v10/');
 await page.locator('#welcome').waitFor({state:'hidden',timeout:9000});
 assert.equal(await page.locator('#continueShelf').isVisible(),true);
 assert.match(await page.locator('#continueSub').textContent(),/Act VI/);
 await page.locator('#continueCard').click();
 await page.waitForURL('**/v10/journey/act6/#scene-0',{timeout:11000});
 assert.deepEqual(errors,[],'No uncaught browser errors');
 console.log('Act VI QA PASS: 13 scenes, continuity, historical provenance, 3 crafted settings, desktop/tablet, mobile, exact resume, eight-act map.');
}finally{
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
}
