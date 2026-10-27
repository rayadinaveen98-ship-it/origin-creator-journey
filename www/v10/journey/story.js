/* ORIGIN V10 — Act I: The Boy (1921–1939)
   Historical scenes are grounded in archives. Visual metaphors are explicitly labeled.
   No invented dialogue, no impersonation, no film frames.
*/
(() => {
'use strict';
const $=id=>document.getElementById(id);
const CHILD='https://upload.wikimedia.org/wikipedia/commons/8/86/Satyajit_ray_little.jpg';
const PARENTS='https://upload.wikimedia.org/wikipedia/commons/0/0c/Sukumar_Ray_and_his_wife.jpg';
const YOUNG='https://upload.wikimedia.org/wikipedia/commons/4/42/Satyajit-Ray-Young.jpg';
const archive=[
 {label:'The Satyajit Ray Archive — Growing Up',url:'https://satyajitray.org/growing-up/'},
 {label:'The Satyajit Ray Society — Biography',url:'https://www.satyajitraysociety.org/biography.html'},
 {label:'The Satyajit Ray Archive — Biography',url:'https://satyajitray.org/biography/'}
];
const scenes=[
 {year:'1921',place:'CALCUTTA',name:'A beginning',mode:'birth',
  title:'Before cinema.<br><em>A beginning.</em>',
  lead:'On 2 May 1921, a boy named Satyajit was born in Calcutta.',
  more:'The world would come to know his films. But first, there was a child growing up among books, drawings and stories.',
  meaning:'This journey begins with the human life, not with an already-famous director.',
  history:'Biographical records place Satyajit Ray’s birth in Calcutta on 2 May 1921. The introductory landscape is an original typographic treatment, not a 1921 city photograph.',
  visual:'Original graphic composition based on the year 1921. No historical photograph is represented.',
  prompt:'THE BEGINNING',asset:null,assetLink:null,
  bg:'radial-gradient(ellipse at 61% 44%,#755b3e 0%,#304034 38%,#101e19 73%,#090e0c 100%)',sources:[0,1]},
 {year:'1921',place:'A FAMILY OF ARTISTS',name:'The storytellers',mode:'family',
  title:'Stories were already <em>in the family.</em>',
  lead:'Satyajit was born to Sukumar Ray and Suprabha Ray.',
  more:'His father wrote and illustrated imaginative Bengali literature. His grandfather, Upendrakishore, had worked across writing, illustration, music and printing.',
  meaning:'The visual world that surrounded his family existed decades before Ray directed a film.',
  history:'Sukumar Ray was a writer and illustrator; Upendrakishore Ray Chowdhury was a writer, illustrator and pioneer in printing. The accompanying photograph depicts Sukumar and Suprabha, not baby Satyajit.',
  visual:'Sukumar Ray and Suprabha Ray in a portrait dated 1914 — seven years before Satyajit’s birth. It illustrates family history, not the birth itself.',
  prompt:'BEFORE THE FILMS',asset:PARENTS,assetLink:'https://commons.wikimedia.org/wiki/File:Sukumar_Ray_and_his_wife.jpg',
  bg:'radial-gradient(ellipse at 66% 37%,#665749,#1b2623 65%,#090c0b)',sources:[0,1]},
 {year:'1923',place:'CALCUTTA',name:'A loss',mode:'loss',
  title:'At two,<br><em>his father was gone.</em>',
  lead:'Sukumar Ray died in September 1923. Satyajit was only two years old.',
  more:'His mother, Suprabha, would raise him. The biographies tell us what happened; they cannot tell us every private feeling of a child that young.',
  meaning:'This moment is an essential part of his family history, but we should never manufacture a dramatic conversation or a precise childhood memory.',
  history:'Sukumar Ray died in September 1923. The scene uses an empty visual space as an editorial metaphor; it is not a recreation of the family home.',
  visual:'Original abstract composition expressing absence. No photographic record of the event is implied.',
  prompt:'A CHANGE IN THE FAMILY',asset:null,assetLink:null,
  bg:'radial-gradient(ellipse at 65% 55%,#46372f 0%,#1b2323 32%,#0a0f10 80%)',sources:[0,1]},
 {year:'MID-1920s',place:'CALCUTTA',name:'A different home',mode:'move',
  title:'The world around him <em>changed.</em>',
  lead:'As family circumstances shifted, Satyajit and his mother left their larger family home.',
  more:'Suprabha supplemented the household income through needlework. The young boy continued growing up among relatives, objects and images in Calcutta.',
  meaning:'The biography has ordinary realities—family, home, work and change—before it becomes a filmmaking story.',
  history:'Accounts of Ray’s childhood describe the family’s financial and residential changes after the decline of the family publishing and printing enterprise. A single exact moving-day date is not claimed here.',
  visual:'Original architectural light-and-shadow illustration. Not a documented view of Ray’s home.',
  prompt:'THE YEARS OF GROWING',asset:null,assetLink:null,
  bg:'radial-gradient(ellipse at 69% 25%,#76614a,#2e3a30 47%,#0b1512 88%)',sources:[0]},
 {year:'AROUND 1930',place:'A CURIOUS CHILD',name:'Learning to see',mode:'wonder',
  title:'He had an eye for <em>wonder.</em>',
  lead:'Books, pictures and visual devices helped fill his childhood world.',
  more:'Biographical accounts describe his interest in things that changed the way an image was seen—including stereoscopic pictures and a magic lantern.',
  meaning:'The child’s visual curiosity matters. It is part of a long formation, not proof of a single instant when he “became” a filmmaker.',
  history:'Ray’s early exposure to books, visual curiosities and image-viewing devices is documented in accounts of his childhood. We do not claim that the photograph shows him using any device.',
  visual:'Satyajit Ray as a child, portrait dated about 1930. The picture does not document an interaction with a magic lantern.',
  prompt:'THE WAY OF SEEING',asset:CHILD,assetLink:'https://commons.wikimedia.org/wiki/File:Satyajit_ray_little.jpg',
  bg:'radial-gradient(ellipse at 62% 29%,#8b775f,#364238 52%,#101615 95%)',sources:[0]},
 {year:'1930s',place:'SCHOOL YEARS',name:'A love of movies',mode:'cinema',
  title:'Then came<br><em>the moving image.</em>',
  lead:'At school, Ray became increasingly fascinated by cinema.',
  more:'He watched movies, read about them and began paying attention to how scenes, performances and cuts created feeling. For now, he was a viewer—learning to look.',
  meaning:'Before the first film he directed, there were many films he watched closely.',
  history:'Biographies and Ray’s 1992 Academy acceptance speech describe his early love of cinema. This projected-light visual is an original graphic, not footage from a film Ray saw.',
  visual:'Original cinematic illustration using light and abstract geometry. Not an archival projection or a copyrighted film still.',
  prompt:'THE FIRST SCREEN',asset:null,assetLink:null,
  bg:'radial-gradient(ellipse at 76% 38%,#b6976a,#3a433b 34%,#0d1719 78%)',sources:[0,2]},
 {year:'1939',place:'A CROSSROADS',name:'The next question',mode:'threshold',
  title:'Cinema fascinated him.<br><em>Art called too.</em>',
  lead:'Ray completed his studies at Presidency College in 1939.',
  more:'His future did not yet look like the career of a film director. He was interested in commercial art, and his mother encouraged him to study at Santiniketan.',
  meaning:'A filmmaker’s beginnings can be indirect. His creative education would continue outside cinema.',
  history:'The Satyajit Ray Archive’s biography describes his graduation and subsequent art studies. The image is a portrait of a young Ray dated approximately 1940–1943, not a photograph of his 1939 graduation.',
  visual:'Young Satyajit Ray, a portrait whose recorded date is approximately 1940–1943; its exact year is uncertain. It is a period reference, not an image from his graduation.',
  prompt:'A CHOICE AHEAD',asset:YOUNG,assetLink:'https://commons.wikimedia.org/wiki/File:Satyajit-Ray-Young.jpg',
  bg:'radial-gradient(ellipse at 72% 38%,#92775e,#344339 54%,#111715 90%)',sources:[0,2]},
 {year:'1940',place:'THE THRESHOLD',name:'Where the boy goes',mode:'threshold',
  title:'The boy becomes<br><em>an artist in waiting.</em>',
  lead:'The next part of his life would widen his world of drawing, design and visual observation.',
  more:'Santiniketan, advertising and serious film study still lay ahead. The camera—and Pather Panchali—would come later.',
  meaning:'Act I ends with potential, not achievement. We follow a person growing into the work, rather than defining him only by its outcome.',
  history:'Ray studied at Santiniketan starting around 1940, worked in advertising from 1943, and began the filming journey of Pather Panchali years later. This is the narrative transition between our acts.',
  visual:'Original symbolic doorway and typographic artwork for the transition between life chapters.',
  prompt:'END OF ACT I',asset:null,assetLink:null,
  bg:'radial-gradient(ellipse at 64% 28%,#92795b,#3d483a 46%,#111b17 89%)',sources:[0,2]}
];
const storeKey='origin_v10_act1_scene_v1';
const stage=$('stage'),img=$('archiveImage'),copy=$('sceneCopy');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let current=0,changing=false,focusReturn=null;
try{const saved=localStorage.getItem(storeKey);if(saved!==null){const v=Number(saved);if(Number.isInteger(v)&&v>=0&&v<scenes.length)current=v;}}catch{}
const hashMatch=/^#scene-(\d+)$/.exec(location.hash);
if(hashMatch && +hashMatch[1] < scenes.length)current=+hashMatch[1];
function persist(){try{localStorage.setItem(storeKey,String(current));}catch{}}
function render(){
 const scene=scenes[current];
 stage.dataset.mode=scene.mode;stage.dataset.photo=String(!!scene.asset);
 stage.style.setProperty('--stage-bg',scene.bg);
 $('symbolicYear').textContent=scene.year.replace('AROUND ','').replace('MID-','');
 $('yearPlace').textContent=scene.place+' · '+scene.year;
 $('beatId').textContent=String(current+1).padStart(2,'0')+' / 08';
 $('storyTitle').innerHTML=scene.title;
 $('storyLead').textContent=scene.lead;
 $('storyMore').textContent=scene.more;
 $('visualOrigin').textContent=scene.asset?'ARCHIVAL PORTRAIT · DATE EXPLAINED IN CONTEXT':'ORIGINAL EDITORIAL ART · NOT AN ARCHIVAL IMAGE';
 $('storyPrompt').textContent=scene.prompt;
 $('railCaption').textContent=String(current+1).padStart(2,'0')+' / 08';
 $('railYear').textContent=scene.year;
 $('railFill').style.height=Math.round((current+1)/scenes.length*100)+'%';
 $('railFill').style.width=Math.round((current+1)/scenes.length*100)+'%';
 $('prev').disabled=current===0;
 $('nextLabel').textContent=current===scenes.length-1?'Finish Act I':'Continue the story';
 $('contextEra').textContent=scene.place+' · '+scene.year;
 $('imageExplanation').textContent=scene.visual;
 $('documentaryNote').textContent=scene.history;
 $('editorialMeaning').textContent=scene.meaning;
 $('photoSource').hidden=!scene.assetLink;
 if(scene.assetLink)$('photoSource').href=scene.assetLink;
 const links=$('sourceLinks');links.replaceChildren();
 for(const index of scene.sources){const source=archive[index];const a=document.createElement('a');a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=source.label+' ↗';links.append(a);}
 if(scene.asset){
   $('archiveUnavailable').hidden=true;
   img.hidden=false;
   if(img.getAttribute('src')!==scene.asset)img.src=scene.asset;
   img.alt=scene.visual;
   if(img.complete&&img.naturalWidth===0){img.hidden=true;$('archiveUnavailable').hidden=false;}
 }else{img.hidden=true;$('archiveUnavailable').hidden=true;}
 document.querySelectorAll('#dots button').forEach((b,i)=>{b.classList.toggle('current',i===current);b.setAttribute('aria-current',i===current?'step':'false');});
 document.querySelectorAll('#mapList button').forEach((b,i)=>{if(i===current)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 history.replaceState(null,'','#scene-'+current);persist();
}
img.addEventListener('error',()=>{if(scenes[current].asset && img.src===scenes[current].asset){img.hidden=true;$('archiveUnavailable').hidden=false;}});
img.addEventListener('load',()=>{if(scenes[current].asset && img.src===scenes[current].asset){img.hidden=false;$('archiveUnavailable').hidden=true;}});
function move(next){
 if(changing||next<0||next>=scenes.length)return;
 changing=true;
 stage.classList.add('changing');
 const update=()=>{
  current=next;render();stage.classList.remove('changing');
  copy.style.animation='none';void copy.offsetWidth;copy.style.animation='';
  $('storyTitle').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
  changing=false;
 };
 if(reduceMotion)update();else setTimeout(update,165);
}
function complete(){
 if(changing)return;
 stage.hidden=true;$('completion').hidden=false;
 window.scrollTo({top:0,behavior:'instant'});$('completeTitle').focus?.();
}
function restart(){
 $('completion').hidden=true;stage.hidden=false;
 current=0;render();$('storyTitle').focus({preventScroll:true});
}
for(let i=0;i<scenes.length;i++){
 const d=document.createElement('button');d.type='button';d.setAttribute('aria-label','Go to scene '+(i+1)+': '+scenes[i].name);d.addEventListener('click',()=>move(i));$('dots').append(d);
 const b=document.createElement('button');b.type='button';const date=document.createElement('span');date.className='map-year';date.textContent=scenes[i].year;
 const label=document.createElement('span');label.className='map-name';label.textContent=scenes[i].name;const flag=document.createElement('span');flag.className='map-stage';flag.textContent=String(i+1).padStart(2,'0')+'/08';
 b.append(date,label,flag);b.addEventListener('click',()=>{$('mapDialog').close();move(i);});$('mapList').append(b);
}
$('prev').addEventListener('click',()=>move(current-1));
$('next').addEventListener('click',()=>{if(current===scenes.length-1)complete();else move(current+1);});
$('restart').addEventListener('click',restart);
function showDialog(which,trigger){focusReturn=trigger;$(which).showModal();}
function closeDialog(which){$(which).close();if(focusReturn?.isConnected)focusReturn.focus();}
$('mapButton').addEventListener('click',e=>showDialog('mapDialog',e.currentTarget));
$('contextButton').addEventListener('click',e=>showDialog('contextDialog',e.currentTarget));
$('whyButton').addEventListener('click',e=>showDialog('contextDialog',e.currentTarget));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(b.dataset.close)));
document.addEventListener('keydown',e=>{
 const tag=e.target?.tagName;
 if($('mapDialog').open||$('contextDialog').open||tag==='INPUT'||tag==='TEXTAREA')return;
 if(e.key==='ArrowRight'&&current<scenes.length-1){e.preventDefault();move(current+1);}
 if(e.key==='ArrowLeft'&&current>0){e.preventDefault();move(current-1);}
});
window.addEventListener('hashchange',()=>{const m=/^#scene-(\d+)$/.exec(location.hash);if(m&&+m[1]<scenes.length)move(+m[1]);});
render();
})();
