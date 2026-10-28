/* ORIGIN V11.3 — source-led, local-only Creator Studio schema.
   Data is selected into a strict renderer-compatible subset; never eval imported content.
   This schema is intentionally independent of any named creator. */
(()=>{'use strict';
const DRAFT_KEY='origin_v11_studio_local_draft_v1';
const MAX_BYTES=300000;
const TEMPLATES=['abstract','field','absence','studio','paper','frame','sound','negative','archive','map','ensemble'];
const TYPES=['literary','graphic','neutral'];
const COMPOSITIONS=['observational','angular','balanced'];
const MOTIONS=['dissolve','cut','steady'];
const RIGHTS=['not-reviewed','permission-required','cleared'];
const colors={accent:'#dfb986',glow:'#826b4e',shadow:'#101b1a',paper:'#f8ebd9'};
const okayColor=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v);
const okayUrl=v=>{try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}};
const text=v=>typeof v==='string'?v.trim():'';
const sourceId=id=>typeof id==='string'&&/^[a-z0-9][a-z0-9-]{0,39}$/.test(id);
const identity=()=>({...colors,typography:'literary',composition:'balanced',motion:'steady',signature:'A HUMAN JOURNEY'});
let counter=0;
function id(prefix){counter+=1;return prefix+'-'+counter.toString(36)+'-'+Date.now().toString(36).slice(-6);}
function scene(){return {id:id('scene'),year:'',place:'',title:'',lead:'',more:'',meaning:'',history:'',visual:'Original symbolic illustration; not historical footage',prompt:'STORY MOMENT',visualTemplate:'abstract',sources:[],rights:'not-reviewed',rightsNote:''};}
function act(){return {id:id('act'),name:'',period:'',archive:[],scenes:[scene()]};}
function blank(){return {schemaVersion:1,profile:{name:'',subtitle:'',role:'',years:'',culture:'',identity:identity()},acts:[act()]};}
function demo(){
 const doc=blank();
 doc.profile={name:'Satyajit Ray — Studio Sample',subtitle:'A one-moment editorial demonstration',role:'Filmmaker',years:'1921 · sample preview only',culture:'Bengal, India',identity:identity()};
 const ch=doc.acts[0];ch.name='A starting point';ch.period='1921';
 ch.archive=[{id:'ray-biography',label:'Satyajit Ray Archive — Biography',url:'https://satyajitray.org/biography/'}];
 ch.scenes[0]={...ch.scenes[0],year:'1921',place:'CALCUTTA',title:'A life begins',lead:'Satyajit Ray was born in Calcutta on 2 May 1921.',more:'This short scene demonstrates an editorial workflow; it is not a replacement for ORIGIN’s complete Ray biography.',history:'The Satyajit Ray Archive records his birth and biographical background.',meaning:'A starting point for researching a life.',prompt:'THE FIRST MOMENT',visual:'Original illustrated design, not a photograph of the historical event.',visualTemplate:'paper',sources:['ray-biography']};
 return doc;
}
function validate(doc){
 const errors=[],warnings=[];
 const fail=(where,msg)=>{if(errors.length<80)errors.push(where+': '+msg);};
 if(!doc||typeof doc!=='object'||Array.isArray(doc))return {ok:false,errors:['Draft: expected a JSON object'],warnings};
 let size=0;try{size=JSON.stringify(doc).length;}catch{fail('Draft','cannot serialize');}
 if(size>MAX_BYTES)fail('Draft','exceeds 300 KB');
 if(doc.schemaVersion!==1)fail('Draft','unsupported schema version');
 const p=doc.profile;
 if(!p||typeof p!=='object'||Array.isArray(p))fail('Profile','missing');
 else {
  for(const [field,min,max] of [['name',2,100],['subtitle',4,150],['role',2,100],['years',2,100],['culture',2,100]]){
   const v=text(p[field]);if(v.length<min||v.length>max||/[<>]/.test(v))fail('Profile '+field,'enter plain text ('+min+'–'+max+' characters)');
  }
  const i=p.identity;
  if(!i||typeof i!=='object'||Array.isArray(i))fail('Profile identity','missing');
  else {
   for(const key of Object.keys(colors))if(!okayColor(i[key]))fail('Identity '+key,'six-digit hex color required');
   if(!TYPES.includes(i.typography))fail('Identity typography','unsupported preset');
   if(!COMPOSITIONS.includes(i.composition))fail('Identity composition','unsupported preset');
   if(!MOTIONS.includes(i.motion))fail('Identity motion','unsupported preset');
   if(!/^[A-Za-z0-9 &·.,'-]{2,52}$/.test(i.signature||''))fail('Identity signature','2–52 simple characters required');
  }
 }
 if(!Array.isArray(doc.acts)||doc.acts.length<1||doc.acts.length>12){fail('Chapters','need 1–12 chapters');return {ok:false,errors,warnings};}
 let total=0;
 const chapterIds=new Set();
 for(const [a,chapter] of doc.acts.entries()){
  const path='Chapter '+(a+1);
  if(!chapter||typeof chapter!=='object'||Array.isArray(chapter)){fail(path,'invalid chapter');continue;}
  if(!sourceId(chapter.id)||chapterIds.has(chapter.id))fail(path+' identity','unique chapter ID required');
  chapterIds.add(chapter.id);
  for(const [key,min,max] of [['name',2,100],['period',2,80]]){const v=text(chapter[key]);if(v.length<min||v.length>max||/[<>]/.test(v))fail(path+' '+key,'plain text required');}
  if(!Array.isArray(chapter.archive)||chapter.archive.length<1||chapter.archive.length>40)fail(path+' sources','add 1–40 documented sources');
  const known=new Set();
  for(const [index,source] of (Array.isArray(chapter.archive)?chapter.archive:[]).entries()){
   if(!source||typeof source!=='object'){fail(path+' source '+(index+1),'invalid');continue;}
   if(!sourceId(source.id)||known.has(source.id))fail(path+' source '+(index+1),'unique slug identifier required');
   known.add(source.id);
   if(text(source.label).length<3||text(source.label).length>180||/[<>]/.test(source.label))fail(path+' source '+(index+1),'valid source title required');
   if(!okayUrl(source.url))fail(path+' source '+(index+1),'HTTPS URL required');
  }
  if(!Array.isArray(chapter.scenes)||chapter.scenes.length<1||chapter.scenes.length>40){fail(path+' scenes','need 1–40 scenes');continue;}
  total+=chapter.scenes.length;
  const sceneIds=new Set();
  for(const [s,beat] of chapter.scenes.entries()){
   const pth=path+' / scene '+(s+1);
   if(!beat||typeof beat!=='object'){fail(pth,'invalid');continue;}
   if(!sourceId(beat.id)||sceneIds.has(beat.id))fail(pth+' identity','unique scene ID required');
   sceneIds.add(beat.id);
   for(const [key,min,max] of [['year',1,50],['place',2,120],['title',3,220],['lead',15,1200],['more',15,2500],['history',12,2200],['meaning',5,1400],['visual',12,1000],['prompt',2,70]]){
    const v=text(beat[key]);if(v.length<min||v.length>max||/[<>]/.test(v))fail(pth+' '+key,'plain text ('+min+'–'+max+' chars) required');
   }
   if(!TEMPLATES.includes(beat.visualTemplate))fail(pth+' visualTemplate','unsupported template');
   if(!RIGHTS.includes(beat.rights))fail(pth+' image rights','choose a valid review status');
   if(!Array.isArray(beat.sources)||beat.sources.length<1)fail(pth+' citations','cite at least one chapter source');
   else for(const ref of beat.sources)if(!known.has(ref))fail(pth+' citations','unknown reference '+String(ref).slice(0,40));
   if(beat.rights==='cleared'&&text(beat.rightsNote).length<12)fail(pth+' image rights','cleared status needs a rights-evidence note');
   if(beat.rights!=='cleared')warnings.push(pth+': image rights not cleared; preview uses only original generated shapes');
  }
 }
 if(total>120)fail('Draft','maximum 120 scenes per draft');
 return {ok:errors.length===0,errors,warnings};
}
function compile(doc){
 const report=validate(doc);
 if(!report.ok)throw Error('Cannot preview an invalid draft: '+report.errors.slice(0,3).join('; '));
 const p=doc.profile;
 const profile={id:'studio-local',name:text(p.name),subtitle:text(p.subtitle),role:text(p.role),years:text(p.years),culture:text(p.culture),preview:true,accent:p.identity.accent,identity:{...p.identity},description:'LOCAL DRAFT PREVIEW · Not reviewed, published or shared.'};
 const acts=doc.acts.map((c,index)=>({
  creatorId:'studio-local',index:index+1,name:text(c.name),period:text(c.period),
  archive:c.archive.map(x=>({label:text(x.label),url:text(x.url)})),
  scenes:c.scenes.map(s=>({
   year:text(s.year),place:text(s.place),title:text(s.title),lead:text(s.lead),more:text(s.more),
   meaning:text(s.meaning),history:text(s.history),
   visual:text(s.visual)+' · Local draft study; no licensed media displayed',
   prompt:text(s.prompt),mode:s.visualTemplate,kind:s.visualTemplate,
   visualTemplate:s.visualTemplate,
   // Studio preview deliberately does not transmit or load any user-supplied images.
   sources:[...new Set(s.sources)].map(v=>c.archive.findIndex(source=>source.id===v)),
   bg:'radial-gradient(ellipse at 70% 36%,'+p.identity.glow+','+p.identity.shadow+' 73%,#0b0d12)',
   observe:s.visualTemplate==='frame'||s.visualTemplate==='negative'
  }))
 }));
 return {profile,acts};
}
window.ORIGIN_STUDIO_SCHEMA=Object.freeze({DRAFT_KEY,MAX_BYTES,TEMPLATES,TYPES,COMPOSITIONS,MOTIONS,RIGHTS,blank,demo,validate,compile,id,scene,act});
})();