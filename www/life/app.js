/* ORIGIN V8 — Life First. All photos have source records and period disclosures.
   The story is a researched editorial treatment, not reconstructed scenes or dialogue. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const records = {
 child:{src:'https://upload.wikimedia.org/wikipedia/commons/8/86/Satyajit_ray_little.jpg',url:'https://commons.wikimedia.org/wiki/File:Satyajit_ray_little.jpg',label:'ARCHIVAL PORTRAIT · CIRCA 1930',caption:'Satyajit Ray as a child, in a photograph dated 1930 on Wikimedia Commons. When used for earlier or later moments, it is a reference portrait—not a photograph of that event.',context:'PORTRAIT FROM APPROXIMATELY 1930'},
 parents:{src:'https://upload.wikimedia.org/wikipedia/commons/0/0c/Sukumar_Ray_and_his_wife.jpg',url:'https://commons.wikimedia.org/wiki/File:Sukumar_Ray_and_his_wife.jpg',label:'ARCHIVAL FAMILY PORTRAIT · 1914',caption:'Sukumar Ray and Suprabha Ray photographed in 1914, seven years before their son Satyajit was born. This picture does not depict his birth or his father’s death.',context:'PHOTOGRAPH FROM 1914 · BEFORE SATYAJIT WAS BORN'},
 young:{src:'https://upload.wikimedia.org/wikipedia/commons/4/42/Satyajit-Ray-Young.jpg',url:'https://commons.wikimedia.org/wiki/File:Satyajit-Ray-Young.jpg',label:'ARCHIVAL PORTRAIT · APPROX. 1940–1943',caption:'Portrait of a young Satyajit Ray at approximately the period of his Santiniketan years. The Commons file supplies conflicting 1940 / 1943 dates; its precise date is uncertain.',context:'APPROXIMATE DATE · NOT A PHOTO OF THIS EVENT'},
 none:{src:'',url:'',label:'NO CLEARED PHOTOGRAPH FOR THIS MOMENT',caption:'This chapter is presented as researched text and original typographic artwork until an appropriately licensed, period-accurate archival image is added.',context:'TEXTUAL STORY OVERVIEW · NO ARCHIVAL PHOTO'}
};
const sources={
 oscar:{name:'Academy — Ray’s honorary award and acceptance',url:'https://www.oscars.org/oscars/ceremonies/1992'},
 speech:{name:'Academy — Satyajit Ray acceptance transcript',url:'https://aaspeechesdb.oscars.org/'},
 growing:{name:'Satyajit Ray Archive — Growing up, 1921–1939',url:'https://satyajitray.org/growing-up/'},
 bio:{name:'Satyajit Ray Archive — Biography',url:'https://satyajitray.org/biography/'},
 society:{name:'Satyajit Ray Society — Biography',url:'https://www.satyajitraysociety.org/biography.html'},
 design:{name:'Satyajit Ray Archive — Advertising and graphic design',url:'https://satyajitray.org/advertising-graphic-design/'},
 chronology:{name:'Satyajit Ray Archive — Filmography',url:'https://satyajitray.org/filmography/'},
 study:{name:'Tuli Research Centre — Integrated timeline',url:'https://tuliresearchcentre.org/person-film-maker/satyajit-ray/agraphy/integrated-timeline/'}
};
const acts=[
 {year:'1992',era:'PROLOGUE · CALCUTTA',phase:'A life remembered',overline:'WE BEGIN AT THE END — THEN REWIND',title:'A lifetime of cinema. <em>One remembered boy.</em>',lead:'In March 1992, Satyajit Ray received an honorary Academy Award. In his recorded acceptance, he spoke about becoming fascinated by the movies as a schoolboy.',body:'Rather than begin with the director’s famous films, ORIGIN starts with the question behind them: who was that schoolboy, and what led him toward the camera? After this prologue, the story travels back to Calcutta in 1921.',meaning:'Knowing the celebrated artist is not the same as knowing the person who grew into him.',image:'child',head:'Long before the award',orientation:'A prologue set in 1992, using a clearly labeled childhood portrait from around 1930.',sources:['speech','oscar','bio'],editorial:'The connection between the award and an origin-story structure is our editorial choice; no fictional acceptance dialogue is used.',choices:[['Where the story ends','His recognition provides context for the journey, not the beginning of his identity.'],['Where the story begins','He was once a child watching films and discovering ways of seeing.']]},
 {year:'1921',era:'ACT I · CALCUTTA',phase:'Childhood · Chapter 1',overline:'THE FAMILY BEFORE THE FILMMAKER',title:'He was born into a house <em>full of stories.</em>',lead:'On 2 May 1921, Satyajit Ray was born to Sukumar Ray and Suprabha Ray in Calcutta.',body:'His father wrote and illustrated imaginative Bengali literature. His grandfather Upendrakishore had been a writer, musician, illustrator and printing pioneer. Satyajit arrived in a family where making pictures and making stories were already closely connected.',meaning:'His life in the arts did not begin with a camera. Books, printing and images surrounded his family history.',image:'parents',head:'Before the child came the storytellers',orientation:'1921 · You are meeting Ray’s family. The photograph was taken in 1914, before his birth.',sources:['growing','society'],editorial:'We infer the family’s creative environment from documented work; the photo is older than Ray’s birth.',question:'Which kind of work already belonged to this family?',choices:[['Drawing and printed stories','Sukumar and Upendrakishore worked with illustration, writing and print culture.'],['Film directing','No: Ray’s filmmaking career came decades later. This chapter concerns earlier influences.']]},
 {year:'1923',era:'ACT I · EARLY LOSS',phase:'Childhood · Chapter 2',overline:'THE HOUSEHOLD CHANGES',title:'His father died. <em>He was two.</em>',lead:'Sukumar Ray died in September 1923, when his son was only two years old.',body:'Suprabha Ray raised the young Satyajit. The family’s changing circumstances would later require them to leave their spacious family home. We know these events from biographies; we cannot claim to know precisely what the two-year-old felt or remembered.',meaning:'The story of Ray’s childhood includes loss and his mother’s persistence, not only a celebrated family legacy.',image:'parents',head:'The family before the loss',orientation:'1923 · His father’s death. The family portrait shown is from 1914.',sources:['growing','study'],editorial:'No imagined final conversation, reconstructed grief, or falsely dated photograph appears in this scene.'},
 {year:'1926',era:'ACT I · A NEW HOME',phase:'Childhood · Chapter 3',overline:'LIFE BEYOND GARPAR ROAD',title:'A different home. <em>A different childhood.</em>',lead:'After the family printing business changed hands, Ray and his mother left the larger family house and moved to his maternal uncle’s home.',body:'Suprabha taught needlework to supplement their income. The young boy’s world included relatives, books, visual curiosities and the changing life of Calcutta. Biographical accounts describe his fascination with image-making devices such as a stereoscope and a magic lantern.',meaning:'The ordinary things a child looks at can help form the eye of a future artist. That is an interpretation, not a claim of a single life-changing instant.',image:'child',head:'The boy before the films',orientation:'Mid-1920s · The scene concerns a move; the child portrait is from around 1930.',sources:['growing','study'],editorial:'The move is documented; this image was not taken on moving day.',question:'What is a stereoscope?',choices:[['A way to view paired images','A stereoscope presents two slightly different pictures to suggest depth.'],['A movie camera','No. It is a viewing device, not a camera Ray used to make films.']]},
 {year:'1930s',era:'ACT I · DISCOVERING CINEMA',phase:'Childhood · Chapter 4',overline:'THE WORLD ON A SCREEN',title:'He began to watch <em>differently.</em>',lead:'As a schoolboy, Ray became an enthusiastic cinema fan. He read film magazines, watched popular movies and developed a sustained interest in music.',body:'His interests expanded beyond movie stars toward filmmaking craft. Accounts of his school and college years describe him studying how directors constructed scenes and how images and cuts shaped narrative.',meaning:'Becoming a filmmaker first meant learning to look. The skill grew over time; it was not one magical evening.',image:'child',head:'A schoolboy and a widening world',orientation:'1930s · You are in Ray’s school years, viewing a photograph recorded as 1930.',sources:['growing','speech'],editorial:'The developing interest is documented; no particular film is claimed to be playing in this photograph.',question:'What changed as his film interest deepened?',choices:[['He noticed decisions behind scenes','Yes: direction, framing, cuts and structure became increasingly important to him.'],['He stopped loving films','No: his interest broadened from entertainment toward film form.']]},
 {year:'1939',era:'ACT I · A QUESTION OF WORK',phase:'Early adulthood · Chapter 5',overline:'AN ARTIST WITHOUT A CAREER PLAN',title:'A love of cinema. <em>Not yet a film career.</em>',lead:'After graduating in 1939, Ray was interested in commercial art rather than entering filmmaking immediately.',body:'His mother urged him to continue studying at Santiniketan. Though initially reluctant, he agreed. The choice placed him amid teachers and artistic traditions that expanded his training and outlook.',meaning:'A creator’s path often begins with a different job and a willingness to keep learning.',image:'young',head:'The young artist',orientation:'1939 · Graduation and a decision about study; the available portrait is approximately 1940–1943.',sources:['growing','bio'],editorial:'The photograph may postdate the decision by several years. It is not a picture of a graduation event.'},
 {year:'1940–42',era:'ACT II · SANTINIKETAN',phase:'The artist · Chapter 1',overline:'A NEW WAY OF SEEING',title:'The world became <em>an art classroom.</em>',lead:'At Santiniketan, Ray studied art and encountered teachers including Nandalal Bose and Benode Behari Mukherjee.',body:'His time in an artistic environment broadened his understanding of Indian art and visual observation. This was a foundation for future work across illustration, graphic design and filmmaking, though it would be simplistic to credit any one lesson with his whole style.',meaning:'A filmmaker’s eye develops through more than movies alone.',image:'young',head:'Ray in his early artistic years',orientation:'1940–42 · Santiniketan studies. Portrait date listed inconsistently around 1940–1943.',sources:['bio','society','study'],editorial:'This is an editorial account of the significance of his training, not a recreation of a particular classroom.'},
 {year:'1943',era:'ACT III · THE WORKING ARTIST',phase:'Graphic design · Chapter 1',overline:'BEFORE HE DIRECTED',title:'He made a living <em>making images.</em>',lead:'In April 1943, Ray joined D. J. Keymer as a junior visualiser in advertising.',body:'Commercial art, typography and book jackets became substantial creative work. In 1944 he illustrated an abridged edition of Pather Panchali for Signet Press, becoming familiar with a story he would later adapt for cinema.',meaning:'The same creator worked through pictures and stories before he ever made his first feature film.',image:'young',head:'An illustrator’s eye',orientation:'1943 · The advertising years begin. Portrait approximately from this general period.',sources:['design','bio'],editorial:'No actual advertisement or book jacket is reproduced here; those need individual asset clearance.'},
 {year:'1947',era:'ACT III · THE FILM FAN',phase:'Cinema culture · Chapter 2',overline:'FROM WATCHER TO STUDENT OF CINEMA',title:'Cinema became <em>a shared obsession.</em>',lead:'Ray helped found the Calcutta Film Society in 1947.',body:'The society created space for serious film viewing and discussion. While earning a living in graphic design, Ray was increasingly drawn toward understanding world cinema as an expressive art form.',meaning:'Creative ambition grows through communities of practice, not only private inspiration.',image:'young',head:'The developing cinephile',orientation:'1947 · The film society era. Photo is from an earlier period.',sources:['bio','society'],editorial:'This portrait is not a photograph of the Film Society meeting.'},
 {year:'1950',era:'ACT III · A FILM BECOMES POSSIBLE',phase:'The dream · Chapter 3',overline:'THE IMAGINATION TURNS TOWARD FILM',title:'Could a film be made <em>outside a studio?</em>',lead:'A trip to London in 1950 exposed Ray to many films, including Vittorio De Sica’s Bicycle Thieves.',body:'Ray later discussed the impact of Italian neorealism on his thinking about practical locations and non-professional performers. By then he had already encountered the novel Pather Panchali through his design work. A film of his own was becoming imaginable.',meaning:'Watching a film can open a practical possibility: cinema need not resemble the dominant studio productions of its day.',image:'young',head:'A filmmaker in formation',orientation:'1950 · A viewing influence, accompanied by an earlier portrait.',sources:['bio','society','design'],editorial:'We are not claiming this portrait was taken in London or at a screening.'},
 {year:'1952–55',era:'ACT IV · THE FIRST FILM',phase:'Making cinema · Chapter 1',overline:'THE FIRST PRODUCTION',title:'A film begun before <em>everything was secure.</em>',lead:'Ray started filming Pather Panchali in 1952. The production faced prolonged interruptions and serious financing difficulties before its completion in 1955.',body:'He worked with collaborators including cinematographer Subrata Mitra and editor Dulal Dutta. The film’s gradual making demanded persistence across multiple years. Rather than invent an on-set conversation, we focus on what the surviving production history tells us.',meaning:'The leap from film lover to director was not a glamorous instant. It required years of work under difficult conditions.',image:'none',head:'The first film takes shape',orientation:'1952–55 · A historically researched production overview without a period-cleared on-set photo.',sources:['bio','society','chronology'],editorial:'The media panel uses type, not a false documentary image or invented film still.'},
 {year:'1955–59',era:'ACT V · FINDING A LANGUAGE',phase:'The early films · Overview',overline:'A FILM DOES NOT DEFINE A FILMMAKER',title:'One debut. <em>Then many kinds of cinema.</em>',lead:'Pather Panchali opened Ray’s feature-film career in 1955. Aparajito followed in 1956, while other early films took him into comedy, musical elegy and adult drama.',body:'Parash Pathar and Jalsaghar appeared in 1958; Apur Sansar completed the Apu story in 1959. Our existing Story-First 1.6 experience explores these years in much greater depth; this V8 moment connects the biography to that earlier research.',meaning:'A creator develops by exploring different forms, not only repeating a first success.',image:'none',head:'The early films',orientation:'1955–59 · This is a condensed bridge to the deeper Story-First 1.6 experience.',sources:['bio','chronology'],editorial:'The film-by-film interactive story remains in the existing Story-First experience.'},
 {year:'1960s',era:'ACT VI · A WIDER VOICE',phase:'Mature career · Overview',overline:'MORE THAN THE APU TRILOGY',title:'His cinema kept <em>changing shape.</em>',lead:'Through the 1960s Ray made films including Mahanagar (1963), Charulata (1964) and Nayak (1966).',body:'His subjects expanded across city life, social constraints, performance and inward experience. He was also a writer, illustrator and musical creator. These decades deserve detailed future chapters with their own verified film materials.',meaning:'The evolution of an artist cannot be reduced to the work that first brought international recognition.',image:'none',head:'Changing form, changing subjects',orientation:'1960s · A concise overview, not a fully developed narrative chapter.',sources:['bio','chronology'],editorial:'We do not assert undocumented motives for individual film choices.'},
 {year:'1977',era:'ACT VI · NEW TERRITORY',phase:'Later career · Overview',overline:'A LANGUAGE AND A DIFFERENT HISTORICAL WORLD',title:'The director explored <em>new territory.</em>',lead:'In 1977 Ray made Shatranj Ke Khilari (The Chess Players), his first Hindi-language feature.',body:'Set around nineteenth-century Awadh, the film worked with a different historical and linguistic context. It is a major chapter of Ray’s later career, but not yet reproduced here in full.',meaning:'A mature creative voice can enter new settings without losing its curiosity about human behaviour.',image:'none',head:'The Chess Players',orientation:'1977 · Brief historical overview, not a complete film chapter.',sources:['bio','chronology'],editorial:'Film visuals and detailed production documents have not yet been licensed for this preview.'},
 {year:'1983–92',era:'ACT VII · THE FINAL YEARS',phase:'Final years · Overview',overline:'CREATING UNDER NEW LIMITS',title:'His health changed. <em>The work continued.</em>',lead:'Health problems increasingly affected Ray during the 1980s. He still made later films including Ganashatru (1989), Shakha Proshakha (1990) and Agantuk (1991).',body:'The final decade joins changes in his health with continued writing and filmmaking. We will not invent private conversations or speculate about inner states. These later years call for careful archival research before becoming full interactive chapters.',meaning:'The last period of an artist’s life deserves the same care as the first breakthrough.',image:'none',head:'The final works',orientation:'1983–92 · A short overview awaiting further source-led expansion.',sources:['society','bio','chronology'],editorial:'The scene is an overview, not a dramatization of Ray’s medical history.'},
 {year:'1992',era:'EPILOGUE · CALCUTTA',phase:'The legacy · Epilogue',overline:'THE LIFE RETURNS TO THE PROLOGUE',title:'The films remain. <em>The boy is still there.</em>',lead:'Satyajit Ray received an honorary Academy Award in March 1992 and died in Calcutta on 23 April 1992.',body:'His films, books, illustrations and music remain central to how people encounter him. But the journey makes a different point: before the internationally known filmmaker stood a curious boy, a working artist, a cinema lover and someone who kept learning through his work.',meaning:'The goal of ORIGIN is not simply to remember a filmography. It is to understand a creative life, one documented turning point at a time.',image:'child',head:'Back to the beginning',orientation:'1992 · The biographical preview closes by returning to his childhood portrait from around 1930.',sources:['speech','society','bio'],editorial:'The closing reflection is ours. No invented last words or final encounter are represented.'}
];
const CHAPTERS=[
  {label:'1992 · Prologue',name:'Why begin at the end?',index:0,flag:'OPENING'},
  {label:'1921–39',name:'The boy and his world',index:1,flag:'DEEPER'},
  {label:'1940–42',name:'Learning to see',index:6,flag:'EARLY'},
  {label:'1943–50',name:'The working artist',index:7,flag:'EARLY'},
  {label:'1952–55',name:'Making the first film',index:10,flag:'OVERVIEW'},
  {label:'1955–59',name:'The films take shape',index:11,flag:'OVERVIEW'},
  {label:'1960–79',name:'The changing filmmaker',index:12,flag:'OVERVIEW'},
  {label:'1983–92',name:'Later life and final works',index:14,flag:'OVERVIEW'},
  {label:'1992 · End',name:'A life remembered',index:15,flag:'EPILOGUE'}
];
const KEY='origin_v8_life_scene_v1';
let current=0;
try{const stored=Number(localStorage.getItem(KEY));if(Number.isInteger(stored)&&stored>0&&stored<acts.length)current=stored;}catch{}
const cleanHash=/^#moment-(\d+)$/.exec(location.hash);if(cleanHash&&Number(cleanHash[1])>=0&&Number(cleanHash[1])<acts.length)current=Number(cleanHash[1]);
const image=$('sceneImage');
let prevFocus=null;
function makeEl(tag,text){const x=document.createElement(tag);x.textContent=text;return x;}
function sourcesFor(act){
 const host=$('sourceContainer');host.replaceChildren();
 const ul=document.createElement('ul');ul.className='source-list';
 for(const key of act.sources){const source=sources[key];if(!source)continue;const li=document.createElement('li'),a=document.createElement('a');a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=source.name+' ↗';li.append(a);ul.append(li);}
 host.append(ul);
 const note=makeEl('p','Editorial boundary: '+act.editorial);host.append(note);
 const imageNote=makeEl('p','Image record: '+records[act.image].label+'. This prototype uses Wikimedia Commons file pages for attribution and public-domain claims that can vary by jurisdiction. Global commercial reuse requires separate review.');host.append(imageNote);
}
function render(index, options={}){
 if(index<0||index>=acts.length)return;
 current=index;
 const act=acts[index],media=records[act.image];
 $('sceneEra').textContent=act.year+' · '+act.era;
 $('sceneCounter').textContent=String(index+1).padStart(2,'0')+' OF '+acts.length;
 $('sceneOverline').textContent=act.overline;
 $('sceneTitle').innerHTML=act.title;
 $('sceneLead').textContent=act.lead;
 $('sceneBody').textContent=act.body;
 $('sceneMeaning').textContent=act.meaning;
 $('imageHeadline').textContent=act.head;
 $('imageContextLabel').textContent=media.context;
 $('photoCategory').textContent=media.label;
 $('photoCount').textContent=String(index+1).padStart(2,'0')+' / '+acts.length;
 $('photoCaption').textContent=media.caption;
 $('imageAttribution').hidden=!media.url;
 if(media.url){$('imageAttribution').href=media.url;}
 if(media.src){
   image.hidden=false;$('imageFallback').hidden=true;
   image.alt='Historical image: '+media.caption;
   if(image.getAttribute('src')!==media.src) image.src=media.src;
   if(image.complete && image.naturalWidth===0){image.hidden=true;$('imageFallback').hidden=false;}
 } else {image.hidden=true;$('imageFallback').hidden=false;}
 $('fallbackYear').textContent=act.year;
 $('orientationText').textContent=act.orientation;
 $('orientationTag').textContent=act.phase.toUpperCase();
 const ex=$('interaction'),choiceBox=$('choiceContainer');choiceBox.replaceChildren();
 $('choiceResult').textContent='';
 ex.hidden=!act.choices?.length;
 if(act.choices?.length){
  $('questionTitle').textContent=act.question||'Which part would you like to examine?';
  act.choices.forEach(([label,answer])=>{
    const b=makeEl('button',label);b.type='button';b.setAttribute('aria-pressed','false');
    b.addEventListener('click',()=>{
      choiceBox.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
      $('choiceResult').textContent=answer;
    });choiceBox.append(b);
  });
 }
 sourcesFor(act);
 $('prevButton').disabled=index===0;
 $('nextButton').innerHTML=index===0?'Rewind to his childhood <span aria-hidden="true">→</span>':index===acts.length-1?'Start the journey again <span aria-hidden="true">↺</span>':'Continue the life story <span aria-hidden="true">→</span>';
 const pct=Math.round((index+1)/acts.length*100);
 $('progressStatus').textContent='Moment '+(index+1)+' of '+acts.length+' · '+(index<11?'a life taking shape':'later-life overview');
 $('progressPercent').textContent=pct+'%';
 $('progressBar').setAttribute('aria-valuenow',String(pct));
 $('progressFill').style.width=pct+'%';
 document.querySelectorAll('#timelineList button').forEach(b=>b.dataset.active=String(Number(b.dataset.index)===index));
 try{localStorage.setItem(KEY,String(index));}catch{}
 if(!options.skipHash){history.replaceState(null,'','#moment-'+index);}
 if(options.focus){
   $('sceneTitle').focus({preventScroll:true});
   window.scrollTo({top:0,behavior:'instant'});
 }
}
image.addEventListener('error',()=>{image.hidden=true;$('imageFallback').hidden=false;});
image.addEventListener('load',()=>{const active=records[acts[current].image].src;if(active && image.src===active){$('imageFallback').hidden=true;image.hidden=false;}});
function openDialog(id,trigger){prevFocus=trigger;$(id).showModal();trigger.setAttribute('aria-expanded','true');}
function closeDialog(id){$(id).close();document.querySelector('[aria-controls="'+id+'"]')?.setAttribute('aria-expanded','false');if(prevFocus?.isConnected)prevFocus.focus();}
for(const item of CHAPTERS){
 const b=document.createElement('button');b.type='button';b.dataset.index=item.index;
 const year=makeEl('span',item.label);year.className='timeline-date';
 const main=document.createElement('span');const strong=makeEl('strong',item.name);const small=makeEl('small',item.index<6?'Fully guided early-life moment':'Short researched overview / not a full chapter');
 main.append(strong,small);
 const flag=makeEl('span',item.flag);flag.className='flag';
 b.append(year,main,flag);
 b.addEventListener('click',()=>{closeDialog('timelineDialog');render(item.index,{focus:true});});
 $('timelineList').append(b);
}
$('prevButton').addEventListener('click',()=>render(current-1,{focus:true}));
$('nextButton').addEventListener('click',()=>render(current===acts.length-1?0:current+1,{focus:true}));
$('overviewButton').setAttribute('aria-controls','timelineDialog');
$('helpButton').setAttribute('aria-controls','helpDialog');
$('overviewButton').addEventListener('click',e=>openDialog('timelineDialog',e.currentTarget));
$('helpButton').addEventListener('click',e=>openDialog('helpDialog',e.currentTarget));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(b.dataset.close)));
for(const id of ['helpDialog','timelineDialog']){$(id).addEventListener('close',()=>{const button=document.querySelector('[aria-controls="'+id+'"]');if(button)button.setAttribute('aria-expanded','false');});}
window.addEventListener('keydown',event=>{
 if(event.key==='ArrowRight'&&!$('timelineDialog').open&&!$('helpDialog').open&&!(event.target instanceof HTMLButtonElement)&&current<acts.length-1)render(current+1,{focus:true});
 if(event.key==='ArrowLeft'&&!$('timelineDialog').open&&!$('helpDialog').open&&!(event.target instanceof HTMLButtonElement)&&current>0)render(current-1,{focus:true});
});
window.addEventListener('hashchange',()=>{const m=/^#moment-(\d+)$/.exec(location.hash);if(m&&+m[1]<acts.length)render(+m[1],{focus:true});});
render(current,{skipHash:!!cleanHash});
})();
