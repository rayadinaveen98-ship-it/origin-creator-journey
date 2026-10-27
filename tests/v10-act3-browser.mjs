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
    const file=path.resolve(root,'.'+pathname,pathname.endsWith('/')?'index.html':'');
    if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    const actual=fs.statSync(file).isDirectory()?path.join(file,'index.html'):file;
    res.setHeader('Content-Type',types[path.extname(actual)]||'application/octet-stream');
    fs.createReadStream(actual).on('error',()=>{if(!res.headersSent)res.writeHead(404);res.end();}).pipe(res);
  }catch{res.writeHead(404).end();}
});
let browser;
try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await mkdir('artifacts',{recursive:true});

 // Act II must lead to the playable Act III, with no return to the old article reader.
 await page.goto(base+'/v10/journey/act2/#scene-7',{waitUntil:'domcontentloaded'});
 await page.locator('#next').click();
 assert.equal(await page.locator('#completion').isVisible(),true);
 await page.locator('.complete-primary').click();
 await page.waitForURL('**/v10/journey/act3/#scene-0',{timeout:12000});
 assert.match(await page.locator('#actName').textContent(),/ACT III/);
 assert.match(await page.locator('#yearPlace').textContent(),/1943/);
 assert.match(await page.locator('#storyTitle').textContent(),/artist/);
 assert.equal(await page.locator('#printedArt').isVisible(),true);
 assert.match(await page.locator('#printEyebrow').textContent(),/NOT A RAY DESIGN/);
 await page.waitForTimeout(900);
 await page.screenshot({path:'artifacts/origin-v10-act3-opening-desktop.png'});

 // This interaction explores design choices without presenting an invented Ray work.
 const titleBefore=await page.locator('#printTitle').textContent();
 await page.locator('#observeButton').click();
 const titleAfter=await page.locator('#printTitle').textContent();
 assert.notEqual(titleAfter,titleBefore);
 assert.equal(await page.locator('#observeButton').getAttribute('aria-pressed'),'true');
 await page.locator('#observeButton').click();
 assert.equal(await page.locator('#printTitle').textContent(),titleBefore);

 // Historical context is accessible and clearly identifies original interpretive graphics.
 await page.locator('#contextButton').click();
 assert.match(await page.locator('#documentaryNote').textContent(),/D. J. Keymer/);
 assert.match(await page.locator('#imageExplanation').textContent(),/ORIGINAL/);
 await page.locator('[data-close="contextDialog"]').click();

 // Life map explains the entire life without misrepresenting incomplete cinematic acts.
 await page.locator('#mapButton').click();
 assert.equal(await page.locator('#mapList button').count(),11);
 assert.equal(await page.locator('.life-arc-link').count(),8);
 assert.match(await page.locator('.life-arc-link').nth(2).textContent(),/YOU ARE HERE/);
 assert.match(await page.locator('.life-arc-link').nth(3).textContent(),/RESEARCHED OVERVIEW/);
 await page.locator('#mapList button').nth(2).click();
 await page.waitForFunction(()=>document.querySelector('#storyTitle')?.textContent?.includes('Apu'));
 assert.match(await page.locator('#storyLead').textContent(),/Pather Panchali/);
 await page.waitForTimeout(950);
 await page.screenshot({path:'artifacts/origin-v10-act3-apu-desktop.png'});
 await page.reload({waitUntil:'domcontentloaded'});
 assert.match(await page.locator('#storyTitle').textContent(),/Apu/,'Act III exact scene position persists');

 // Film Society -> Renoir -> London -> De Sica -> return ship -> threshold.
 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(3).click();
 await page.waitForFunction(()=>document.querySelector('#storyTitle')?.textContent?.includes('pastime'));
 assert.match(await page.locator('#storyLead').textContent(),/Film Society/);
 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(6).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('Renoir'));
 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(8).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('Bicycle Thieves'));
 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(9).click();
 await page.waitForFunction(()=>document.querySelector('#storyLead')?.textContent?.includes('journey'));
 await page.locator('#mapButton').click();
 await page.locator('#mapList button').nth(10).click();
 await page.waitForFunction(()=>document.querySelector('#storyTitle')?.textContent?.includes('obstacles'));
 assert.equal(await page.locator('#railCaption').textContent(),'11 / 11');

 // Mobile must keep controls accessible without horizontal overflow.
 await page.setViewportSize({width:390,height:844});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForTimeout(900);
 await page.screenshot({path:'artifacts/origin-v10-act3-mobile.png',fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=2,'Act III mobile overflow');

 await page.locator('#next').click();
 assert.equal(await page.locator('#completion').isVisible(),true);
 assert.equal(await page.locator('.complete-primary').getAttribute('href'),'/v10/journey/act4/#scene-0');
 await page.locator('#restart').click();
 assert.match(await page.locator('#storyTitle').textContent(),/artist/);
 await page.locator('.reader-logo').click();
 await page.waitForURL('**/v10/');
 await page.locator('#welcome').waitFor({state:'hidden',timeout:9000});
 assert.equal(await page.locator('#continueShelf').isVisible(),true);
 assert.match(await page.locator('#continueSub').textContent(),/Act III/);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=2,'V10 mobile home overflow');
 await page.locator('#continueCard').click();
 await page.waitForURL('**/v10/journey/act3/#scene-0',{timeout:11000});
 assert.deepEqual(errors,[],'No JS runtime errors during Act II -> Act III -> home');
 console.log('Act III QA PASS: direct continuity, editorial graphics, interactions, eleven moments, sources, full-life map, persistent scenes and mobile.');
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
