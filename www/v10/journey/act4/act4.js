/* ORIGIN V10 — Act IV: The First Film (1952–1955)
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
 {label:'Satyajit Ray Archive — Making of Pather Panchali',url:'https://satyajitray.org/making-of-pather-panchali/'},
 {label:'BFI — Ray on his first day of shooting',url:'https://bfidatadigipres.github.io/big%20screen%20classics/2024/04/02/pather-panchali/'},
 {label:'MoMA — Satyajit Ray’s Pather Panchali',url:'https://www.moma.org/explore/inside_out/2012/11/13/satyajit-rays-pather-panchali/'},
 {label:'Government of India — International Film Festival catalogue',url:'https://dff.nic.in/images/Documents/173_ipcatalogue.pdf'},
 {label:'Criterion — The Apu Trilogy',url:'https://www.criterion.com/current/posts/3798-the-apu-trilogy-every-common-sight'}
];
const scenes=[
 {year:'1952',place:'PREPARING THE FILM',name:'Assembling the crew',mode:'crew',kind:'set',
 title:'He had a story.<br><em>Now he needed a team.</em>',
 lead:'With little practical film experience, Ray set about assembling the people who could help make Pather Panchali.',
 more:'Subrata Mitra would become the cinematographer; Bansi Chandragupta worked as art director. The new team would have to learn together while attempting a feature film.',
 meaning:'A director does not make a film alone. The first step toward cinema was collaboration.',
 history:'Ray recruited a largely inexperienced crew; Bansi Chandragupta had professional experience and Subrata Mitra was new to motion-picture cinematography. Accounts note a small, inexperienced unit on the first day.',
 visual:'Original fictional film-crew composition built from abstract shapes. Not an archival portrait of the actual unit or a real film set.',
 prompt:'THE FIRST TEAM',bg:'radial-gradient(ellipse at 77% 40%,#a68b63,#334b3f 38%,#0b1815 85%)',sources:[0,1,4]},
 {year:'27 OCT 1952',place:'A FIELD OF KAASH FLOWERS',name:'First day on location',mode:'field',kind:'frame',observe:true,
 title:'A field.<br><em>A camera. A beginning.</em>',
 lead:'On 27 October 1952, Ray began filming the sequence in which Apu and Durga discover a train through tall kaash grass.',
 more:'It was a first day for much of the team. Ray later described how directly the experience taught him things that books could not.',
 meaning:'The dream met weather, terrain, actors and the practical limits of a real camera.',
 history:'The Ray Archive dates the first shoot to 27 October 1952 and identifies the kaash-field train-discovery scene. Ray’s account of the first day is reproduced by BFI.',
 visual:'Original storyboard-like graphic suggesting grass, an open field and two figures. NOT a Pather Panchali still, genuine storyboard or reconstruction of a specific camera setup.',
 prompt:'THE CAMERA ROLLS',bg:'radial-gradient(ellipse at 76% 27%,#ccb687,#76836b 39%,#233c36 82%)',sources:[0,1]},
 {year:'NOV 1952',place:'THE SECOND SHOOT',name:'The field has changed',mode:'empty',kind:'frame',
 title:'The scene was gone<br><em>when they returned.</em>',
 lead:'The following Sunday, the kaash flowers had been eaten by cattle.',
 more:'The crew could not simply continue where they had left off. The changing landscape imposed its own schedule; they would have to wait for another flowering season.',
 meaning:'Working on real locations means accepting that nature cannot be commanded like a studio set.',
 history:'The Ray Archive recounts cattle eating the kaash plants before the following Sunday’s shoot. We place this moment soon after the first day, not on a newly invented exact date.',
 visual:'An empty original field illustration used to symbolize the lost kaash flowers. Not an archival photograph of the damage.',
 prompt:'THE FIRST INTERRUPTION',bg:'radial-gradient(ellipse at 65% 25%,#978c68,#545f4d 40%,#192b2a 88%)',sources:[0]},
 {year:'1952–53',place:'CASTING AND A VILLAGE',name:'People and place',mode:'village',kind:'frame',observe:true,
 title:'Not stars.<br><em>People in a place.</em>',
 lead:'Ray chose a mixture of experienced performers and newcomers, and the village of Boral became a major location.',
 more:'Subir Banerjee played Apu, Karuna Banerjee played Sarbajaya, and veteran stage actor Chunibala Devi played Indir Thakrun. Their backgrounds were not all the same.',
 meaning:'A believable world comes from casting, environments, behaviour and collaboration—not from assuming everyone was an amateur.',
 history:'The Ray Archive identifies Boral as a principal location and describes a mixed cast, specifically identifying Chunibala Devi as a retired stage actress and Subir Banerjee as new to acting.',
 visual:'An entirely original visual study of foreground and background in a village; not a Boral location photo, Ray’s storyboard or a film still.',
 prompt:'MAKING A WORLD',bg:'radial-gradient(ellipse at 64% 38%,#b79b73,#637866 40%,#1a342e 88%)',sources:[0,3]},
 {year:'1953',place:'LOOKING FOR A PRODUCER',name:'The money runs out',mode:'budget',kind:'symbol',
 title:'The film kept starting.<br><em>Then stopping.</em>',
 lead:'Ray borrowed money to establish that the film could be made, but the search for lasting financial support was difficult.',
 more:'He continued his advertising job while seeking producers. Further shooting eventually became impossible when funds ran short.',
 meaning:'An artistic plan has to survive the practical costs of filmmaking.',
 history:'The Ray Archive describes borrowing against insurance, support from relatives and friends, and attempts to persuade producers with footage. It also recounts temporary backing that later collapsed.',
 visual:'Original unnumbered ledger motif illustrating production constraints. It does not depict a real budget, payment receipt or financial ledger.',
 prompt:'THE COST OF A DREAM',bg:'radial-gradient(ellipse at 68% 37%,#947e61,#555345 37%,#1b2222 87%)',sources:[0,2]},
 {year:'1953',place:'FAMILY SACRIFICES',name:'Keeping the camera moving',mode:'sacrifice',kind:'symbol',
 title:'The production<br><em>became personal.</em>',
 lead:'Bijoya Ray’s jewellery was pawned to continue shooting after promised funds failed to arrive.',
 more:'This was not a frictionless production supported by a secure studio budget. The people nearest the filmmaker were affected by the attempt.',
 meaning:'When we tell a creative success story, we must also account for the people who carried its practical risks.',
 history:'The Ray Archive recounts that Bijoya Ray’s jewellery was pawned when one backer could not continue financing the production. We do not invent an exchange of words or private reactions.',
 visual:'Original understated geometric motif; no jewellery, real pawn receipt, or domestic scene is reconstructed.',
 prompt:'WHAT IT COST',bg:'radial-gradient(ellipse at 71% 35%,#99785d,#59463f 39%,#211c1e 89%)',sources:[0]},
 {year:'1953–54',place:'A NEW SOURCE OF SUPPORT',name:'Government assistance',mode:'support',kind:'symbol',
 title:'The film needed help.<br><em>It finally came.</em>',
 lead:'Production manager Anil Choudhury helped bring the unfinished film to the attention of West Bengal’s government.',
 more:'The state agreed to finance completion. Funding in instalments, with accounts to be cleared, meant shooting could resume—but still not without delay.',
 meaning:'A film can owe its existence to both private persistence and institutional support.',
 history:'The Ray Archive identifies production manager Anil Choudhury, Chief Minister B. C. Roy and funding by the Government of West Bengal. The exact sums and administrative route vary between accounts and are not claimed here.',
 visual:'Original light-on-paper composition. No historical government document or accurate funding certificate is shown.',
 prompt:'A PATH FORWARD',bg:'radial-gradient(ellipse at 71% 39%,#bfa47d,#6b6a53 41%,#1e3130 89%)',sources:[0,2]},
 {year:'1954',place:'BACK TO THE LOCATION',name:'The camera returns',mode:'shooting',kind:'frame',observe:true,
 title:'After the silence,<br><em>the camera returned.</em>',
 lead:'Following a long production break, principal shooting resumed in 1954.',
 more:'The cast, places and seasons still had to match. The work came together in stages, under financial and logistical constraints.',
 meaning:'Continuity is not merely a clever edit. It means preserving a believable world across real gaps in time.',
 history:'The Ray Archive reports that filming resumed early in 1954 after a break of nearly a year. Government money came in instalments; approval of accounts could take time.',
 visual:'Original storyboarding-style frame with two foreground forms. Not a genuine production image, camera shot or reconstruction.',
 prompt:'THE PRODUCTION CONTINUES',bg:'radial-gradient(ellipse at 66% 35%,#9ab19a,#5c715a 43%,#19302e 90%)',sources:[0,1]},
 {year:'1954–55',place:'A WORLD PREMIERE OPPORTUNITY',name:'A chance at MoMA',mode:'moma',kind:'symbol',
 title:'The unfinished film<br><em>was being noticed.</em>',
 lead:'Monroe Wheeler of New York’s Museum of Modern Art saw stills and offered the prospect of a world premiere.',
 more:'John Huston later watched rough footage and supported its promise. An overseas screening now brought a new deadline to an already difficult production.',
 meaning:'Outside interest did not make the film for Ray; it increased the urgency to finish it.',
 history:'The Ray Archive recounts Wheeler’s 1954 visit and Huston’s assessment of silent footage; MoMA confirms the May 1955 premiere arrangements. We avoid a manufactured meeting scene.',
 visual:'Original projection-beam and theatre motif. Not an image of Wheeler, Huston, MoMA’s 1955 screening or the actual film.',
 prompt:'A DEADLINE APPEARS',bg:'radial-gradient(ellipse at 67% 41%,#9fa3a0,#545e62 40%,#111f27 87%)',sources:[0,2]},
 {year:'1955',place:'EDITING AND MUSIC',name:'The final rush',mode:'edit',kind:'filmstrip',observe:true,
 title:'Years of filming.<br><em>Days to finish.</em>',
 lead:'Ray and editor Dulal Dutta worked intensely to complete the film for its New York screening.',
 more:'Ravi Shankar composed and recorded the score under a tight schedule. Image and sound were being assembled from years of hard-won material.',
 meaning:'Finishing a film is a creative act of rhythm and selection, not simply a technical final step.',
 history:'The Ray Archive describes a marathon music session with Ravi Shankar and ten days and nights of final post-production with editor Dulal Dutta. The graphic is not a reproduction of Ray’s editing timeline.',
 visual:'Original conceptual editing-filmstrip design. No authentic footage, negative, soundtrack or film recording is provided.',
 prompt:'THE FILM TAKES SHAPE',bg:'radial-gradient(ellipse at 69% 35%,#b89971,#4b514c 41%,#18292a 90%)',sources:[0,3]},
 {year:'MAY 1955',place:'NEW YORK · MoMA',name:'The first audience',mode:'premiere',kind:'screen',
 title:'The first film<br><em>reached an audience.</em>',
 lead:'Pather Panchali had its world premiere at MoMA in May 1955.',
 more:'The film had travelled farther than its young director could have known when shooting began in a Bengal field. That first screening was the beginning of its public life—not the end of the journey.',
 meaning:'The unfinished idea became a film that could be seen and judged beyond the production itself.',
 history:'MoMA documents the film’s May 1955 world premiere during its Indian art exhibition. Its subsequent recognition developed over time; this is not a reenactment of audience response.',
 visual:'Original cinema-screen graphic only. No footage of the actual 1955 MoMA premiere or film still.',
 prompt:'THE FIRST SCREENING',bg:'radial-gradient(ellipse at 76% 38%,#b3aa91,#4b5150 37%,#101b20 84%)',sources:[2,0]},
 {year:'AUG 1955',place:'CALCUTTA · RELEASE',name:'A filmmaker is born',mode:'release',kind:'screen',
 title:'The film was released.<br><em>A new life began.</em>',
 lead:'Pather Panchali opened in Calcutta in August 1955.',
 more:'Its path to recognition continued through reviews, audiences and international screenings. Ray had not just imagined a film; he and his collaborators had made one.',
 meaning:'Act IV closes on the achievement of creating the first feature, while the director’s future work still lay ahead.',
 history:'Indian film catalogues record the film’s release on 26 August 1955; accounts describe reception building over time. We make no claim that its global reputation was immediate.',
 visual:'Original theatrical light-and-film motif. Not a real release print, poster or still from Pather Panchali.',
 prompt:'END OF THE FIRST FILM',bg:'radial-gradient(ellipse at 71% 36%,#d4bc92,#6e6a4e 38%,#1a2b29 89%)',sources:[0,2,3]}
];
const storeKey='origin_v10_act4_scene_v1';
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
 $('beatId').textContent=String(current+1).padStart(2,'0')+' / 12';
 $('storyTitle').innerHTML=scene.title;
 $('storyLead').textContent=scene.lead;
 $('storyMore').textContent=scene.more;
 $('visualOrigin').textContent=scene.asset?'ARCHIVAL PHOTO · DATE EXPLAINED IN CONTEXT':'ORIGINAL VISUAL INTERPRETATION · NOT AN ARCHIVAL PHOTOGRAPH';
 const obs=$('observeButton');
 obs.hidden=!scene.observe;obs.textContent='Compare framing ◎';obs.setAttribute('aria-pressed','false');
 $('exerciseNote').hidden=true;$('exerciseNote').textContent='';$('visualDetail').hidden=true;stage.classList.remove('observing');
 $('frameLabel').textContent=(scene.kind==='frame'?'ORIGINAL STORYBOARD STUDY · NOT A FILM STILL':scene.kind==='filmstrip'?'ORIGINAL EDITING STUDY · NOT AN ACTUAL FILMSTRIP':'ORIGINAL EDITORIAL PRODUCTION GRAPHIC');
 $('storyPrompt').textContent=scene.prompt;
 $('railCaption').textContent=String(current+1).padStart(2,'0')+' / 12';
 $('railYear').textContent=scene.year;
 $('railFill').style.height=Math.round((current+1)/scenes.length*100)+'%';
 $('railFill').style.width=Math.round((current+1)/scenes.length*100)+'%';
 $('prev').disabled=current===0;
 if(current===0){$('prev').disabled=false;$('prev').setAttribute('aria-label','Return to the final scene of Act III');}else{$('prev').setAttribute('aria-label','Previous scene');}
 $('nextLabel').textContent=current===scenes.length-1?'Finish Act IV':'Continue the story';
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
 const label=document.createElement('span');label.className='map-name';label.textContent=scenes[i].name;const flag=document.createElement('span');flag.className='map-stage';flag.textContent=String(i+1).padStart(2,'0')+'/12';
 b.append(date,label,flag);b.addEventListener('click',()=>{$('mapDialog').close();move(i);});$('mapList').append(b);
}
$('prev').addEventListener('click',()=>{if(current===0)window.location.assign('/v10/journey/act3/#scene-10');else move(current-1);});
$('next').addEventListener('click',()=>{if(current===scenes.length-1)complete();else move(current+1);});
$('restart').addEventListener('click',restart);
$('observeButton').addEventListener('click',()=>{
 if(!scenes[current].observe)return;
 const active=!stage.classList.contains('observing');
 stage.classList.toggle('observing',active);
 $('visualDetail').hidden=!active;
 $('observeButton').setAttribute('aria-pressed',String(active));
 $('observeButton').textContent=active?'Return to wide composition ↗':'Compare framing ◎';
 const note=$('exerciseNote');
 note.hidden=!active;
 note.textContent=active?'EDITORIAL DEMONSTRATION: A tighter frame changes what you notice. This is not Ray’s shot or a claim about his exact framing.':'';
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
