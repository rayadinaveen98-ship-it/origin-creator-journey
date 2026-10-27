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

 await page.goto(base+'/v10/journey/act6/#scene-12',{waitUntil:'domcontentloaded'});
 await page.locator('#next').click();
 assert.equal(await page.locator('#completion').isVisible(),true);
 await page.locator('.complete-primary').click();
 await page.waitForURL('**/v10/journey/act7/#scene-0',{timeout:12000});
 assert.match(await page.locator('#actName').textContent(),/ACT VII/);
 assert.match(await page.locator('#yearPlace').textContent(),/1984/);
 assert.match(await page.locator('#storyLead').textContent(),/Ghare Baire/);
 assert.equal(await page.locator('#railCaption').textContent(),'01 / 12');
 await page.waitForTimeout(950);
 await page.screenshot({path:'artifacts/origin-v10-act7-opening-desktop.png'});
 for(const width of [1440,1180,960,800]){
  await page.setViewportSize({width,height:900});
  const measure=await page.evaluate(()=>{
   const art=document.querySelector('#filmStage').getBoundingClientRect();
   const copy=document.querySelector('#sceneCopy').getBoundingClientRect();
   const nav=document.querySelector('.controls').getBoundingClientRect();
   return {artLeft:art.left,textRight:copy.right,navBottom:nav.bottom,windowHeight:innerHeight};
  });
  assert.ok(measure.artLeft>=measure.textRight-5,'Act VII text/art overlap at '+width+': '+JSON.stringify(measure));
  assert.ok(measure.navBottom<=measure.windowHeight+2,'Act VII bottom controls below fold at '+width+': '+JSON.stringify(measure));
 }
 await page.setViewportSize({width:1440,height:900});
 await page.locator('#mapButton').click();
 assert.equal(await page.locator('#mapList button').count(),12);
 assert.equal(await page.locator('.life-arc-link').count(),8);
 assert.match(await page.locator('.life-arc-link').nth(6).textContent(),/YOU ARE HERE/);
 assert.match(await page.locator('.life-arc-link').nth(7).textContent(),/CINEMATIC ACT/);

 await page.locator('#mapList button').nth(1).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('Sandip Ray'));
 await page.locator('#contextButton').click();
 assert.match(await page.locator('#documentaryNote').textContent(),/heart attacks/);
 assert.match(await page.locator('#imageExplanation').textContent(),/ORIGINAL/);
 await page.locator('[data-close="contextDialog"]').click();

 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(3).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('Sukumar Ray'));
 assert.equal(await page.locator('#observeButton').isVisible(),true);
 await page.locator('#observeButton').click();
 assert.equal(await page.locator('#exerciseNote').isVisible(),true);
 assert.match(await page.locator('#exerciseNote').textContent(),/Original tonal contrast/);
 await page.locator('#observeButton').click();
 await page.waitForTimeout(950);
 await page.screenshot({path:'artifacts/origin-v10-act7-father-desktop.png'});

 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(8).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('Agantuk'));
 await page.waitForTimeout(950);
 await page.screenshot({path:'artifacts/origin-v10-act7-agantuk-desktop.png'});
 await page.reload({waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('#railCaption').textContent(),'09 / 12','Exact scene persists independently');

 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(9).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('Academy Award'));
 await page.locator('#contextButton').click();
 assert.match(await page.locator('#documentaryNote').textContent(),/1991 \(64th\)/);
 assert.match(await page.locator('#sourceLinks').textContent(),/Oscars/);
 await page.locator('[data-close="contextDialog"]').click();
 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(10).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('Bharat Ratna'));
 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(11).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('23 April 1992'));
 assert.equal(await page.locator('#railCaption').textContent(),'12 / 12');

 await page.setViewportSize({width:390,height:844});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForTimeout(950);
 await page.screenshot({path:'artifacts/origin-v10-act7-mobile.png',fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=2,'Act VII mobile horizontal overflow');

 await page.locator('#next').click();
 assert.equal(await page.locator('#completion').isVisible(),true);
 assert.equal(await page.locator('.complete-primary').getAttribute('href'),'/v10/journey/act8/#scene-0');
 await page.locator('#restart').click();
 assert.match(await page.locator('#storyLead').textContent(),/Ghare Baire/);
 await page.locator('.reader-logo').click();
 await page.waitForURL('**/v10/');
 await page.locator('#welcome').waitFor({state:'hidden',timeout:9000});
 assert.equal(await page.locator('#continueShelf').isVisible(),true);
 assert.match(await page.locator('#continueSub').textContent(),/Act VII/);
 await page.locator('#continueCard').click();
 await page.waitForURL('**/v10/journey/act7/#scene-0',{timeout:11000});
 assert.deepEqual(errors,[],'No uncaught JS exceptions');
 console.log('Act VII browser QA PASS: 12 scenes, Act VI handoff, sources, Academy date, desktop and mobile, framing demo, map and exact progress.');
}finally{
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
}
