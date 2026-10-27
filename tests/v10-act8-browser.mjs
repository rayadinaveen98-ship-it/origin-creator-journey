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
try {
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await mkdir('artifacts',{recursive:true});

 // The last part of Ray's life must hand directly to the cinematic legacy act.
 await page.goto(base+'/v10/journey/act7/#scene-11',{waitUntil:'domcontentloaded'});
 await page.locator('#next').click();
 assert.equal(await page.locator('#completion').isVisible(),true);
 await page.locator('.complete-primary').click();
 await page.waitForURL('**/v10/journey/act8/#scene-0',{timeout:12000});
 assert.match(await page.locator('#actName').textContent(),/ACT VIII/);
 assert.match(await page.locator('#storyTitle').textContent(),/films survived/);
 assert.equal(await page.locator('#railCaption').textContent(),'01 / 10');
 await page.waitForTimeout(900);
 await page.screenshot({path:'artifacts/origin-v10-act8-opening-desktop.png'});

 // Ensure chapters are all playable, with no overview misrepresentation.
 await page.locator('#mapButton').click();
 assert.equal(await page.locator('#mapList button').count(),10);
 assert.equal(await page.locator('.life-arc-link').count(),8);
 assert.match(await page.locator('.life-arc-link').nth(7).textContent(),/YOU ARE HERE/);
 for(let i=0;i<7;i++) assert.match(await page.locator('.life-arc-link').nth(i).textContent(),/CINEMATIC ACT/);
 await page.locator('[data-close="mapDialog"]').click();

 // Desktop & tablet long-title/art navigation safeguards.
 for(const width of [1440,1180,960,800]){
  await page.setViewportSize({width,height:900});
  const rect=await page.evaluate(()=>{
   const art=document.querySelector('#filmStage').getBoundingClientRect();
   const copy=document.querySelector('#sceneCopy').getBoundingClientRect();
   const nav=document.querySelector('.controls').getBoundingClientRect();
   return {artLeft:art.left,textRight:copy.right,navBottom:nav.bottom,h:innerHeight};
  });
  assert.ok(rect.artLeft>=rect.textRight-5,'Act VIII art overlaps reading column at '+width+': '+JSON.stringify(rect));
  assert.ok(rect.navBottom<=rect.h+2,'Act VIII navigation below fold at '+width+': '+JSON.stringify(rect));
 }
 await page.setViewportSize({width:1440,height:900});

 // Historical events and an explicit disclaimer that comparison is not real restored footage.
 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(1).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('1993'));
 assert.equal(await page.locator('#stage').getAttribute('data-mode'),'fire');
 assert.equal(await page.locator('#observeButton').isVisible(),true);
 await page.locator('#observeButton').click();
 assert.equal(await page.locator('#observeButton').getAttribute('aria-pressed'),'true');
 assert.match(await page.locator('#exerciseNote').textContent(),/fictional strip/);
 await page.waitForTimeout(800);
 await page.screenshot({path:'artifacts/origin-v10-act8-fire-desktop.png'});
 await page.locator('#observeButton').click();
 assert.equal(await page.locator('#exerciseNote').isVisible(),false);
 await page.locator('#contextButton').click();
 assert.match(await page.locator('#documentaryNote').textContent(),/laboratory fire/);
 assert.match(await page.locator('#imageExplanation').textContent(),/ORIGINAL/);
 assert.match(await page.locator('#sourceLinks').textContent(),/Criterion/);
 await page.locator('[data-close="contextDialog"]').click();

 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(2).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('Society'));
 await page.locator('#contextButton').click();
 assert.match(await page.locator('#documentaryNote').textContent(),/14 December 1993/);
 await page.locator('[data-close="contextDialog"]').click();

 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(4).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('Satyajit Ray Society'));
 await page.waitForTimeout(850);
 await page.screenshot({path:'artifacts/origin-v10-act8-archive-desktop.png'});

 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(5).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('2015'));
 await page.locator('#contextButton').click();
 assert.match(await page.locator('#documentaryNote').textContent(),/8 May 2015/);
 await page.locator('[data-close="contextDialog"]').click();

 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(7).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('Aranyer Din Ratri'));
 await page.locator('#contextButton').click();
 assert.match(await page.locator('#documentaryNote').textContent(),/2025/);
 await page.locator('[data-close="contextDialog"]').click();
 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(8).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('SFFILM'));
 await page.locator('#contextButton').click();
 assert.match(await page.locator('#documentaryNote').textContent(),/26 March 2026/);
 await page.locator('[data-close="contextDialog"]').click();
 await page.reload({waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('#railCaption').textContent(),'09 / 10','Persist exact Act VIII moment');

 // Last scene returns to the exact beginning of Act I, not an unrelated reader.
 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(9).click();
 await page.waitForFunction(()=>document.querySelector('#storyTitle')?.textContent?.includes('began with a boy'));
 await page.waitForTimeout(800);
 await page.screenshot({path:'artifacts/origin-v10-act8-ending-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForTimeout(800);
 await page.screenshot({path:'artifacts/origin-v10-act8-ending-mobile.png',fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=2,'Act VIII mobile horizontal overflow');
 await page.locator('#next').click();
 assert.equal(await page.locator('#completion').isVisible(),true);
 assert.equal(await page.locator('.complete-primary').getAttribute('href'),'/v10/journey/#scene-0');
 await page.locator('.complete-primary').click();
 await page.waitForURL('**/v10/journey/#scene-0',{timeout:12000});
 assert.match(await page.locator('#storyTitle').textContent(),/beginning/i);

 // A future visit must still preserve independent last-act progress.
 await page.locator('.reader-logo').click();
 await page.waitForURL('**/v10/');
 await page.locator('#welcome').waitFor({state:'hidden',timeout:9000});
 assert.equal(await page.locator('#continueShelf').isVisible(),true);
 assert.match(await page.locator('#continueSub').textContent(),/Act VIII/);
 await page.locator('#continueCard').click();
 await page.waitForURL('**/v10/journey/act8/#scene-9',{timeout:11000});
 assert.deepEqual(errors,[],'Legacy act should have no uncaught client errors');
 console.log('Act VIII QA PASS: 10 researched moments, 8 cinematic acts, simulated preservation, desktop/mobile, sources, full journey loop and exact resume.');
}finally{
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
}
