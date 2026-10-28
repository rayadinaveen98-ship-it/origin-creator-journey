/* ORIGIN V11 — one data-driven player for any registered creator. */
(()=>{'use strict';
const data=window.ORIGIN_V11;
const $=id=>document.getElementById(id);
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const registry=data.inspect();
let active=null, chapters=[],actIndex=0,sceneIndex=0,transitioning=false;
const el={catalog:$('catalog'),viewer:$('viewer'),stage:$('stage'),image:$('archiveImage'),
 title:$('storyTitle'),lead:$('storyLead'),more:$('storyMore'),context:$('contextDialog'),
 map:$('chaptersDialog'),progress:$('progressBar'),detail:$('detailPanel')};
function create(tag,className,txt){
 const e=document.createElement(tag);
 if(className)e.className=className;
 if(txt!==undefined)e.textContent=txt;
 return e;
}
function escapeHtml(t){return String(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function richTitle(t){
 return escapeHtml(t).replace(/&lt;br\s*\/?&gt;/gi,'<br>').replace(/&lt;(\/?)em&gt;/gi,'<$1em>');
}
function urlOkay(s){try{const x=new URL(s);return x.protocol==='https:'||x.protocol==='http:';}catch{return false;}}
function localGet(key){try{return localStorage.getItem(key);}catch{return null;}}
function localSet(key,value){try{localStorage.setItem(key,value);}catch{}}
function key(id){return 'origin_v11_'+id+'_progress_v1';}
function stored(id){
 try{
  const a=JSON.parse(localGet(key(id))||'null');
  if(a&&Number.isInteger(a.act)&&Number.isInteger(a.scene))return a;
 }catch{}
 if(id==='ray'){
  // Read legacy V10 progress, but never rewrite or delete its keys.
  for(let n=8;n>=1;n--){
   const raw=localGet('origin_v10_act'+n+'_scene_v1');
   const v=Number(raw);
   const list=data.acts(id),total=list[n-1]?.scenes.length||0;
   if(raw!==null&&Number.isInteger(v)&&v>=0&&v<total)return {act:n,scene:v};
  }
 }
 return {act:1,scene:0};
}
function save(){if(active)localSet(key(active.id),JSON.stringify({act:actIndex+1,scene:sceneIndex}));}
function totals(){return chapters.reduce((sum,c)=>sum+c.scenes.length,0);}
function linearPosition(){let i=sceneIndex;for(let n=0;n<actIndex;n++)i+=chapters[n].scenes.length;return i+1;}
function currentScene(){return chapters[actIndex]?.scenes[sceneIndex];}
function locationFor(id,act,scene){
 const u=new URL(location.href);
 u.searchParams.set('person',id);
 u.hash='act='+act+'&scene='+scene;
 return u.pathname+u.search+u.hash;
}
function historyState(mode){
 const url=locationFor(active.id,actIndex+1,sceneIndex);
 if(mode==='push')history.pushState({},'',url);
 else history.replaceState({},'',url);
}
function readHash(){
 const m=/^#act=(\d+)&scene=(\d+)$/.exec(location.hash);
 if(!m)return null;
 return {act:+m[1],scene:+m[2]};
}
function pickValid(place){
 const ix=place.act-1;
 if(!Number.isInteger(ix)||ix<0||ix>=chapters.length)return null;
 if(!Number.isInteger(place.scene)||place.scene<0||place.scene>=chapters[ix].scenes.length)return null;
 return place;
}
function catalog(){
 active=null;chapters=[];el.viewer.hidden=true;el.catalog.hidden=false;
 $('catalogItems').replaceChildren();
 for(const p of data.creators()){
  const b=create('button','journey-card');
  b.type='button';b.setAttribute('aria-label','Enter '+p.name+' journey');
  b.style.setProperty('--creator-accent',p.accent||'#e8c999');
  const surface=create('span','card-art');
  surface.setAttribute('aria-hidden','true');
  surface.append(create('span','card-orbit'),create('span','card-monogram',p.name.split(' ').map(x=>x[0]).join('')));
  const copy=create('span','card-copy');
  copy.append(create('small','card-kicker',p.preview?'DISCOVERY PREVIEW':'FULL CINEMATIC JOURNEY'),create('strong','card-name',p.name),create('span','card-subtitle',p.subtitle));
  const info=registry.find(r=>r.id===p.id);
  copy.append(create('span','card-extent',info.acts+' act'+(info.acts===1?'':'s')+' · '+info.scenes+' moments'));
  b.append(surface,copy);
  b.addEventListener('click',()=>start(p.id,null,'push'));
  $('catalogItems').append(b);
 }
 $('catalogHeading').focus({preventScroll:true});
}
function start(id,where,mode){
 const p=data.creator(id);
 if(!p){catalog();return;}
 active=p;chapters=data.acts(id);
 const chosen=pickValid(where||readHash()||stored(id))||{act:1,scene:0};
 actIndex=chosen.act-1;sceneIndex=chosen.scene;
 el.catalog.hidden=true;el.viewer.hidden=false;$('ending').hidden=true;el.stage.hidden=false;
 buildMap();render(mode||'replace');
}
function render(mode){
 const chapter=chapters[actIndex],s=currentScene();
 if(!s)return;
 el.stage.dataset.kind=String(s.kind||s.mode||'symbol').replace(/[^a-z0-9-]/gi,'').toLowerCase();
 el.stage.dataset.mode=String(s.mode||'symbol').replace(/[^a-z0-9-]/gi,'').toLowerCase();
 el.stage.style.setProperty('--stage-bg',s.bg||'radial-gradient(ellipse at 60% 40%,#685343,#232b33 60%,#0b1016)');
 el.stage.style.setProperty('--accent',active.accent||'#e1b981');
 $('creatorName').textContent=active.name;
 $('creatorDates').textContent=active.years;
 $('chapterName').textContent='ACT '+String(chapter.index).padStart(2,'0')+' · '+chapter.name.toUpperCase();
 $('chapterPeriod').textContent=chapter.period||'';
 $('sceneYear').textContent=s.year;
 $('scenePlace').textContent=s.place+' · '+s.year;
 $('scenePrompt').textContent=s.prompt||'THE STORY CONTINUES';
 $('chapterMeter').textContent=String(sceneIndex+1).padStart(2,'0')+' / '+String(chapter.scenes.length).padStart(2,'0');
 $('totalMeter').textContent=String(linearPosition()).padStart(2,'0')+' / '+String(totals()).padStart(2,'0');
 $('visualFootnote').textContent=s.visual||'Original editorial artwork — not an archival record';
 el.title.innerHTML=richTitle(s.title);
 el.lead.textContent=s.lead;
 el.more.textContent=s.more;
 $('artYear').textContent=s.year;
 const image=s.asset&&urlOkay(s.asset)?s.asset:null;
 el.image.hidden=!image;
 if(image){el.image.alt='Archival illustration; date and provenance are described in Context';el.image.src=image;}
 else el.image.removeAttribute('src');
 el.stage.classList.remove('inspecting');
 el.detail.hidden=true;
 const inspect=$('inspectButton');
 inspect.hidden=!s.observe;
 inspect.textContent=s.craft==='repair'?'Inspect the illustration':'Explore the composition';
 inspect.setAttribute('aria-pressed','false');
 $('prevButton').disabled=actIndex===0&&sceneIndex===0;
 $('nextButton').textContent=sceneIndex===chapter.scenes.length-1?(actIndex===chapters.length-1?'Complete journey ↗':'Enter next act →'):'Next moment →';
 $('progressBar').style.width=(linearPosition()/totals()*100).toFixed(2)+'%';
 $('progressBar').setAttribute('aria-valuenow',String(linearPosition()));
 $('progressBar').setAttribute('aria-valuemax',String(totals()));
 el.stage.classList.toggle('long-title',s.title.replace(/<[^>]*>/g,'').length>55);
 save();if(mode)historyState(mode);
 updateMapActive();
 if(el.title)el.title.focus({preventScroll:true});
 window.scrollTo({top:0,behavior:'instant'});
}
el.image.addEventListener('error',()=>{el.image.hidden=true;});
function showAt(act,scene,mode){
 if(transitioning)return;
 const newPos=pickValid({act,scene});
 if(!newPos)return;
 const go=()=>{actIndex=act-1;sceneIndex=scene;render(mode||'push');transitioning=false;};
 if(reduceMotion){go();return;}
 transitioning=true;
 el.stage.classList.add('changing');
 window.setTimeout(()=>{go();el.stage.classList.remove('changing');},180);
}
function next(){
 const n=chapters[actIndex].scenes.length;
 if(sceneIndex+1<n){showAt(actIndex+1,sceneIndex+1,'push');return;}
 if(actIndex+1<chapters.length){showAt(actIndex+2,0,'push');return;}
 el.stage.hidden=true;$('ending').hidden=false;
 $('endingHeading').textContent=active.preview?'A beginning, not a complete life.':'The journey continues beyond the last frame.';
 $('endingText').textContent=active.preview?'This is a limited, historically sourced discovery preview demonstrating the shared V11 player.':'You have reached the end of the current cinematic biography. The sources and creative work remain open to explore.';
 $('endingHeading').focus({preventScroll:true});
}
function prev(){
 if(sceneIndex>0){showAt(actIndex+1,sceneIndex-1,'push');return;}
 if(actIndex>0)showAt(actIndex,chapters[actIndex-1].scenes.length-1,'push');
}
function buildMap(){
 const host=$('chapterList');host.replaceChildren();
 chapters.forEach((act,ix)=>{
  const heading=create('h3','map-heading','ACT '+String(act.index).padStart(2,'0')+' · '+act.name+' · '+act.period);
  host.append(heading);
  act.scenes.forEach((scene,six)=>{
   const b=create('button','map-scene',String(six+1).padStart(2,'0')+'   '+scene.year+'   '+(scene.name||scene.title.replace(/<[^>]*>/g,'')));
   b.type='button';b.dataset.act=String(ix+1);b.dataset.scene=String(six);
   b.addEventListener('click',()=>{$('chaptersDialog').close();showAt(ix+1,six,'push');});
   host.append(b);
  });
 });
}
function updateMapActive(){
 for(const b of $('chapterList').querySelectorAll('.map-scene')){
  const selected=Number(b.dataset.act)===actIndex+1&&Number(b.dataset.scene)===sceneIndex;
  b.classList.toggle('active',selected);
  if(selected)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');
 }
}
function openContext(){
 const s=currentScene(),chapter=chapters[actIndex];
 $('contextTitle').textContent=s.name||'Story context';
 $('contextFacts').textContent=s.history||'No further documented historical detail supplied.';
 $('contextMeaning').textContent=s.meaning||'';
 $('contextVisual').textContent=s.visual||'Original illustrative interpretation';
 const links=$('contextSources');links.replaceChildren();
 for(const index of (s.sources||[])){
  const source=chapter.archive[index];
  if(!source||!urlOkay(source.url))continue;
  const a=create('a','source-link',source.label+' ↗');
  a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';
  links.append(a);
 }
 if(!links.childElementCount)links.append(create('p','no-sources','No direct sources attached to this scene.'));
 if(s.assetLink&&urlOkay(s.assetLink)){
  const a=create('a','source-link','Image attribution / record ↗');a.href=s.assetLink;a.target='_blank';a.rel='noopener noreferrer';links.append(a);
 }
 el.context.showModal();
}
function detail(){
 const s=currentScene(),on=el.stage.classList.toggle('inspecting');
 $('inspectButton').setAttribute('aria-pressed',String(on));
 $('inspectButton').textContent=on?'Return to complete view':'Explore the composition';
 el.detail.hidden=!on;
 el.detail.textContent=s.craftNote||'Editorial visual study: this crop is an illustrative interaction, not historical footage or the artist’s actual framing.';
}
$('openChapters').addEventListener('click',()=>el.map.showModal());
$('openContext').addEventListener('click',openContext);
$('inspectButton').addEventListener('click',detail);
$('nextButton').addEventListener('click',next);
$('prevButton').addEventListener('click',prev);
$('homeButton').addEventListener('click',()=>{
 history.pushState({},'',location.pathname);
 catalog();
});
$('endingHome').addEventListener('click',()=>{history.pushState({},'',location.pathname);catalog();});
$('endingRestart').addEventListener('click',()=>{el.stage.hidden=false;$('ending').hidden=true;showAt(1,0,'push');});
$('contextClose').addEventListener('click',()=>el.context.close());
$('chaptersClose').addEventListener('click',()=>el.map.close());
document.addEventListener('keydown',event=>{
 if(el.viewer.hidden||el.context.open||el.map.open||$('ending').hidden===false)return;
 if(['BUTTON','INPUT','TEXTAREA','SELECT'].includes(event.target?.tagName))return;
 if(event.key==='ArrowRight'){event.preventDefault();next();}
 if(event.key==='ArrowLeft'){event.preventDefault();prev();}
});
window.addEventListener('popstate',()=>{
 const id=new URLSearchParams(location.search).get('person');
 if(!id||!data.creator(id)){catalog();return;}
 start(id,readHash()||stored(id),null);
});
const id=new URLSearchParams(location.search).get('person');
if(id&&data.creator(id))start(id,readHash()||stored(id),'replace');else catalog();
})();