import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const root=path.resolve(import.meta.dirname,'..','www');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=http.createServer((req,res)=>{
 try{
  const name=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const file=path.resolve(root,'.'+name,name.endsWith('/')?'index.html':'');
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
  fs.createReadStream(file).on('error',()=>res.end()).pipe(res);
 }catch{res.writeHead(404).end();}
});
let browser;
try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url='http://127.0.0.1:'+server.address().port+'/life/';
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const exceptions=[];page.on('pageerror',e=>exceptions.push(e.message));
 await page.goto(url,{waitUntil:'domcontentloaded'});
 assert.match(await page.title(),/A Life in Frames/);
 assert.match(await page.locator('#sceneTitle').textContent(),/lifetime of cinema/);
 assert.match(await page.locator('#orientationText').textContent(),/1992/);
 // Photograph is important; if Commons is inaccessible, the UI must still work.
 await page.waitForTimeout(1700);
 const photo=await page.locator('#sceneImage').evaluate(img=>({loaded:img.naturalWidth>0,width:img.naturalWidth}));
 console.log('Prologue Wikimedia portrait: ',photo);
 if(!photo.loaded)console.log('WARNING: Remote Commons image unavailable; photo fallback was shown.');
 await page.screenshot({path:'/tmp/origin-life-prologue.png'});
 await page.locator('#nextButton').click();
 assert.match(await page.locator('#sceneEra').textContent(),/1921/);
 assert.match(await page.locator('#sceneTitle').textContent(),/stories/);
 assert.match(await page.locator('#photoCaption').textContent(),/1914/);
 await page.waitForTimeout(800);
 await page.locator('#interaction button').first().click();
 assert.ok((await page.locator('#choiceResult').textContent()).length>20);
 await page.screenshot({path:'/tmp/origin-life-family.png'});
 await page.locator('#helpButton').click();
 assert.equal(await page.locator('#helpDialog').isVisible(),true);
 await page.locator('[data-close="helpDialog"]').first().click();
 assert.equal(await page.locator('#helpDialog').isVisible(),false);
 await page.locator('#overviewButton').click();
 assert.equal(await page.locator('#timelineDialog').isVisible(),true);
 assert.ok(await page.locator('#timelineList button').count()>=8);
 await page.locator('#timelineList button[data-index="14"]').click();
 assert.match(await page.locator('#sceneTitle').textContent(),/health changed/);
 assert.equal(await page.locator('#sceneImage').isVisible(),false);
 assert.equal(await page.locator('#imageFallback').isVisible(),true);
 await page.locator('#nextButton').click();
 assert.match(await page.locator('#sceneEra').textContent(),/1992/);
 await page.locator('#nextButton').click();
 assert.match(await page.locator('#sceneEra').textContent(),/PROLOGUE/);
 await page.locator('#nextButton').click();
 await page.reload({waitUntil:'domcontentloaded'});
 assert.match(await page.locator('#sceneEra').textContent(),/1921/,'browser progress resumes');
 await page.setViewportSize({width:390,height:844});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.screenshot({path:'/tmp/origin-life-mobile.png',fullPage:true});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 assert.ok(overflow<=2,'mobile overflow '+overflow);
 assert.deepEqual(exceptions,[],'Uncaught JavaScript errors');
 console.log('V8 UX QA PASSED: real images/fallback, readable scene, chronology, interactions, timeline, guides, persisted position, mobile.');
 await mkdir('artifacts',{recursive:true});
 for(const [source,dest] of [['/tmp/origin-life-prologue.png','artifacts/origin-life-prologue.png'],['/tmp/origin-life-family.png','artifacts/origin-life-family.png'],['/tmp/origin-life-mobile.png','artifacts/origin-life-mobile.png']])fs.copyFileSync(source,dest);
} finally {
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
