/* ORIGIN V10 — Act II: The Artist (1940–1943)
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
 {label:'Satyajit Ray Archive — At Santiniketan (1940–42)',url:'https://satyajitray.org/at-shantiniketan/'},
 {label:'Satyajit Ray Archive — Biography',url:'https://satyajitray.org/biography/'},
 {label:'Satyajit Ray Society — Biography',url:'https://www.satyajitraysociety.org/biography.html'}
];
const scenes=[
 {year:'1940',place:'SANTINIKETAN',name:'The world widens',mode:'threshold',
  title:'The city recedes.<br><em>A new world opens.</em>',
  lead:'In 1940, Ray left the familiarity of Calcutta to study art at Santiniketan.',
  more:'He was initially reluctant. His mother wanted him to continue studying, and he respected Rabindranath Tagore. At Visva-Bharati, a different education was waiting.',
  meaning:'The next stage of his journey did not begin on a film set. It began by stepping outside the world he knew.',
  history:'Ray joined Visva-Bharati at Santiniketan in 1940 to study art, despite early reluctance. This campus is not visually reconstructed here: the opening uses original abstract landscape art.',
  visual:'Original editorial landscape and typographic forms. Not a photograph of Santiniketan in 1940.',
  prompt:'A NEW PLACE',asset:null,assetLink:null,
  bg:'radial-gradient(ellipse at 76% 38%,#967f5c,#536351 30%,#24372d 59%,#0b1310 97%)',sources:[0,1]},
 {year:'1940',place:'BEYOND CALCUTTA',name:'The eye learns',mode:'observe',
  title:'The artist began<br><em>to look closer.</em>',
  lead:'Sketching excursions took the city-raised student into nearby villages and landscapes.',
  more:'The discipline was observation: to look beyond the first impression, noticing how a place was made of shapes, textures and small ordinary details.',
  meaning:'Learning to notice is not a special effect. It is patient attention that can later shape any visual art.',
  history:'The Ray Archive describes sketching trips into neighbouring villages as among Ray’s first encounters with rural India. The geometric landscape here is an original illustration for visual observation; it is not one of his sketches.',
  visual:'Original conceptual landscape made from lines and layered forms. Tap “Notice the details” to isolate one region of the composition. No historic sketch or lesson is being reproduced.',
  prompt:'DRAWING FROM LIFE',asset:null,assetLink:null,observe:true,
  bg:'radial-gradient(ellipse at 64% 50%,#7f8c75,#43584b 32%,#192a23 70%,#0a1210 100%)',sources:[0]},
 {year:'1940–41',place:'AT THE ART SCHOOL',name:'The teachers',mode:'teachers',
  title:'Great teachers.<br><em>Different ways of seeing.</em>',
  lead:'He encountered the work and teaching of Nandalal Bose and Binode Behari Mukherjee.',
  more:'They introduced him to artistic traditions and ways of looking that extended beyond the European masters he already knew. Years later, Ray would make a documentary about Binode Behari.',
  meaning:'An education can change not only what an artist knows, but what an artist considers worth looking at.',
  history:'Ray studied at Santiniketan, where Nandalal Bose and Binode Behari Mukherjee were influential teachers. Ray later made the 1972 documentary The Inner Eye on Mukherjee.',
  visual:'Original pair of abstract drawing fields. These are not portraits of the teachers or reproductions of their artworks.',
  prompt:'A SHIFT IN PERSPECTIVE',asset:null,assetLink:null,
  bg:'radial-gradient(ellipse at 65% 45%,#9e8967,#4b5049 32%,#1c2b28 76%,#090f0e 100%)',sources:[0,1]},
 {year:'1940–41',place:'DISCOVERING ART',name:'More than one tradition',mode:'art',
  title:'A bigger world<br><em>inside the image.</em>',
  lead:'Indian sculpture and miniature paintings, Japanese woodcuts and Chinese landscapes expanded his understanding of art.',
  more:'His interests were no longer confined to the traditions he had known in Calcutta. Small gestures and carefully placed details could carry greater meaning.',
  meaning:'The lesson is not that one style is superior, but that a visual storyteller can learn to see through many traditions.',
  history:'The Satyajit Ray Archive identifies Ray’s growing interest in Indian sculpture and miniature painting, Japanese woodcuts and Chinese landscapes during his Santiniketan years.',
  visual:'Original graphic elements built to suggest scale, negative space and detail. No historical artwork, print or manuscript is reproduced.',
  prompt:'SEE THE SMALL THINGS',asset:null,assetLink:null,observe:true,
  bg:'radial-gradient(ellipse at 63% 29%,#af9a73,#5b594a 38%,#1a2a27 81%)',sources:[0]},
 {year:'1941–42',place:'ART ACROSS INDIA',name:'Journey beyond the classroom',mode:'journey',
  title:'The classroom<br><em>became a journey.</em>',
  lead:'Travel to sites of Indian artistic heritage confronted Ray with works he had previously known less directly.',
  more:'The itinerary included places such as Ajanta, Ellora and Elephanta. Looking at art where it was made brought the lessons of form, tradition and attention beyond books.',
  meaning:'The world beyond a classroom can become part of a creator’s vocabulary.',
  history:'Ray visited major Indian sites of artistic heritage with fellow students during the Santiniketan period. Accounts name Ajanta, Ellora, Elephanta and other sites; this scene does not reconstruct a particular trip or make claims about his exact reactions at each location.',
  visual:'Original visual motif of parallel journeys and curved paths. It is not a photo of Ajanta, a travel map or a representation of any historical itinerary.',
  prompt:'LEARNING FROM THE WORLD',asset:null,assetLink:null,
  bg:'radial-gradient(ellipse at 69% 38%,#9b795b,#625b45 31%,#243531 75%,#0b1412)',sources:[0,2]},
 {year:'1941–42',place:'THE OTHER LOVE',name:'Art and cinema together',mode:'cinema',
  title:'He studied art.<br><em>He never stopped loving cinema.</em>',
  lead:'Alongside painting and drawing, Ray listened to Western classical music and read books about film.',
  more:'Music, movie theory and a library of ideas kept cinema close, even before filmmaking seemed a realistic career. He was building a wider mind, not following a predetermined path.',
  meaning:'His eye, ear and curiosity developed together — through several arts, not through film alone.',
  history:'The Ray Archive describes Ray listening to Western classical records and finding cinema books such as Paul Rotha’s Film Till Now and Raymond Spottiswoode’s Grammar of the Film at Santiniketan. Neither music nor books are reproduced here.',
  visual:'Original abstract projector-light and radial-score composition; no book cover, sound recording or copyrighted film clip.',
  prompt:'THE ARTIST AND THE CINEPHILE',asset:null,assetLink:null,
  bg:'radial-gradient(ellipse at 75% 47%,#bda47e,#555c52 35%,#182928 73%,#0a1110)',sources:[0]},
 {year:'DECEMBER 1942',place:'RETURNING TO CALCUTTA',name:'Leaving Santiniketan',mode:'return',
  title:'The education stays.<br><em>He goes home.</em>',
  lead:'In December 1942, Ray left Santiniketan without completing the full course.',
  more:'He missed Calcutta, its films and its cultural life. War was changing the city, and he was ready to move toward work. What he had learned would travel with him.',
  meaning:'A chapter can be formative even when it does not end in a diploma.',
  history:'The Ray Archive records his departure in December 1942 and the wartime situation in Calcutta. It does not mean Santiniketan had failed him; this is an editorial reading of the transition.',
  visual:'Original departure/threshold illustration. No depiction of the actual train, city bombing or any documented private farewell is implied.',
  prompt:'THE RETURN',asset:null,assetLink:null,
  bg:'radial-gradient(ellipse at 63% 32%,#7e6650,#3a4742 50%,#0c1715 91%)',sources:[0,2]},
 {year:'APRIL 1943',place:'CALCUTTA',name:'The professional artist',mode:'work',
  title:'The student<br><em>becomes a working artist.</em>',
  lead:'In April 1943, Ray joined the advertising agency D. J. Keymer as a junior visualiser.',
  more:'For now his creative work belonged to design, layouts, illustration and typography. The film camera was still in the future — but his visual language was already being formed.',
  meaning:'The journey into cinema passes through working life. Act III will examine the designs, cinema society and influences that came before his first feature.',
  history:'Ray joined D. J. Keymer in April 1943. This final moment is the transition to Act III, not a recreated first day in the office. The visual design and date are editorial.',
  visual:'Original typographic/advertising-inspired arrangement, not an authentic 1943 D. J. Keymer advertisement or a Ray-designed poster.',
  prompt:'THE NEXT CHAPTER',asset:null,assetLink:null,
  bg:'radial-gradient(ellipse at 70% 39%,#ad8d68,#665848 38%,#24312b 73%,#0a1110)',sources:[0,1,2]}
];
const storeKey='origin_v10_act2_scene_v1';
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
 $('visualOrigin').textContent=scene.asset?'ARCHIVAL PHOTO · DATE EXPLAINED IN CONTEXT':'ORIGINAL VISUAL INTERPRETATION · NOT AN ARCHIVAL PHOTOGRAPH';
 const obs=$('observeButton');obs.hidden=!scene.observe;obs.textContent='Notice the details ◎';obs.setAttribute('aria-pressed','false');$('visualDetail').hidden=true;stage.classList.remove('observing');
 $('storyPrompt').textContent=scene.prompt;
 $('railCaption').textContent=String(current+1).padStart(2,'0')+' / 08';
 $('railYear').textContent=scene.year;
 $('railFill').style.height=Math.round((current+1)/scenes.length*100)+'%';
 $('railFill').style.width=Math.round((current+1)/scenes.length*100)+'%';
 $('prev').disabled=current===0;
 if(current===0){$('prev').disabled=false;$('prev').setAttribute('aria-label','Return to the final scene of Act I');}else{$('prev').setAttribute('aria-label','Previous scene');}
 $('nextLabel').textContent=current===scenes.length-1?'Finish Act II':'Continue the story';
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
$('prev').addEventListener('click',()=>{if(current===0)window.location.assign('/v10/journey/#scene-7');else move(current-1);});
$('next').addEventListener('click',()=>{if(current===scenes.length-1)complete();else move(current+1);});
$('restart').addEventListener('click',restart);
 $('observeButton').addEventListener('click',()=>{if(!scenes[current].observe)return;const active=!stage.classList.contains('observing');stage.classList.toggle('observing',active);$('visualDetail').hidden=!active;$('observeButton').setAttribute('aria-pressed',String(active));$('observeButton').textContent=active?'See the whole image again ↗':'Notice the details ◎';});
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
