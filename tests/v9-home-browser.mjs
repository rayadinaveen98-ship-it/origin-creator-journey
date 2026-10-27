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
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const filename=path.resolve(root,'.'+pathname,pathname.endsWith('/')?'index.html':'');
  if(!filename.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  const actual=fs.statSync(filename).isDirectory()?path.join(filename,'index.html'):filename;
  res.setHeader('Content-Type',types[path.extname(actual)]||'application/octet-stream');
  fs.createReadStream(actual).on('error',()=>{if(!res.headersSent)res.writeHead(404);res.end();}).pipe(res);
 }catch{res.writeHead(404).end();}
});
let browser;
try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/app/',{waitUntil:'domcontentloaded'});
 await page.locator('#welcome').waitFor({state:'hidden',timeout:8000});
 assert.equal(await page.locator('#app').isVisible(),true,'splash automatically reveals home');
 assert.match(await page.locator('#featureTitle').textContent(),/Before the films/);
 assert.equal(await page.locator('.creator-tile').count(),3);
 await mkdir('artifacts',{recursive:true});
 await page.screenshot({path:'artifacts/origin-v9-home-desktop.png',fullPage:true});
 await page.locator('#searchToggle').click();
 await page.locator('#searchInput').fill('childhood');
 assert.ok(await page.locator('#searchResults button').count()>=1);
 await page.locator('#closeSearch').click();
 await page.locator('[data-nav="library"]').first().click();
 await page.locator('#saveButton').click();
 assert.match(await page.locator('#saveLabel').textContent(),/Saved to My List/);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('#welcome').waitFor({state:'hidden',timeout:1500});
 assert.match(await page.locator('#saveLabel').textContent(),/Saved to My List/);
 // A returning viewer gets an obvious resumption surface.
 await page.evaluate(()=>localStorage.setItem('origin_v8_life_scene_v1','5'));
 await page.reload({waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('#continueShelf').isVisible(),true);
 assert.match(await page.locator('#heroEnterText').textContent(),/Continue/);
 await page.locator('#heroEnter').click();
 await page.waitForURL('**/life/?from=origin#moment-5',{timeout:11000});
 assert.match(await page.locator('#sceneEra').textContent(),/1939/);
 assert.equal(await page.locator('.origin-home-link').isVisible(),true);
 await page.locator('.origin-home-link').click();
 await page.waitForURL('**/app/');
 assert.equal(await page.locator('#app').isVisible(),true);
 await page.setViewportSize({width:390,height:844});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('#welcome').waitFor({state:'hidden',timeout:2000});
 await page.screenshot({path:'artifacts/origin-v9-home-mobile.png',fullPage:true});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 assert.ok(overflow<=2,'Mobile horizontal overflow: '+overflow);
 assert.equal(await page.locator('.mobile-nav').isVisible(),true);
 await page.locator('.creator-tile[data-enter="childhood"]').click();
 await page.waitForURL('**/life/?from=origin#moment-1',{timeout:11000});
 assert.match(await page.locator('#sceneEra').textContent(),/1921/);
 assert.deepEqual(errors,[],'Uncaught page errors');
 console.log('V9 PASS: opening, desktop/mobile, search, my list, progress, transition, journey and home return.');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
