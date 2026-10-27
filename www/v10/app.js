/* ORIGIN / V10 — cinematic discovery shell, V9 welcome logic preserved.
 * Film and creator journeys are editorial experiences, NOT licensed streaming content.
 * No external JavaScript libraries or user accounts.
 */
(() => {
'use strict';
const $=id=>document.getElementById(id);
const welcome=$('welcome'), app=$('app'), splashCanvas=$('particleCanvas');
const ENTRY_DURATION=2450, INTRO_DURATION=3380;
const KEY_INTRO='origin_v10_opening_seen',KEY_SAVED='origin_v9_mylist_ray',KEY_PROGRESS='origin_v10_act1_scene_v1';
const PR=matchMedia('(prefers-reduced-motion: reduce)').matches;
let entering=false;
function memoryGet(storage,key){try{return storage.getItem(key);}catch{return null;}}
function memorySet(storage,key,value){try{storage.setItem(key,value);}catch{}}
function storedMoment(){const v=Number(memoryGet(localStorage,KEY_PROGRESS));return Number.isInteger(v)&&v>=0&&v<16?v:null;}
function isSaved(){return memoryGet(localStorage,KEY_SAVED)==='1';}
function act2Moment(){
 const stored=memoryGet(localStorage,'origin_v10_act2_scene_v1');
 if(stored===null)return null;
 const n=Number(stored);
 return Number.isInteger(n)&&n>=0&&n<8?n:null;
}
function syncProgress(){
 const m2=act2Moment();
 const raw1=memoryGet(localStorage,KEY_PROGRESS);
 const m1=raw1===null?null:storedMoment();
 if(m2!==null){
   $('continueShelf').hidden=false;
   $('heroEnterText').textContent="Continue Ray's Journey";
   $('featureProgressNote').textContent='Act II · The Artist — your exact scene is saved in this browser.';
   $('continueHeading').textContent=['The world widens','The eye learns','The teachers','More than one tradition','Beyond the classroom','Art and cinema','Leaving Santiniketan','The professional artist'][m2];
   $('continueSub').textContent='Act II · Scene '+(m2+1)+' of 8 · 1940–1943';
   $('continueFill').style.width=Math.round((8+m2+1)/16*100)+'%';
 }else if(m1!==null&&m1>0){
   $('continueShelf').hidden=false;
   $('heroEnterText').textContent="Continue Ray's Journey";
   $('featureProgressNote').textContent='Resume Act I — The Boy, 1921–1939.';
   $('continueHeading').textContent=['The Beginning','A family of storytellers','The loss','A different home','Books and images','Discovering cinema','A wider world','The threshold'][m1]||'Continue Act I';
   $('continueSub').textContent='Act I · Scene '+(m1+1)+' of 8 · 1921–1939';
   $('continueFill').style.width=Math.round((m1+1)/16*100)+'%';
 }else{
   $('continueShelf').hidden=true;
   $('heroEnterText').textContent="Enter Ray's Journey";
   $('featureProgressNote').textContent='Begin in Calcutta, 1921 — before any of the films.';
 }
}
function syncList(){
 const saved=isSaved();
 $('saveLabel').textContent=saved?'✓ Saved to My List':'+ Add to My List';
 $('libraryStatus').textContent=saved?'Satyajit Ray is in your collection':'Keep Ray\'s journey in your collection';
 $('libraryExplain').textContent=saved?'Open the featured journey above whenever you are ready. Your list is saved on this browser.':'Save this creator to find his story easily the next time you visit.';
}
function navigate(which){
 const target={home:'main',journeys:'journeysSection',library:'librarySection'}[which];
 if(!target)return;
 document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('nav-active',b.dataset.nav===which));
 const el=$(target);
 if(which==='home')window.scrollTo({top:0,behavior:PR?'instant':'smooth'});
 else el.scrollIntoView({block:'start',behavior:PR?'instant':'smooth'});
}
function pause(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
async function reveal(){
 const seen=memoryGet(sessionStorage,KEY_INTRO)==='1';
 if(seen){welcome.hidden=true;app.classList.add('ready');app.setAttribute('aria-hidden','false');return;}
 app.inert=true;
 await pause(PR?120:INTRO_DURATION);
 welcome.classList.add('is-finished');
 app.classList.add('ready');app.inert=false;app.setAttribute('aria-hidden','false');
 memorySet(sessionStorage,KEY_INTRO,'1');
 await pause(PR?50:650);
 welcome.hidden=true;
}
function beginAnimation(){
 if(PR)return;
 const ctx=splashCanvas.getContext('2d');if(!ctx)return;
 const dpr=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;
 splashCanvas.width=w*dpr;splashCanvas.height=h*dpr;ctx.scale(dpr,dpr);
 const buffer=document.createElement('canvas'), b=buffer.getContext('2d');
 const sw=Math.min(w,700),sh=Math.min(h,280);
 buffer.width=sw;buffer.height=sh;
 b.font='bold '+Math.min(115,sw/6)+'px Georgia';b.textAlign='center';b.textBaseline='middle';b.fillText('ORIGIN',sw/2,sh/2);
 const data=b.getImageData(0,0,sw,sh).data,targets=[];
 for(let y=0;y<sh;y+=7)for(let x=0;x<sw;x+=7)if(data[(y*sw+x)*4+3]>90)targets.push([w/2-sw/2+x,h/2-sh/2+y]);
 const sampleCount=Math.min(460,targets.length);
 const particles=Array.from({length:sampleCount},(_,i)=>{
  const t=targets[(i*17)%targets.length]||[w/2,h/2];
  const side=i%4;
  return {x:side===0?Math.random()*w:side===1?-30:side===2?w+30:Math.random()*w,
   y:side===3?h+30:side===0?-30:Math.random()*h,tx:t[0],ty:t[1],
   r:.45+Math.random()*1.4,shade:i%8,phase:Math.random()*6.28};
 });
 let start=0,handle=0;
 function frame(ts){
  if(welcome.hidden||welcome.classList.contains('is-finished')){cancelAnimationFrame(handle);return;}
  if(!start)start=ts;const progress=Math.min(1,(ts-start)/2700);
  ctx.clearRect(0,0,w,h);
  const ease=1-Math.pow(1-progress,3);
  for(const p of particles){
   const tx=p.tx+Math.sin(ts/750+p.phase)*1.9,ty=p.ty+Math.cos(ts/840+p.phase)*1.9;
   p.x+=(tx-p.x)*Math.max(.008,.018+ease*.035);
   p.y+=(ty-p.y)*Math.max(.008,.018+ease*.035);
   ctx.fillStyle=p.shade<3?'rgba(244,211,165,.70)':p.shade<6?'rgba(224,230,212,.53)':'rgba(179,141,112,.75)';
   ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
  }
  handle=requestAnimationFrame(frame);
 }
 handle=requestAnimationFrame(frame);
}
function journeyTarget(type){
 if(type==='childhood')return {path:'/v10/journey/',moment:0};
 if(type==='artist')return {path:'/v10/journey/act2/',moment:act2Moment()??0};
 if(type==='firstfilm')return {path:'/life/',moment:10};
 const m2=act2Moment();
 if(m2!==null)return {path:'/v10/journey/act2/',moment:m2};
 const v=memoryGet(localStorage,KEY_PROGRESS);
 const m1=v===null?0:storedMoment();
 return {path:'/v10/journey/',moment:m1??0};
}
async function enter(type='life'){
 if(entering)return;
 entering=true;
 const target=journeyTarget(type);
 const overlay=$('entry');
 overlay.hidden=false;
 app.inert=true;
 document.body.classList.add('entering');
 const fragment=target.path==='/life/'?'#moment-':'#scene-';
 const url=target.path+fragment+target.moment;
 await pause(PR?120:ENTRY_DURATION);
 window.location.assign(url);
}
function openAbout(){
 $('infoDialog').showModal();
}
function installSearch(){
 const results=[
  {label:'Satyajit Ray',detail:'Living Act I · 1921–1939',kind:'life'},
  {label:'The boy · 1921–1939',detail:'The new cinematic childhood chapter',kind:'childhood'},
  {label:'The artist · 1940–1950',detail:'Later overview (V8 reader)',kind:'artist'},
  {label:'Making the first film',detail:'Later overview (V8 reader)',kind:'firstfilm'},
  {label:'Film journey · 1955–1959',detail:'The first five years in cinema',kind:'film'},
  {label:'The Studio',detail:'Interactive filmmaking exercises',kind:'studio'}
 ];
 const panel=$('searchPanel');
 function renderSearch(query){
  const host=$('searchResults');host.replaceChildren();
  const term=query.toLowerCase().trim();
  const hits=results.filter(item=>(item.label+' '+item.detail).toLowerCase().includes(term));
  if(!hits.length){const p=document.createElement('p');p.textContent='No matching experiences yet. We are building the creator library one journey at a time.';host.append(p);return;}
  hits.forEach(item=>{
   const b=document.createElement('button');b.type='button';
   const strong=document.createElement('strong');strong.textContent=item.label;
   const small=document.createElement('small');small.textContent=item.detail;
   b.append(strong,small);
   b.addEventListener('click',()=>{
    closeSearch();
    if(item.kind==='film')window.location.assign('/story-first/');
    else if(item.kind==='studio')window.location.assign('/v7/');
    else enter(item.kind);
   });host.append(b);
  });
 }
 function closeSearch(){panel.hidden=true;$('searchToggle').setAttribute('aria-expanded','false');$('searchToggle').focus();}
 $('searchToggle').addEventListener('click',()=>{
  const open=panel.hidden;panel.hidden=!open;$('searchToggle').setAttribute('aria-expanded',String(open));
  if(open){renderSearch('');$('searchInput').focus();}
 });
 $('closeSearch').addEventListener('click',closeSearch);
 $('searchInput').addEventListener('input',()=>renderSearch($('searchInput').value));
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!panel.hidden)closeSearch();
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(panel.hidden)$('searchToggle').click();else $('searchInput').focus();}
 });
}
$('heroEnter').addEventListener('click',()=>enter('life'));
$('continueCard').addEventListener('click',()=>enter('life'));
document.querySelectorAll('[data-enter]').forEach(el=>el.addEventListener('click',()=>enter(el.dataset.enter)));
document.querySelectorAll('[data-nav]').forEach(el=>el.addEventListener('click',()=>navigate(el.dataset.nav)));
$('heroInfo').addEventListener('click',openAbout);$('aboutToggle').addEventListener('click',openAbout);$('missionInfo').addEventListener('click',openAbout);
$('closeInfo').addEventListener('click',()=>$('infoDialog').close());
$('dialogEnter').addEventListener('click',()=>{$('infoDialog').close();enter('life');});
$('saveButton').addEventListener('click',()=>{memorySet(localStorage,KEY_SAVED,isSaved()?'0':'1');syncList();});
$('featurePortrait').addEventListener('error',()=>{
 $('featurePortrait').hidden=true;$('heroFallback').hidden=false;
});
window.addEventListener('scroll',()=>{$('topbar').classList.toggle('scrolled',scrollY>28);},{passive:true});
window.addEventListener('pageshow',()=>{if(entering){entering=false;$('entry').hidden=true;app.inert=false;}syncProgress();syncList();});
syncProgress();syncList();installSearch();beginAnimation();reveal();
})();