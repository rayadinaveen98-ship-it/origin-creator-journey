/* ORIGIN V10 — Act III: The Dream (1943–1951)
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
 {label:'Ray Archive — Advertising and Graphic Design',url:'https://satyajitray.org/advertising-graphic-design/'},
 {label:'Ray Archive — Biography',url:'https://satyajitray.org/biography/'},
 {label:'Ray Archive — Calcutta Film Society',url:'https://satyajitray.org/calcutta-film-society/'},
 {label:'Harvard Film Archive — Ray and the Apu Trilogy',url:'https://harvardfilmarchive.org/programs/satjajit-rays-apu-trilogy/2'},
 {label:'Tuli Research Centre — Satyajit Ray Chronology',url:'https://www.tuliresearchcentre.org/satyajit-ray/research-centre/all/pather-panchali-1955-cinema-photographic-still-66'},
 {label:'Ray Archive — Encounter with Jean Renoir',url:'https://satyajitray.org/encounter-with-jean-renoir/'},
 {label:'Ray Archive — The Bicycle Thieves Effect',url:'https://satyajitray.org/bicycle-thieves-effect/'}
];
const scenes=[
{year:'APRIL 1943',place:'CALCUTTA · D. J. KEYMER',name:'A life at the drawing board',mode:'office',kind:'print',
 title:'He was an artist.<br><em>Now he had a job.</em>',
 lead:'In April 1943, Satyajit Ray joined the advertising agency D. J. Keymer as a junior visualiser.',
 more:'It was a living made through layouts, drawings, lettering and commercial ideas. The future director was still learning the demands of making images for other people.',
 meaning:'Before there was a film to direct, there was a day job and daily practice with visual communication.',
 history:'The Satyajit Ray Archive dates his start at D. J. Keymer to April 1943. He stayed in advertising until the success of his first film made full-time filmmaking possible.',
 visual:'An ORIGINAL, fictional mid-century typographic composition. It is neither one of Ray’s advertisements nor a reconstruction of his workplace.',
 prompt:'THE WORKING ARTIST',observe:true,artTitle:'A NEW\nWAY TO SEE',artAlt:'MAKING\nAN IMAGE',bg:'radial-gradient(ellipse at 71% 43%,#bd9460,#6a4835 31%,#19262a 76%,#091210)',sources:[0,1]},
{year:'1943–1946',place:'SIGNET PRESS',name:'A world of book covers',mode:'book',kind:'print',
 title:'He discovered<br><em>another kind of storytelling.</em>',
 lead:'Designer D. K. Gupta drew Ray into the work of Signet Press, creating covers and illustrations for Bengali books.',
 more:'In those designs, letters could become images and a single cover could suggest an entire story. Book illustration brought Ray closer to Bengali literature.',
 meaning:'The visual imagination that would later appear in film posters and credits was developing on paper.',
 history:'D. K. Gupta established Signet Press and commissioned Ray to design book jackets and illustrations. The Archive describes this as a formative engagement with Bengali writing.',
 visual:'Original placeholder book-cover geometry and text. No Signet Press jacket or Ray-owned design is reproduced.',
 prompt:'STORYTELLING ON PAPER',observe:true,artTitle:'ONE PAGE\nA WORLD',artAlt:'A STORY\nIN TYPE',bg:'radial-gradient(ellipse at 66% 33%,#b8a078,#745e4e 38%,#27352f 84%,#0c1210)',sources:[0,1]},
{year:'1944',place:'A STORY ON A PAGE',name:'An unexpected book',mode:'novel',kind:'print',
 title:'A boy named Apu<br><em>enters the picture.</em>',
 lead:'Ray illustrated an abridged edition of Bibhutibhushan Bandyopadhyay’s Pather Panchali for Signet Press.',
 more:'The book made a lasting impression. Gupta suggested that it could make a good film. Ray was still a graphic artist, but a story was beginning to stay with him.',
 meaning:'The eventual first film entered Ray’s life through work with a book — not through a sudden appointment as director.',
 history:'The Ray Archive dates the abridged Pather Panchali illustration commission to 1944 and notes D. K. Gupta’s remark about a possible film. Other later accounts differ slightly on publication timing; this scene follows the Archive chronology.',
 visual:'Original abstract book-cover study, not the actual Aam Antir Bhepu book jacket, an illustration by Ray or footage from the later movie.',
 prompt:'THE STORY THAT STAYED',observe:true,artTitle:'A STORY\nOF LIFE',artAlt:'THE ROAD\nAHEAD',bg:'radial-gradient(ellipse at 63% 38%,#bca46f,#6d704c 35%,#202b2a 79%,#0b1211)',sources:[0,1,3]},
{year:'1947',place:'CALCUTTA FILM SOCIETY',name:'A room for cinema',mode:'society',kind:'screen',
 title:'Film was no longer<br><em>just a pastime.</em>',
 lead:'With friends, Ray helped found the Calcutta Film Society in 1947.',
 more:'The group watched and discussed important world cinema. Its first screening was Battleship Potemkin. A working artist was creating space for serious study of a medium he loved.',
 meaning:'Film societies offered a kind of informal school: watching closely, debating and learning together.',
 history:'Ray co-founded the Calcutta Film Society in 1947; the Ray Archive identifies Battleship Potemkin as the first film screened. The luminous rectangle here is not a reproduced film frame.',
 visual:'Original silhouette of a projection screen. There is no Battleship Potemkin footage or reconstructed society meeting.',
 prompt:'WATCHING TO LEARN',bg:'radial-gradient(ellipse at 70% 43%,#9d9d82,#59645b 39%,#1d2929 72%,#070e10)',sources:[2,1]},
{year:'1948',place:'CALCUTTA · CRITICAL VOICE',name:'Learning through critique',mode:'critique',kind:'print',
 title:'He began asking<br><em>what Indian cinema could be.</em>',
 lead:'Ray published early writing on cinema and experimented privately with screenplays.',
 more:'He compared stories with their film adaptations and thought about what form and imagination could achieve. His criticism was becoming an argument for another kind of film.',
 meaning:'A filmmaker’s voice can begin long before they have access to a camera.',
 history:'The Ray Archive notes his essays from 1948 onward and his exercise of writing and comparing imagined screenplays with completed films. His 1948 Statesman essay “What Is Wrong with Indian Films” examined filmmaking limitations and integrity.',
 visual:'Original newspaper-like typographic arrangement. It is NOT the text or typesetting of Ray’s article.',
 prompt:'THE MAKING OF A VIEWPOINT',observe:true,artTitle:'WHAT IF\nCINEMA',artAlt:'COULD\nBE MORE',bg:'radial-gradient(ellipse at 67% 42%,#d0b786,#635747 41%,#1d2928 80%)',sources:[2,1]},
{year:'1948–1949',place:'A LIFE BEYOND THE SCREEN',name:'The person beyond his work',mode:'personal',kind:'symbol',
 title:'Outside work,<br><em>his own life continued.</em>',
 lead:'Ray and Bijoya married in October 1948; the marriage was also solemnised with family approval in March 1949.',
 more:'Creative lives are not made only of artistic milestones. Work, family and personal commitments continued while cinema occupied more of his attention.',
 meaning:'A complete journey needs to leave space for the person beyond his most famous work.',
 history:'Tuli Research Centre’s Ray chronology identifies the October 1948 marriage in Bombay and a March 1949 family-approved ceremony. We do not dramatise a conversation or represent private feelings without evidence.',
 visual:'Original minimal motif of two intersecting light paths — not wedding footage, portrait or an actual household scene.',
 prompt:'A LIFE IN PARALLEL',bg:'radial-gradient(ellipse at 68% 47%,#876c69,#564446 42%,#222529 75%,#0a1113)',sources:[4,1]},
{year:'1949',place:'BENGAL · JEAN RENOIR',name:'An encounter',mode:'renoir',kind:'symbol',
 title:'A filmmaker arrived.<br><em>A door opened.</em>',
 lead:'Jean Renoir came to Bengal while preparing The River. Ray made contact and helped him seek locations.',
 more:'They discussed cinema and filming in real surroundings. Ray’s dream of telling a Bengali story with a camera found encouragement, though no single meeting can explain a whole career.',
 meaning:'Meeting another working filmmaker helped turn distant admiration into something more imaginable.',
 history:'The Ray Archive and film histories document Renoir’s 1949 visit for The River and his contact with Ray. The scene does not invent a location, quote, or private conversation.',
 visual:'Original image of converging lines and daylight. Not a photograph of Renoir, Ray or the production of The River.',
 prompt:'THE ENCOUNTER',bg:'radial-gradient(ellipse at 76% 36%,#bc9a7c,#5c5946 32%,#1a3334 80%)',sources:[5,1]},
{year:'1950',place:'LONDON',name:'A city of screens',mode:'london',kind:'screen',
 title:'Far from Calcutta,<br><em>cinema was everywhere.</em>',
 lead:'Ray travelled to London for work in 1950 and used the visit to see an extraordinary number of films.',
 more:'He was still employed in advertising. But theatres, screenings and different filmmaking styles gave him a new view of what cinema could be.',
 meaning:'This was learning through immersion, not a formal film-school diploma.',
 history:'The Ray Archive describes the 1950 business trip and approximately one hundred films viewed while abroad. Accounts differ on whether the stay was about four and a half or six months; we intentionally do not state a precise duration.',
 visual:'Original abstract London cinema marquees and projected light. Not a reconstruction of a particular venue or film screening.',
 prompt:'CINEMA AFTER CINEMA',bg:'radial-gradient(ellipse at 67% 44%,#9f967f,#575f67 34%,#1c2430 79%)',sources:[6,1]},
{year:'1950',place:'A LONDON SCREENING',name:'The Bicycle Thieves effect',mode:'screen',kind:'screen',
 title:'One film confirmed<br><em>a possibility.</em>',
 lead:'Vittorio De Sica’s Bicycle Thieves made a deep impression on Ray.',
 more:'It strengthened his belief that real locations, unfamiliar faces and ordinary lives could carry a feature film. The idea of filming Pather Panchali began to feel practicable.',
 meaning:'The revelation was practical as much as artistic: a film could be made outside the conventions of the studio.',
 history:'The Ray Archive identifies Bicycle Thieves as a decisive confirmation of Ray’s ideas about location shooting and non-professional performers. We show no movie footage or stills.',
 visual:'Original cinema-light illustration, not a frame from Bicycle Thieves.',
 prompt:'A WAY FORWARD',bg:'radial-gradient(ellipse at 72% 37%,#d1b27d,#646654 32%,#20292c 80%)',sources:[6,1,3]},
{year:'1950',place:'THE RETURN VOYAGE',name:'A story takes shape',mode:'voyage',kind:'paper',
 title:'On the way home,<br><em>the story took form.</em>',
 lead:'Ray used the sea journey back toward India to develop his treatment of Pather Panchali.',
 more:'A working designer now had an emerging plan for a film about life in Bengal. He would still have to find collaborators, money and a way to make it real.',
 meaning:'The leap from watching films to making one begins with a proposal — and many questions still unanswered.',
 history:'The Ray Archive says Ray completed his treatment during the return ship journey, after his time in London. This graphic is not his original manuscript or an actual ship photograph.',
 visual:'Original paper-and-route composition. No archival screenplay pages or historic shipping imagery are represented.',
 prompt:'THE FILM ON PAPER',observe:true,artTitle:'A FILM\nTO MAKE',artAlt:'THE\nFIRST PAGE',bg:'radial-gradient(ellipse at 68% 33%,#9e9580,#42606c 36%,#182d35 77%)',sources:[6,3]},
{year:'1951',place:'THE THRESHOLD OF A FILM',name:'From dream to work',mode:'decision',kind:'symbol',
 title:'The dream was real.<br><em>The obstacles were too.</em>',
 lead:'By the early 1950s, Ray was developing a plan to film Pather Panchali outside a conventional studio system.',
 more:'There was no comfortable guarantee of funding or production. The next chapter will be about the people, the practical decisions, the interruptions and the years it took to finish.',
 meaning:'Act III ends not with success, but with the choice to attempt something difficult.',
 history:'Biographical sources establish the proposal and early planning before shooting began in 1952. “1951” marks a transitional narrative period, not a claim that one decisive event happened on a particular day.',
 visual:'Original dramatic doorway and paper silhouette. This is a thematic ending, not an archival event photograph.',
 prompt:'THE DECISION TO TRY',bg:'radial-gradient(ellipse at 71% 45%,#ccac7e,#555a50 38%,#142827 79%)',sources:[3,6,1]}
];
const storeKey='origin_v10_act3_scene_v1';
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
 stage.style.setProperty('--stage-bg',scene.bg);
 $('symbolicYear').textContent=scene.year.replace('AROUND ','').replace('MID-','');
 $('yearPlace').textContent=scene.place+' · '+scene.year;
 $('beatId').textContent=String(current+1).padStart(2,'0')+' / 11';
 $('storyTitle').innerHTML=scene.title;
 $('storyLead').textContent=scene.lead;
 $('storyMore').textContent=scene.more;
 $('visualOrigin').textContent=scene.asset?'ARCHIVAL PHOTO · DATE EXPLAINED IN CONTEXT':'ORIGINAL VISUAL INTERPRETATION · NOT AN ARCHIVAL PHOTOGRAPH';
 const obs=$('observeButton');obs.hidden=!scene.observe;obs.textContent='Change the emphasis ◎';obs.setAttribute('aria-pressed','false');$('visualDetail').hidden=true;stage.classList.remove('observing');
 const art=$('printedArt');
 art.hidden=scene.kind!=='print'&&scene.kind!=='paper';
 if(!art.hidden){
   $('printEyebrow').textContent=scene.kind==='paper'?'STORY TREATMENT / EDITORIAL DEMO':'GRAPHIC STUDY / NOT A RAY DESIGN';
   $('printTitle').innerHTML=(scene.artTitle||'STORY\\nIMAGE').replaceAll(String.fromCharCode(10),'<br>');
 }
 $('storyPrompt').textContent=scene.prompt;
 $('railCaption').textContent=String(current+1).padStart(2,'0')+' / 11';
 $('railYear').textContent=scene.year;
 $('railFill').style.height=Math.round((current+1)/scenes.length*100)+'%';
 $('railFill').style.width=Math.round((current+1)/scenes.length*100)+'%';
 $('prev').disabled=current===0;
 if(current===0){$('prev').disabled=false;$('prev').setAttribute('aria-label','Return to the final scene of Act II');}else{$('prev').setAttribute('aria-label','Previous scene');}
 $('nextLabel').textContent=current===scenes.length-1?'Finish Act III':'Continue the story';
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
 const label=document.createElement('span');label.className='map-name';label.textContent=scenes[i].name;const flag=document.createElement('span');flag.className='map-stage';flag.textContent=String(i+1).padStart(2,'0')+'/11';
 b.append(date,label,flag);b.addEventListener('click',()=>{$('mapDialog').close();move(i);});$('mapList').append(b);
}
$('prev').addEventListener('click',()=>{if(current===0)window.location.assign('/v10/journey/act2/#scene-7');else move(current-1);});
$('next').addEventListener('click',()=>{if(current===scenes.length-1)complete();else move(current+1);});
$('restart').addEventListener('click',restart);
 $('observeButton').addEventListener('click',()=>{if(!scenes[current].observe)return;const active=!stage.classList.contains('observing');stage.classList.toggle('observing',active);$('visualDetail').hidden=!active;$('observeButton').setAttribute('aria-pressed',String(active));$('observeButton').textContent=active?'Restore the first version ↗':'Change the emphasis ◎';
 const scene=scenes[current];if(scene.kind==='print'||scene.kind==='paper')$('printTitle').innerHTML=(active?(scene.artAlt||scene.artTitle):scene.artTitle).replaceAll(String.fromCharCode(10),'<br>');});
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
