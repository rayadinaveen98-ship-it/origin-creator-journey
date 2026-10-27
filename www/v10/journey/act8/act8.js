/* ORIGIN V10 — Act VIII: The Legacy (1992–Present)
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
 {label:'Satyajit Ray Society — The Society, 1992–93 origins',url:'https://satyajitraysociety.org/the_society.html'},
 {label:'Satyajit Ray Society — Archive',url:'https://satyajitraysociety.org/archive.html'},
 {label:'Satyajit Ray Society — Restoration work',url:'https://satyajitraysociety.org/restoration.html'},
 {label:'Criterion — Restoring the Apu Trilogy (2015)',url:'https://www.criterion.com/current/posts/3550-restoring-the-apu-trilogy'},
 {label:'Criterion — The Apu Trilogy (restored edition)',url:'https://www.criterion.com/boxsets/1145-the-apu-trilogy'},
 {label:'Academy Museum — Satyajit Ray 2021 retrospective',url:'https://www.academymuseum.org/programs/series/satyajit-ray-1955-1968'},
 {label:'Film Heritage Foundation — Aranyer Din Ratri restored in 4K for Cannes 2025',url:'https://filmheritagefoundation.co.in/film-heritage-foundation-and-martin-scorseses-the-film-foundations-world-cinema-project-join-hands-to-restore-satyajit-rays-landmark-bengali-film-aranyer-din-ratri-1970-supp/'},
 {label:'SFFILM / SFMOMA — Intimate Universes, October 2026',url:'https://sffilm.org/press-releases/sffilm-and-the-san-francisco-museum-of-modern-art-announce-seventh-season-of-modern-cinema-satyajit-ray-intimate-universes-october-4-21/'},
 {label:'Satyajit Ray Archive — Biography',url:'https://satyajitray.org/biography/'},
 {label:'Criterion — Apu Trilogy returned to theatres (2015)',url:'https://www.criterion.com/current/posts/3545-the-apu-trilogy-returns-to-theaters'}
];
const scenes=[
 {year:'DEC 1992',place:'KOLKATA · A WARNING',name:'The fragile negatives',mode:'fragile',kind:'negative',observe:true,craft:'repair',
 title:'The films survived him.<br><em>But would they survive time?</em>',
 lead:'Months after Ray’s death, an Academy-supported inspection examined the condition of film materials in India.',
 more:'Preservation specialist David Shepard’s report drew attention to the precarious state of important film negatives. A film may reach millions and still be lost physically.',
 meaning:'Cinema is an art made of vulnerable materials. Admiration alone cannot preserve a film.',
 history:'The Satyajit Ray Society dates an Academy grants committee initiative to December 1992, when preservation pioneer David Shepard came to inspect films. He examined 18 of Ray’s 36 films. This image is an editorial metaphor, not an actual negative.',
 visual:'ORIGINAL graphic of damaged celluloid, not any surviving Ray camera negative or preservation photograph.',
 prompt:'WHAT COULD BE LOST',craftNote:'Illustrative only: the comparison reduces simulated scratches on a fictional filmstrip. It does not restore, compare or recreate a Ray frame.',
 bg:'radial-gradient(ellipse at 70% 38%,#bdab90,#736553 39%,#21272c 89%)',sources:[0,2]},
 {year:'1993',place:'A LABORATORY FIRE',name:'A fragile inheritance',mode:'fire',kind:'negative',observe:true,craft:'repair',
 title:'Then a fire<br><em>threatened the Apu films.</em>',
 lead:'In 1993, a fire at a London film laboratory severely damaged original negatives from the Apu Trilogy.',
 more:'The burned film elements were kept rather than abandoned. Restoration technologies were not yet adequate to recover all that remained.',
 meaning:'A masterpiece is not immune to accident. Saving a film sometimes begins by refusing to discard damaged materials.',
 history:'Criterion and the Academy Film Archive describe the 1993 London laboratory fire. Film elements from Pather Panchali, Aparajito and Apur Sansar suffered substantial damage. No specific damaged frame is shown.',
 visual:'ORIGINAL firelit, damaged filmstrip illustration. Not actual burned negative, film frame or footage of the 1993 incident.',
 prompt:'THE NEGATIVES AT RISK',craftNote:'An editorial scratch/flicker treatment fades on a fictional strip. It cannot demonstrate the real technical processes used to rescue the Apu negatives.',
 bg:'radial-gradient(ellipse at 72% 34%,#bd6a4a,#795044 45%,#24242a 91%)',sources:[3,4]},
 {year:'SEP–DEC 1993',place:'THE RAY SOCIETY',name:'An organized promise',mode:'society',kind:'archive',
 title:'People organized<br><em>to protect the work.</em>',
 lead:'An effort to preserve Ray’s films became an institution: the Society for the Preservation of Satyajit Ray Films.',
 more:'Its first meeting took place in September 1993; it was formally registered in December. Bijoya Ray was patron, and Sandip Ray became closely involved.',
 meaning:'A legacy survives through people, practical care and continuing collective responsibility.',
 history:'The Society dates its first meeting to 7 September 1993 and registration to 14 December 1993. The idea followed work begun earlier that year; the source distinguishes founding effort from legal registration.',
 visual:'ORIGINAL abstract archive room and document spines. Not the society office, its charter, or photographs of Ray’s family.',
 prompt:'BUILDING AN ARCHIVE',
 bg:'radial-gradient(ellipse at 71% 36%,#c1b7a2,#6c796f 41%,#24322c 89%)',sources:[0,1]},
 {year:'2001',place:'FILMS SAVED REEL BY REEL',name:'Preservation in practice',mode:'restore',kind:'negative',observe:true,craft:'repair',
 title:'A reel at a time,<br><em>the films were repaired.</em>',
 lead:'The Academy Film Archive and Satyajit Ray Society collaborated to restore films including Seemabaddha.',
 more:'Producers, archives and restoration workers helped locate and move film elements so damaged material could be preserved and shown.',
 meaning:'Restoration is long, detailed work, not a single glamorous event.',
 history:'The Society describes an Academy Film Archive announcement dated 9 August 2001 about the completed restoration of Seemabaddha, in collaboration with the Ray Society and the original producers.',
 visual:'ORIGINAL restoration comparison of invented stripes. No copyrighted Ray movie footage, actual filmstrip or historic preservation workstation.',
 prompt:'REPAIRED FRAME BY FRAME',craftNote:'Original before/after illustration with synthetic scratches. Actual film restoration requires specialized scanning, repair, grading and review; this is not a restoration tool.',
 bg:'radial-gradient(ellipse at 65% 41%,#bbac88,#5d6868 44%,#1b3336 89%)',sources:[2]},
 {year:'ONGOING',place:'RAY’S STUDY · THE ARCHIVE',name:'Beyond the films',mode:'papers',kind:'archive',observe:true,craft:'reveal',
 title:'A film was only<br><em>part of what he created.</em>',
 lead:'The Satyajit Ray Society preserves drawings, scripts, title designs, film schedules, letters, music notations and belongings.',
 more:'Ray’s study in the family home is used for archival work. Documents and sketches continue to surface, and the inventory remains an ongoing task.',
 meaning:'To understand an artist, we can study not only the finished work but the evidence of how they thought and made it.',
 history:'The Society lists film scripts, posters, storyboards and drawings, typography, music notations, photographs, letters and possessions in its archive. Its public description says cataloguing and digitisation continue.',
 visual:'ORIGINAL stack of blank archive papers with invented marks, not any Ray design, manuscript, signature or personal belonging.',
 prompt:'THE WORK BEHIND THE WORK',craftNote:'A synthetic paper overlay reveals geometric layers as an educational illustration, not digitisation or a real archival item.',
 bg:'radial-gradient(ellipse at 66% 36%,#cbb996,#827e6d 44%,#253339 92%)',sources:[1]},
 {year:'2015',place:'NEW YORK AND BEYOND',name:'Apu returns to the screen',mode:'projection',kind:'screen',observe:true,craft:'repair',
 title:'From damaged negatives,<br><em>a new screening.</em>',
 lead:'Restored versions of the Apu Trilogy returned to cinemas in 2015, including screenings at New York’s Film Forum.',
 more:'The Academy Film Archive, Criterion and specialist film restorers reconstructed images from surviving elements with extensive technical work.',
 meaning:'Restoration gives audiences renewed access, but it does not replace the fragile material history of a film.',
 history:'Criterion dates the theatrical return of the 4K Apu Trilogy restorations to 8 May 2015. The project involved the Academy Film Archive, the Criterion Collection and L’Immagine Ritrovata.',
 visual:'ORIGINAL cinema-projection and repaired-stripe composition. Not a genuine restored Ray frame or film trailer.',
 prompt:'THE IMAGE RETURNS',craftNote:'Original before/after effect on fictional media. The restored trilogy was assembled from numerous authentic film sources; the app does not reproduce or simulate those originals.',
 bg:'radial-gradient(ellipse at 70% 31%,#d2c4a3,#6b7f7d 42%,#233343 90%)',sources:[3,4,9]},
 {year:'2021',place:'A CENTENARY',name:'A hundred years after birth',mode:'centenary',kind:'tribute',
 title:'One hundred years<br><em>after a boy was born.</em>',
 lead:'Institutions marked the 100th anniversary of Ray’s birth with screenings, retrospectives and renewed study.',
 more:'The Academy Museum presented his work, while Indian cultural institutions organized centenary programmes. New viewers had new opportunities to meet his cinema.',
 meaning:'A centenary is a point of return, not an endpoint for a life’s cultural influence.',
 history:'Ray was born on 2 May 1921. The Academy Museum’s centenary programme ran in late 2021, and India’s Films Division organized the RayToday online festival in May 2021. The image is original ceremonial typography.',
 visual:'ORIGINAL “100 years” typographic light forms, not an official centenary logo, photographic portrait or exhibition poster.',
 prompt:'THE STORY REINTRODUCED',
 bg:'radial-gradient(ellipse at 66% 38%,#d0b98c,#797b72 43%,#2a3c39 91%)',sources:[5,8]},
 {year:'MAY 2025',place:'CANNES CLASSICS',name:'Another film restored',mode:'cannes',kind:'screen',observe:true,craft:'repair',
 title:'Another film<br><em>found its way back.</em>',
 lead:'A 4K restoration of Aranyer Din Ratri premiered at Cannes Classics in May 2025.',
 more:'Film Heritage Foundation, The Film Foundation, Criterion, Janus Films and restoration specialists collaborated on the work, with support from rights holders and the Ray family.',
 meaning:'Preservation is not finished when a famous trilogy is saved. Each title may need its own decades-long effort.',
 history:'Film Heritage Foundation documents the restoration of Aranyer Din Ratri, completed at L’Immagine Ritrovata, and its Cannes Classics 2025 premiere. The film is listed as 1970 in its restoration materials; earlier Ray Archive filmography uses 1969 production dating.',
 visual:'ORIGINAL projected light graphic. Not Cannes festival footage, a restored frame or a film image.',
 prompt:'RESTORATION CONTINUES',craftNote:'Fictional scratch-cleanup demonstration. Actual restoration used original camera and sound negatives and multiple heritage partners.',
 bg:'radial-gradient(ellipse at 70% 36%,#c3b999,#656e76 42%,#202c39 91%)',sources:[6,2]},
 {year:'OCT 2026',place:'SAN FRANCISCO',name:'A new generation of viewers',mode:'cinema',kind:'screen',
 title:'Another audience.<br><em>Another beginning.</em>',
 lead:'SFFILM and the San Francisco Museum of Modern Art programmed a Ray retrospective titled Intimate Universes for October 2026.',
 more:'Their planned series presented fifteen Ray films and their connections to other cinema. Decades after his death, audiences continued to gather around the same images.',
 meaning:'The work is alive whenever people can encounter it, debate it and look again.',
 history:'A SFFILM press announcement dated 26 March 2026 described the series for 4–21 October 2026. This scene does not claim individual screenings all occurred or assert attendance statistics; it describes the announced programme.',
 visual:'ORIGINAL theatre beams and silhouettes only, not event photographs, promotional images or footage from the series.',
 prompt:'THE NEXT VIEWER',
 bg:'radial-gradient(ellipse at 71% 36%,#b2bfbc,#5e7984 45%,#1a2933 92%)',sources:[7]},
 {year:'1921 → NOW',place:'BACK TO THE BEGINNING',name:'The story returns',mode:'return',kind:'tribute',
 title:'It began with a boy.<br><em>Now it begins with you looking.</em>',
 lead:'The photographs, books, films and drawings remain ways to discover how one person learned to see.',
 more:'Preservation takes work, and no journey can capture every detail of a life. Go back to the start and the first ordinary moments carry new meaning.',
 meaning:'A full life story does not end in an award or a death. It can begin again through careful attention to the work.',
 history:'This is an explicitly editorial closing, not a new historical event. Ray was born on 2 May 1921 and died 23 April 1992. The ongoing work of preservation, exhibition and study is documented by the linked institutions.',
 visual:'ORIGINAL circular typographic composition echoing Act I. No archival picture or claim of Ray’s personal statements.',
 prompt:'THE END · AND THE BEGINNING',
 bg:'radial-gradient(ellipse at 67% 42%,#e0c8a5,#737e71 39%,#19362b 88%)',sources:[0,1,8]}
];
const storeKey='origin_v10_act8_scene_v1';
const stage=$('stage'),img=$('archiveImage'),copy=$('sceneCopy');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let current=0,changing=false,focusReturn=null;
try{const saved=localStorage.getItem(storeKey);if(saved!==null){const v=Number(saved);if(Number.isInteger(v)&&v>=0&&v<scenes.length)current=v;}}catch{}
const hashMatch=/^#scene-(\d+)$/.exec(location.hash);
if(hashMatch && +hashMatch[1] < scenes.length)current=+hashMatch[1];
function persist(){try{localStorage.setItem(storeKey,String(current));}catch{}}
function render(){
 const scene=scenes[current];
 stage.dataset.mode=scene.mode;stage.dataset.kind=scene.kind||'symbol';stage.dataset.photo=String(!!scene.asset);
 stage.classList.toggle('dense-title',scene.title.replace(/<[^>]+>/g,'').length>34);
 stage.style.setProperty('--stage-bg',scene.bg);
 $('symbolicYear').textContent=scene.year.replace('AROUND ','').replace('MID-','');
 $('yearPlace').textContent=scene.place+' · '+scene.year;
 $('beatId').textContent=String(current+1).padStart(2,'0')+' / 10';
 $('storyTitle').innerHTML=scene.title;
 $('storyLead').textContent=scene.lead;
 $('storyMore').textContent=scene.more;
 $('visualOrigin').textContent=scene.asset?'ARCHIVAL PHOTO · DATE EXPLAINED IN CONTEXT':'ORIGINAL VISUAL INTERPRETATION · NOT AN ARCHIVAL PHOTOGRAPH';
 const obs=$('observeButton');obs.hidden=!scene.observe;
 obs.textContent=scene.craft==='repair'?'Compare illustrative damage ↗':'Reveal the details ↗';
 obs.setAttribute('aria-pressed','false');
 $('exerciseNote').hidden=true;$('exerciseNote').textContent='';
 $('visualDetail').hidden=true;stage.classList.remove('observing');
 $('frameLabel').textContent='ORIGINAL PRESERVATION METAPHOR · NOT ARCHIVAL FOOTAGE';
 stage.dataset.craft=scene.craft||'none';
 $('storyPrompt').textContent=scene.prompt;
 $('railCaption').textContent=String(current+1).padStart(2,'0')+' / 10';
 $('railYear').textContent=scene.year;
 $('railFill').style.height=Math.round((current+1)/scenes.length*100)+'%';
 $('railFill').style.width=Math.round((current+1)/scenes.length*100)+'%';
 $('prev').disabled=current===0;
 if(current===0){$('prev').disabled=false;$('prev').setAttribute('aria-label','Return to the final scene of Act VII');}else{$('prev').setAttribute('aria-label','Previous scene');}
 $('nextLabel').textContent=current===scenes.length-1?'Finish the Journey':'Continue the story';
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
 const label=document.createElement('span');label.className='map-name';label.textContent=scenes[i].name;const flag=document.createElement('span');flag.className='map-stage';flag.textContent=String(i+1).padStart(2,'0')+'/10';
 b.append(date,label,flag);b.addEventListener('click',()=>{$('mapDialog').close();move(i);});$('mapList').append(b);
}
$('prev').addEventListener('click',()=>{if(current===0)window.location.assign('/v10/journey/act7/#scene-11');else move(current-1);});
$('next').addEventListener('click',()=>{if(current===scenes.length-1)complete();else move(current+1);});
$('restart').addEventListener('click',restart);
$('observeButton').addEventListener('click',()=>{
 const scene=scenes[current];if(!scene.observe)return;
 const active=!stage.classList.contains('observing');
 stage.classList.toggle('observing',active);$('visualDetail').hidden=!active;
 $('observeButton').setAttribute('aria-pressed',String(active));
 $('observeButton').textContent=active?'Restore the original study ↗':scene.craft==='repair'?'Compare illustrative damage ↗':'Reveal the details ↗';
 $('exerciseNote').hidden=!active;$('exerciseNote').textContent=active?(scene.craftNote||'Original demonstration, not an archival film image.'):'';
});
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
