/* ORIGIN V10 — Act V: Finding His Voice (1956–1969)
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
 {label:'Satyajit Ray Archive — Filmography',url:'https://satyajitray.org/filmography/'},
 {label:'Satyajit Ray Archive — A Film a Year',url:'https://satyajitray.org/a-film-a-year/'},
 {label:'Satyajit Ray Archive — Story and Script',url:'https://satyajitray.org/story-script/'},
 {label:'Satyajit Ray Archive — Music of Satyajit Ray',url:'https://satyajitray.org/music-of-satyajit-ray/'},
 {label:'Satyajit Ray Archive — Kanchenjungha',url:'https://satyajitray.org/kanchenjungha/'},
 {label:'BFI — Five essential Ray films',url:'https://www.bfi.org.uk/lists/satyajit-ray-5-essential-films'},
 {label:'BFI — Ray on moral attitudes and society',url:'https://www.bfi.org.uk/sight-and-sound/interviews/satyajit-ray-moral-attitude'},
 {label:'Satyajit Ray Archive — Subrata Mitra',url:'https://satyajitray.org/subrata-mitra/'},
 {label:'Satyajit Ray Archive — Jalsaghar',url:'https://satyajitray.org/jalsaghar-the-music-room/'}
];
const scenes=[
 {year:'1956',place:'THE STORY CONTINUES',name:'Aparajito',mode:'apu',kind:'frame',observe:true,
 title:'A second film.<br><em>A deeper separation.</em>',
 lead:'Ray returned to Apu in Aparajito, moving the character from childhood toward a life increasingly apart from his mother.',
 more:'The triumph of the first film did not become a formula. Ray explored growth and loss from another point in the same life.',
 meaning:'A sequel can transform a familiar world rather than merely repeat it.',
 history:'Aparajito was released in 1956, the second part of the Apu trilogy. It later received the Golden Lion at Venice in 1957. The frame study is not a still from the film.',
 visual:'ORIGINAL frame of two separated abstract forms, not an actual Aparajito image or photographed production scene.',
 prompt:'AFTER THE FIRST FILM',craft:'distance',craftNote:'Original exercise: the separation of two simple forms changes the emotional emphasis. This is not a reproduction of Ray’s composition.',
 bg:'radial-gradient(ellipse at 72% 39%,#bb9f83,#696d65 43%,#1c3232 86%)',sources:[0,1,5]},
 {year:'1957',place:'VENICE AND BEYOND',name:'International recognition',mode:'festival',kind:'screen',
 title:'The work began<br><em>travelling on its own.</em>',
 lead:'Aparajito received the Golden Lion at the 1957 Venice Film Festival.',
 more:'Ray’s second film confirmed that his work could engage an international audience, even as his filmmaking remained grounded in Bengali lives and stories.',
 meaning:'Recognition widened the audience; it did not define the whole ambition.',
 history:'The Ray Archive notes the Golden Lion at Venice for Aparajito. The projected architecture is a symbolic auditorium, not documentary footage of the ceremony.',
 visual:'ORIGINAL theatre-light illustration. No festival photography, awards footage, or historical stage recreation.',
 prompt:'THE GROWING AUDIENCE',bg:'radial-gradient(ellipse at 65% 41%,#d2b58b,#77746c 39%,#1a222c 84%)',sources:[1,0]},
 {year:'1958',place:'A CHANGE IN REGISTER',name:'Parash Pathar',mode:'satire',kind:'frame',
 title:'He could also<br><em>be sharply playful.</em>',
 lead:'Parash Pathar, a fantasy satire, moved Ray away from the tone of the Apu films.',
 more:'His choice of subject showed a director testing new registers: comedy, absurdity and the distortions of desire.',
 meaning:'A filmmaker’s signature need not be a single genre.',
 history:'Ray’s filmography places Parash Pathar in 1958. This scene provides editorial interpretation, not a plot-by-plot analysis or a recreation of its magical object.',
 visual:'ORIGINAL graphic of shifting geometric forms. It is not an illustration, shot or poster from Parash Pathar.',
 prompt:'ANOTHER TONE',bg:'radial-gradient(ellipse at 72% 35%,#bd9f6a,#6d6446 38%,#253039 89%)',sources:[0,1]},
 {year:'1958',place:'THE MUSIC ROOM',name:'Jalsaghar',mode:'music',kind:'sound',observe:true,
 title:'Music became<br><em>the shape of a world.</em>',
 lead:'Jalsaghar followed a declining landowner clinging to a world of music and privilege.',
 more:'Performance, space and sound become central to a story about status and changing times. Ray worked with Ustad Vilayat Khan for the score.',
 meaning:'Sound can define a character’s world before a line of dialogue explains it.',
 history:'Jalsaghar (1958) is a story of decaying feudal power, with music central to its dramatic form. Vilayat Khan composed its music; the music graphic contains no recorded film audio.',
 visual:'ORIGINAL silent concentric sound rings; not recorded classical music, a genuine production score or footage from Jalsaghar.',
 prompt:'LISTEN WITH YOUR EYES',craft:'sound',craftNote:'Original silent demonstration: changing the size of visual sound rings shifts where your eye goes. It does not reproduce Ray’s actual soundtrack.',
 bg:'radial-gradient(ellipse at 73% 42%,#b29a74,#514c4c 40%,#1a2429 86%)',sources:[8,3,0]},
 {year:'1959',place:'THE THIRD PART OF A LIFE',name:'Apur Sansar',mode:'trilogy',kind:'frame',
 title:'Apu grows up.<br><em>The trilogy is complete.</em>',
 lead:'With Apur Sansar, Ray brought Apu’s story into adulthood.',
 more:'The three films now formed a larger emotional journey, but their significance was not limited to one family or one style of cinema.',
 meaning:'An extended story gives time to observe how experience changes a person.',
 history:'Apur Sansar was released in 1959 and completed the Apu trilogy. We do not recreate the film’s ending or specific camera setups.',
 visual:'Three ORIGINAL abstract frame areas suggesting a triptych; not actual Apu trilogy stills or promotional artwork.',
 prompt:'A JOURNEY IN THREE FILMS',bg:'radial-gradient(ellipse at 68% 32%,#c3a686,#596d69 41%,#1c3332 87%)',sources:[0,1,5]},
 {year:'1960',place:'BELIEF AND ITS CONSEQUENCES',name:'Devi',mode:'belief',kind:'frame',
 title:'He looked at faith<br><em>and human vulnerability.</em>',
 lead:'In Devi, Ray confronted the consequences of a family’s belief that a young woman is divine.',
 more:'The intimate psychological drama examined authority and the cost of unquestioned certainty, opening still another area of subject matter.',
 meaning:'A restrained scene can carry an unsettling moral question without announcing a verdict.',
 history:'Devi was released in 1960. Its plot concerns a young woman treated by her family as the incarnation of a goddess. The imagery is abstract and not a religious representation or a film still.',
 visual:'ORIGINAL light-and-shadow graphic; not a scene, deity image, poster, or religious artwork from Devi.',
 prompt:'QUESTIONS WITHOUT EASY ANSWERS',bg:'radial-gradient(ellipse at 67% 36%,#caab89,#655858 42%,#202329 88%)',sources:[0,1]},
 {year:'1961',place:'STORIES, MUSIC, AND SANDE​​SH',name:'More than a director',mode:'multi',kind:'sound',observe:true,
 title:'His imagination<br><em>had many forms.</em>',
 lead:'Ray made Teen Kanya and a documentary on Rabindranath Tagore. He also began composing music for his films.',
 more:'He revived the Bengali children’s magazine Sandesh with family collaborators, deepening a creative life that reached beyond cinema.',
 meaning:'The director’s craft drew from writing, illustration, music and the family tradition of publishing.',
 history:'The archive dates Teen Kanya and the Tagore documentary to 1961, and states Ray began composing film music from Teen Kanya. It records the revival of Sandesh in 1961. Original visuals, no actual music or magazine pages.',
 visual:'ORIGINAL abstract sound-and-publication study. It does not reproduce Ray’s scores, the magazine or a film frame.',
 prompt:'THE CREATOR EXPANDS',craft:'sound',craftNote:'Visual rhythm study only. It is silent and not a representation of any actual Ray musical theme.',
 bg:'radial-gradient(ellipse at 65% 38%,#9baf99,#5e6758 41%,#23342d 89%)',sources:[0,3,2]},
 {year:'1962',place:'COLOUR AND TIME',name:'Kanchenjungha',mode:'colour',kind:'colour',observe:true,
 title:'Colour entered<br><em>the storytelling.</em>',
 lead:'Kanchenjungha was Ray’s first film in colour and his first fully original screenplay.',
 more:'Set during an afternoon in Darjeeling, it used changing weather, colour and the passage of real time to shape a family drama.',
 meaning:'Form becomes part of meaning when a landscape changes as characters change.',
 history:'Ray’s archive identifies Kanchenjungha (1962) as his first original screenplay, his first colour film, and a story playing out over roughly 100 minutes. The palette below is a modern abstract craft demonstration, not the film’s actual colour grade.',
 visual:'ORIGINAL colour bands and mountain-like shapes. No actual film photography, costume palette or shot reconstruction.',
 prompt:'THE WEATHER OF A STORY',craft:'colour',craftNote:'Original demonstration: shifting between muted and more saturated colours changes the mood. These are not exact colours from Kanchenjungha.',
 bg:'radial-gradient(ellipse at 70% 37%,#819da4,#687b7b 38%,#263a47 83%)',sources:[4,2,0]},
 {year:'1963',place:'THE CITY AND WORK',name:'Mahanagar',mode:'city',kind:'frame',
 title:'He turned his gaze<br><em>toward the city.</em>',
 lead:'Mahanagar followed a middle-class Calcutta housewife whose paid work changes life at home.',
 more:'Ray observed work, household power and dignity through everyday decisions rather than spectacle.',
 meaning:'The social world surrounding a character can be as important as the central event.',
 history:'Mahanagar, released in 1963, concerns a housewife entering paid employment. Ray discussed its social context in a BFI interview; do not confuse the interpretation with the director’s exact words.',
 visual:'ORIGINAL city grid and moving light. Not an image of Calcutta from the film, archival street photo, or screenshot.',
 prompt:'SMALL DECISIONS, LARGE CONSEQUENCES',bg:'radial-gradient(ellipse at 68% 32%,#ab9b82,#617276 40%,#27323c 89%)',sources:[0,5,6]},
 {year:'1964',place:'THE LONELY WIFE',name:'Charulata',mode:'attention',kind:'frame',observe:true,
 title:'Sometimes the story<br><em>is what goes unsaid.</em>',
 lead:'Charulata explored a lonely woman’s awakening through observation, longing and the life of a household.',
 more:'Ray increasingly concentrated his drama within limited places and time. A look, a pause or a shift of attention could carry the emotion.',
 meaning:'The camera can suggest isolation through what it shows and what it leaves outside the frame.',
 history:'Charulata (1964) was adapted from Rabindranath Tagore’s Nastanirh. BFI describes its concentrated time and opening attention to Charu’s looking through opera glasses. Ray began operating the camera himself from this film, according to the Ray Archive.',
 visual:'ORIGINAL two-field framing study. This is not Charulata’s actual opening or an image of Madhabi Mukherjee.',
 prompt:'THE POWER OF A LOOK',craft:'distance',craftNote:'Original framing exercise: shifting an abstract subject away from the centre changes the feeling of isolation. Not Ray’s original shot.',
 bg:'radial-gradient(ellipse at 68% 36%,#c2b79d,#6a6b62 41%,#293438 90%)',sources:[5,7,0]},
 {year:'1966',place:'THE HERO',name:'Nayak',mode:'hero',kind:'frame',
 title:'A public face.<br><em>A private uncertainty.</em>',
 lead:'Nayak follows a film star on a train journey where fame and personal doubts collide.',
 more:'Ray moved between worlds: not only the ordinary and the historical, but the inner life of a celebrity.',
 meaning:'A filmmaker’s subject can change while a concern for the human mind remains.',
 history:'Nayak (1966), a Ray original screenplay, features a film star travelling by train. The image here is an original abstraction, not a depiction of actor Uttam Kumar or a film shot.',
 visual:'ORIGINAL reflecting plane and silhouette; no film image, celebrity likeness or train-scene recreation.',
 prompt:'BEHIND THE IMAGE',bg:'radial-gradient(ellipse at 67% 39%,#9fa2a0,#6a6973 41%,#292837 88%)',sources:[0,2]},
 {year:'1968',place:'FANTASY AND MUSIC',name:'Goopy Gyne Bagha Byne',mode:'fantasy',kind:'sound',observe:true,
 title:'The imagination<br><em>learned to sing.</em>',
 lead:'Goopy Gyne Bagha Byne brought fantasy, music and playful storytelling into Ray’s cinema.',
 more:'Drawing on a story by his grandfather Upendrakishore, Ray made a distinctive musical fantasy for a wide audience.',
 meaning:'A personal creative identity can contain seriousness and wonder at once.',
 history:'The Ray Archive filmography dates Goopy Gyne Bagha Byne to 1968. It is based on Upendrakishore Ray Chowdhury’s story. We do not play copyrighted songs or recreate the ghost dance.',
 visual:'ORIGINAL silent circular composition suggesting rhythm; not any character, sequence, film poster or music from the original film.',
 prompt:'FANTASY FINDS A VOICE',craft:'sound',craftNote:'Silent rhythmic rings are an interface exercise, not Ray’s composed music or an animation from the film.',
 bg:'radial-gradient(ellipse at 73% 43%,#beae93,#6a5384 39%,#2d2542 90%)',sources:[0,3]},
 {year:'1969',place:'BEFORE A NEW DECADE',name:'Aranyer Din Ratri',mode:'forest',kind:'colour',
 title:'A wider world.<br><em>A sharper gaze.</em>',
 lead:'Aranyer Din Ratri turned toward young urban men travelling to a forest and confronting themselves.',
 more:'The 1960s had established Ray’s range. The next decade would bring still more explicit questions about society, uncertainty and the changing city.',
 meaning:'Act V closes on an evolving filmmaker, not a settled artistic formula.',
 history:'The Ray Archive lists Aranyer Din Ratri in 1969. Later documentation and release chronologies sometimes distinguish production year from public release; this act follows the archive filmography year convention.',
 visual:'ORIGINAL forest-and-road editorial illustration. Not a still, poster or documentary photo from the film.',
 prompt:'A NEW DECADE AHEAD',bg:'radial-gradient(ellipse at 65% 39%,#9d9471,#456554 44%,#192d2a 90%)',sources:[0,6]}
];
const storeKey='origin_v10_act5_scene_v1';
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
 $('beatId').textContent=String(current+1).padStart(2,'0')+' / 13';
 $('storyTitle').innerHTML=scene.title;
 $('storyLead').textContent=scene.lead;
 $('storyMore').textContent=scene.more;
 $('visualOrigin').textContent=scene.asset?'ARCHIVAL PHOTO · DATE EXPLAINED IN CONTEXT':'ORIGINAL VISUAL INTERPRETATION · NOT AN ARCHIVAL PHOTOGRAPH';
 const obs=$('observeButton');obs.hidden=!scene.observe;
 obs.textContent=scene.craft==='colour'?'Explore the colour ↗':scene.craft==='sound'?'Explore visual rhythm ↗':'Explore framing ↗';
 obs.setAttribute('aria-pressed','false');
 $('exerciseNote').hidden=true;$('exerciseNote').textContent='';
 $('visualDetail').hidden=true;stage.classList.remove('observing');
 $('frameLabel').textContent='ORIGINAL EDITORIAL CRAFT STUDY · NOT A FILM STILL';
 stage.dataset.craft=scene.craft||'none';
 $('storyPrompt').textContent=scene.prompt;
 $('railCaption').textContent=String(current+1).padStart(2,'0')+' / 13';
 $('railYear').textContent=scene.year;
 $('railFill').style.height=Math.round((current+1)/scenes.length*100)+'%';
 $('railFill').style.width=Math.round((current+1)/scenes.length*100)+'%';
 $('prev').disabled=current===0;
 if(current===0){$('prev').disabled=false;$('prev').setAttribute('aria-label','Return to the final scene of Act IV');}else{$('prev').setAttribute('aria-label','Previous scene');}
 $('nextLabel').textContent=current===scenes.length-1?'Finish Act V':'Continue the story';
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
 const label=document.createElement('span');label.className='map-name';label.textContent=scenes[i].name;const flag=document.createElement('span');flag.className='map-stage';flag.textContent=String(i+1).padStart(2,'0')+'/13';
 b.append(date,label,flag);b.addEventListener('click',()=>{$('mapDialog').close();move(i);});$('mapList').append(b);
}
$('prev').addEventListener('click',()=>{if(current===0)window.location.assign('/v10/journey/act4/#scene-11');else move(current-1);});
$('next').addEventListener('click',()=>{if(current===scenes.length-1)complete();else move(current+1);});
$('restart').addEventListener('click',restart);
$('observeButton').addEventListener('click',()=>{
 const scene=scenes[current];if(!scene.observe)return;
 const active=!stage.classList.contains('observing');
 stage.classList.toggle('observing',active);$('visualDetail').hidden=!active;
 $('observeButton').setAttribute('aria-pressed',String(active));
 $('observeButton').textContent=active?'Restore the original study ↗':scene.craft==='colour'?'Explore the colour ↗':scene.craft==='sound'?'Explore visual rhythm ↗':'Explore framing ↗';
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
