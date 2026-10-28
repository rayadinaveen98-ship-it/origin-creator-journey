/* ORIGIN V11.3 — Local editorial workbench. No backend, uploads, or publish action. */
(()=>{'use strict';
const schema=window.ORIGIN_STUDIO_SCHEMA;
const governance=window.ORIGIN_STUDIO_GOVERNANCE;
const $=id=>document.getElementById(id);
const text=value=>typeof value==='string'?value:'';
let draft,selected={kind:'profile',act:0,scene:0},hasReviewed=false;
let reviews=governance.blankReview(),history=[];
function make(tag,cls,content){
 const e=document.createElement(tag);if(cls)e.className=cls;
 if(content!==undefined)e.textContent=content;
 return e;
}
function status(message,problem=false){$('status').textContent=message;$('status').dataset.problem=String(!!problem);}
function safeStore(){
 try{localStorage.setItem(schema.DRAFT_KEY,JSON.stringify(draft));return true;}
 catch{status('Local storage is unavailable or full. Export your JSON to avoid losing work.',true);return false;}
}
function safeRestore(){
 try{const raw=localStorage.getItem(schema.DRAFT_KEY);if(!raw)return null;if(raw.length>schema.MAX_BYTES)return null;return normalize(JSON.parse(raw));}
 catch{return null;}
}
function fieldValue(src,key){return text(src?.[key]);}
function normalize(input){
 if(!input||typeof input!=='object'||Array.isArray(input)||input.schemaVersion!==1||!input.profile||!Array.isArray(input.acts)||input.acts.length<1||input.acts.length>12)throw Error('Unsupported draft structure');
 const clean=schema.blank(),p=input.profile;
 if(typeof p!=='object'||Array.isArray(p))throw Error('Creator profile is missing');
 for(const k of ['name','subtitle','role','years','culture'])clean.profile[k]=fieldValue(p,k).slice(0,5000);
 const ident=p.identity&&typeof p.identity==='object'&&!Array.isArray(p.identity)?p.identity:{};
 for(const k of ['accent','glow','shadow','paper','typography','composition','motion','signature']){
  if(typeof ident[k]==='string')clean.profile.identity[k]=ident[k].slice(0,160);
 }
 clean.acts=input.acts.map(act=>{
  if(!act||typeof act!=='object'||!Array.isArray(act.archive)||!Array.isArray(act.scenes)||act.archive.length>40||act.scenes.length<1||act.scenes.length>40)throw Error('A chapter contains invalid sources or story moments');
  const chapter={id:fieldValue(act,'id')||schema.id('act'),name:fieldValue(act,'name'),period:fieldValue(act,'period'),archive:[],scenes:[]};
  chapter.archive=act.archive.map(s=>({
   id:fieldValue(s,'id')||schema.id('source'),label:fieldValue(s,'label'),url:fieldValue(s,'url')
  }));
  chapter.scenes=act.scenes.map(s=>{
   const beat=schema.scene();
   for(const k of ['id','year','place','title','lead','more','history','meaning','visual','prompt','visualTemplate','rights','rightsNote']){
    if(typeof s?.[k]==='string')beat[k]=s[k].slice(0,6000);
   }
   beat.sources=Array.isArray(s?.sources)?s.sources.filter(x=>typeof x==='string').slice(0,40):[];
   return beat;
  });
  return chapter;
 });
 return clean;
}
function saveReviews(){
 try{localStorage.setItem(governance.REVIEW_KEY,JSON.stringify(reviews));return true;}
 catch{status('Review storage failed. Export a review packet to preserve records.',true);return false;}
}
function saveHistory(){
 try{localStorage.setItem(governance.HISTORY_KEY,JSON.stringify(history));return true;}
 catch{status('Checkpoint storage full. Export your draft, or reduce saved checkpoints.',true);return false;}
}
function reviewControls(host,section,item,chapter,label){
 const wrap=make('div','attestation');
 wrap.append(make('p','attestation-label',label+' · SELF-ATTESTED, NOT APPROVED'));
 const entry=reviews[section][governance.reviewKey(chapter,item)];
 const states=section==='sources'?governance.SOURCE_STATES:section==='scenes'?governance.SCENE_STATES:governance.ASSET_STATES;
 const choices=states.map(x=>[x,x.replace(/-/g,' ')]);
 const selectedState={status:entry?.status||'unreviewed'};
 const pick=addSelect(wrap,selectedState,'status','Review status',choices);
 const noteArea=make('label','field');
 noteArea.append(make('span','field-label','Reason / evidence checked'));
 const area=document.createElement('textarea');area.rows=2;area.maxLength=1000;area.value=entry?.note||'';
 area.placeholder='Explain what you checked and what remains uncertain (at least 12 characters)';
 noteArea.append(area);wrap.append(noteArea);
 const previous=entry?.tag===governance.fingerprint(section==='sources'?governance.sourceContent(item):governance.sceneContent(item,chapter));
 const badge=make('small','attestation-indicator',entry?(previous?'Local review recorded · self-attested':'Outdated — content changed since review'):'Not reviewed');
 if(entry&&!previous)badge.dataset.stale='true';
 wrap.append(badge);
 const btn=action('Record local review',()=>{
  try{
   reviews=governance.mark(reviews,section,item,chapter,pick.value,area.value);
   if(!saveReviews())return;
   updateReviewGate();paint();
   status('Local review recorded. This is not a verified editorial approval.');
  }catch(err){status(String(err.message).slice(0,130),true);}
 });
 wrap.append(btn);host.append(wrap);
}
function updateReviewGate(){
 const r=governance.assess(draft,reviews,schema);
 const el=$('reviewGateStatus');
 el.textContent=r.handoffReady?'Self-attested handoff checklist complete':'Not ready for editorial handoff';
 el.dataset.valid=String(r.handoffReady);
 const m=$('reviewMetrics');m.replaceChildren();
 for(const [name,passed,total] of [['Sources checked',r.counts.checkedSources,r.counts.sources],['Scenes fact-reviewed',r.counts.checkedScenes,r.counts.scenes],['Original visuals declared',r.counts.reviewedMedia,r.counts.media]]){
  const b=make('div','review-metric');
  b.append(make('span','',name),make('strong','',passed+' / '+total));
  m.append(b);
 }
 const messages=$('reviewIssues');messages.replaceChildren();
 for(const s of r.issues.slice(0,6))messages.append(make('p','qa-error',s));
 if(r.issues.length>6)messages.append(make('p','qa-tip','And '+(r.issues.length-6)+' remaining checks'));
 if(!r.issues.length)messages.append(make('p','qa-success','Checklist complete for local handoff only. No authentication or independent approval.'));
 return r;
}
function updateCheckpoints(){
 const sel=$('checkpointList'),keep=sel.value;sel.replaceChildren();
 const empty=document.createElement('option');empty.value='';empty.textContent=history.length?'Choose a checkpoint':'No checkpoints yet';sel.append(empty);
 for(const [index,item] of history.entries()){
  const option=document.createElement('option');option.value=String(index);
  option.textContent=item.title+' · '+item.timestamp.slice(0,16).replace('T',' ');
  sel.append(option);
 }
 if([...sel.options].some(o=>o.value===keep))sel.value=keep;
}
function initial(){
 draft=safeRestore()||schema.blank();
 try{reviews=governance.cleanReviews(JSON.parse(localStorage.getItem(governance.REVIEW_KEY)||'null'));}catch{reviews=governance.blankReview();}
 try{history=governance.cleanHistory(JSON.parse(localStorage.getItem(governance.HISTORY_KEY)||'null'));}catch{history=[];}
 selected={kind:'profile',act:0,scene:0};
 paint();
 status('Draft is local to this browser. Nothing has been uploaded or published.');
}
function set(valueOwner,key,value){
 valueOwner[key]=value;
 const saved=safeStore();
 if(saved)status('Draft autosaved locally · Not published');
 if(hasReviewed)review(false);
 updateReviewGate();
 updateNumbers();
}
function section(parent,title,hint){
 const wrap=make('section','field-section');wrap.append(make('h3','',title));
 if(hint)wrap.append(make('p','section-hint',hint));
 parent.append(wrap);return wrap;
}
function addField(host,owner,key,label,opts={}){
 const wrap=make('label','field');
 wrap.append(make('span','field-label',label));
 const node=opts.multiline?document.createElement('textarea'):document.createElement('input');
 if(!opts.multiline)node.type=opts.type||'text';
 if(opts.multiline)node.rows=opts.rows||3;
 if(opts.max)node.maxLength=opts.max;
 node.name=key;node.value=fieldValue(owner,key);node.placeholder=opts.placeholder||'';
 if(opts.required)node.required=true;
 node.addEventListener('input',()=>set(owner,key,node.value));
 wrap.append(node);
 if(opts.help)wrap.append(make('small','field-hint',opts.help));
 host.append(wrap);
 return node;
}
function addSelect(host,owner,key,label,options){
 const wrap=make('label','field');wrap.append(make('span','field-label',label));
 const select=document.createElement('select');select.name=key;
 for(const [value,textValue] of options){const option=document.createElement('option');option.value=value;option.textContent=textValue;select.append(option);}
 select.value=fieldValue(owner,key);
 select.addEventListener('change',()=>set(owner,key,select.value));
 wrap.append(select);host.append(wrap);return select;
}
function action(textValue,cb,cls='secondary-action'){
 const b=make('button',cls,textValue);b.type='button';b.addEventListener('click',cb);return b;
}
function updateNumbers(){
 $('outlineName').textContent=draft.profile.name||'New creator';
 $('chapterCount').textContent=draft.acts.length+' chapter'+(draft.acts.length===1?'':'s');
 const count=draft.acts.reduce((sum,a)=>sum+a.scenes.length,0);
 $('sceneCount').textContent=count+' moment'+(count===1?'':'s');
 $('validScenes').textContent=String(count);
 $('validSources').textContent=String(draft.acts.reduce((sum,a)=>sum+a.archive.length,0));
}
function outline(){
 const list=$('actList');list.replaceChildren();
 $('profileTab').classList.toggle('active',selected.kind==='profile');
 draft.acts.forEach((act,index)=>{
  const item=make('div','outline-act');
  const b=action(String(index+1).padStart(2,'0')+'  '+(act.name||'Untitled chapter'),
   ()=>{selected={kind:'chapter',act:index,scene:0};paint();},'outline-act-button');
  b.classList.toggle('active',selected.kind!=='profile'&&selected.act===index);
  item.append(b);
  const sub=make('div','outline-scene-list');
  act.scenes.forEach((s,i)=>{
   const sb=action(String(i+1).padStart(2,'0')+'  '+(s.title||'New story moment').slice(0,75),
    ()=>{selected={kind:'scene',act:index,scene:i};paint();},'outline-scene-button');
   sb.classList.toggle('active',selected.kind==='scene'&&selected.act===index&&selected.scene===i);
   sub.append(sb);
  });
  item.append(sub);list.append(item);
 });
}
function showProfile(host){
 $('sectionLabel').textContent='01 / CREATOR PROFILE';$('sectionHeading').textContent='Shape the person';
 const p=draft.profile;
 const biog=section(host,'Creator identity','Write a clear editorial identity. No private research should be stored in this public-site lab.');
 addField(biog,p,'name','Creator name',{required:true,max:100,placeholder:'Full name'});
 addField(biog,p,'subtitle','Cinematic introduction',{required:true,max:150,placeholder:'The story in one sentence'});
 addField(biog,p,'role','Creative field',{required:true,max:100,placeholder:'Filmmaker, writer, inventor…'});
 const row=make('div','form-grid');biog.append(row);
 addField(row,p,'years','Life / timeline range',{required:true,max:100,placeholder:'1921–1992'});
 addField(row,p,'culture','Origin / setting',{required:true,max:100,placeholder:'Bengal, India'});
 const style=section(host,'Cinematic DNA','Choose a mood without coding a new app. Everything is rendered by the same visual and typography system.');
 const i=p.identity;
 const grid=make('div','form-grid');style.append(grid);
 addSelect(grid,i,'typography','Typography',[['literary','Literary · classic serif'],['graphic','Graphic · bold sans'],['neutral','Neutral · minimal']]);
 addSelect(grid,i,'composition','Composition',[['observational','Observational · quiet'],['angular','Angular · kinetic'],['balanced','Balanced · restrained']]);
 addSelect(grid,i,'motion','Transition rhythm',[['dissolve','Dissolve · contemplative'],['cut','Cut · quick'],['steady','Steady · minimal']]);
 addField(grid,i,'signature','Journey signature',{max:52,placeholder:'A HUMAN JOURNEY'});
 const colors=make('div','color-grid');style.append(colors);
 for(const [key,label] of [['accent','Accent'],['glow','Light'],['shadow','Shadow'],['paper','Paper']]){
  const wrap=make('label','color-field');wrap.append(make('span','field-label',label));
  const input=document.createElement('input');input.type='color';input.value=/^#[0-9a-fA-F]{6}$/.test(i[key]||'')?i[key]:'#777777';
  input.addEventListener('input',()=>set(i,key,input.value));
  wrap.append(input);colors.append(wrap);
 }
}
function showChapter(host){
 const c=draft.acts[selected.act];$('sectionLabel').textContent='02 / CHAPTER '+(selected.act+1);$('sectionHeading').textContent='Build the chapter';
 const heading=section(host,'Chapter structure','Write the chronological scope and assemble the research references used across this chapter.');
 addField(heading,c,'name','Chapter title',{max:100,required:true,placeholder:'The artist becomes a director'});
 addField(heading,c,'period','Period / dates',{max:80,required:true,placeholder:'1940–1950'});
 const buttons=make('div','actions-row');heading.append(buttons);
 buttons.append(action('Add a story moment',()=>{
  if(c.scenes.length>=40){status('Maximum 40 moments per chapter.',true);return;}
  c.scenes.push(schema.scene());safeStore();selected.kind='scene';selected.scene=c.scenes.length-1;paint();
 }));
 buttons.append(action('Delete this chapter',()=>{
  if(draft.acts.length<=1){status('Keep at least one chapter.',true);return;}
  if(!confirm('Delete this chapter and all its scenes from this local draft?'))return;
  draft.acts.splice(selected.act,1);selected={kind:'profile',act:0,scene:0};safeStore();paint();
 },'danger-action'));
 const sources=section(host,'Research library','Use real HTTPS sources. Each story scene must cite one or more references here.');
 sources.append(action('+ Add research source',()=>{
  if(c.archive.length>=40){status('Maximum 40 sources per chapter.',true);return;}
  c.archive.push({id:schema.id('source'),label:'',url:''});safeStore();paint();
 }));
 for(const [index,s] of c.archive.entries()){
  const group=make('div','source-row');
  group.append(make('div','source-number','REFERENCE '+String(index+1).padStart(2,'0')));
  addField(group,s,'label','Source / institution',{max:180,placeholder:'Publisher · article title'});
  addField(group,s,'url','HTTPS research URL',{max:1500,placeholder:'https://…',type:'url'});
  group.append(action('Remove source',()=>{
   if(!confirm('Remove this source and its citations from the local draft?'))return;
   c.archive.splice(index,1);
   c.scenes.forEach(scene=>scene.sources=scene.sources.filter(ref=>ref!==s.id));
   safeStore();paint();
  },'danger-action'));
  reviewControls(group,'sources',s,c,'SOURCE '+(index+1));
  sources.append(group);
 }
}
function showScene(host){
 const c=draft.acts[selected.act],s=c.scenes[selected.scene];
 $('sectionLabel').textContent='03 / STORY MOMENT '+String(selected.scene+1).padStart(2,'0');
 $('sectionHeading').textContent='Direct the moment';
 const section1=section(host,'Historical story','Separate documented facts from dramatic or emotional interpretation. Avoid invented quotes.');
 const row=make('div','form-grid');section1.append(row);
 addField(row,s,'year','Year / date',{max:50,required:true,placeholder:'1952'});
 addField(row,s,'place','Location',{max:120,required:true,placeholder:'Calcutta'});
 addField(section1,s,'title','Scene headline',{max:220,required:true,placeholder:'A new beginning'});
 addField(section1,s,'lead','Main story',{multiline:true,max:1200,required:true,rows:3,placeholder:'A directly supported historical statement'});
 addField(section1,s,'more','Supporting narrative',{multiline:true,max:2500,required:true,rows:4,placeholder:'A factual continuation and context'});
 addField(section1,s,'history','Documented context',{multiline:true,max:2200,rows:3,placeholder:'Why do we know this? What is uncertain?'});
 addField(section1,s,'meaning','Editorial reflection',{multiline:true,max:1400,rows:2,placeholder:'What does this moment mean without pretending it is a fact?'});
 const research=section(host,'Scene citations','Citations must correspond to the documentary claims in this particular moment.');
 if(!c.archive.length)research.append(make('p','warning','This chapter has no research sources yet. Add them from the chapter editor.'));
 const refs=make('div','citation-list');
 for(const src of c.archive){
  const label=make('label','citation-option');
  const input=document.createElement('input');input.type='checkbox';input.checked=s.sources.includes(src.id);
  input.addEventListener('change',()=>{
   if(input.checked&&!s.sources.includes(src.id))s.sources.push(src.id);
   if(!input.checked)s.sources=s.sources.filter(x=>x!==src.id);
   safeStore();if(hasReviewed)review(false);
  });
  label.append(input,make('span','',src.label||'Untitled source — finish in chapter editor'));refs.append(label);
 }
 research.append(refs);
 const visuals=section(host,'Visual direction','All preview imagery is an original, generated-by-CSS editorial illustration. We do not load or publish user images.');
 const vg=make('div','form-grid');visuals.append(vg);
 addSelect(vg,s,'visualTemplate','Visual scene style',schema.TEMPLATES.map(k=>[k,k[0].toUpperCase()+k.slice(1)]));
 addField(vg,s,'prompt','Visual caption',{max:70,placeholder:'A MOMENT OF DISCOVERY'});
 addField(visuals,s,'visual','Visual provenance',{multiline:true,max:1000,rows:2,placeholder:'Original symbolic visual, not an archival frame'});
 addSelect(visuals,s,'rights','External image-rights review',schema.RIGHTS.map(k=>[k,k.replace(/-/g,' ')]));
 addField(visuals,s,'rightsNote','Rights evidence / notes',{multiline:true,max:1200,rows:2,placeholder:'Permission details and permitted uses, if any'});
 visuals.append(make('p','rights-note','Marking “cleared” does not grant rights. Media is not uploaded or displayed in this prototype, regardless of status.'));
 const checks=section(host,'Local editorial attestations','Record what was checked; changing this scene or its cited sources makes the attestation stale. No reviewer identity is verified.');
 reviewControls(checks,'scenes',s,c,'HISTORICAL FACTS');
 reviewControls(checks,'assets',s,c,'VISUAL & RIGHTS DECLARATION');
 const buttons=make('div','actions-row');visuals.append(buttons);
 buttons.append(action('Duplicate moment',()=>{
  if(c.scenes.length>=40){status('Maximum 40 moments per chapter.',true);return;}
  const copy=JSON.parse(JSON.stringify(s));copy.id=schema.id('scene');c.scenes.splice(selected.scene+1,0,copy);
  selected.scene+=1;safeStore();paint();
 }));
 buttons.append(action('Delete moment',()=>{
  if(c.scenes.length<=1){status('Keep at least one story moment.',true);return;}
  if(!confirm('Delete this story moment from the local draft?'))return;
  c.scenes.splice(selected.scene,1);selected.scene=Math.min(selected.scene,c.scenes.length-1);safeStore();paint();
 },'danger-action'));
}
function paint(){
 updateNumbers();outline();
 const host=$('editorFields');host.replaceChildren();
 if(selected.kind==='profile')showProfile(host);
 else if(selected.kind==='chapter')showChapter(host);
 else showScene(host);
 review(false);
 updateReviewGate();updateCheckpoints();
}
function review(showDetails=true){
 const r=schema.validate(draft);
 $('qaStatus').textContent=r.ok?'Structurally ready for preview':'Needs '+r.errors.length+' correction'+(r.errors.length===1?'':'s');
 $('qaStatus').dataset.valid=String(r.ok);
 if(showDetails)hasReviewed=true;
 const host=$('qaResults');host.replaceChildren();
 if(!hasReviewed){host.append(make('p','qa-tip','Run editorial checks for a detailed validation report.'));return r;}
 const head=make('strong','qa-heading',r.ok?'Draft preview-ready':'What to fix first');host.append(head);
 for(const item of r.errors.slice(0,14))host.append(make('p','qa-error',item));
 if(r.errors.length>14)host.append(make('p','qa-tip','And '+(r.errors.length-14)+' more issues…'));
 if(r.ok)host.append(make('p','qa-success','All required metadata and citations are present. This does not guarantee factual accuracy.'));
 if(r.warnings.length)host.append(make('p','qa-warning',r.warnings.length+' scene(s) have media-rights work outstanding. Preview uses original graphic layers only.'));
 return r;
}
async function importFile(file){
 if(!file)return;
 if(file.size>schema.MAX_BYTES){status('Import blocked: JSON file exceeds 300 KB.',true);return;}
 try{
  const imported=normalize(JSON.parse(await file.text()));
  if(!confirm('Replace this browser’s current draft with the imported local JSON?'))return;
  draft=imported;reviews=governance.blankReview();saveReviews();selected={kind:'profile',act:0,scene:0};hasReviewed=false;
  if(!safeStore())return;
  paint();status('JSON imported locally. Review the citations before preview.');
 }catch(error){status('Import rejected: '+String(error.message).slice(0,130),true);}
 finally{$('importDraft').value='';}
}
$('reviewPacket').addEventListener('click',()=>{
 const packet=governance.createPacket(draft,reviews,schema);
 const blob=new Blob([JSON.stringify(packet,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='origin-editorial-review-packet-v1.json';document.body.append(a);
 a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
 status(packet.status==='self-attested-handoff-ready'?
  'Local review packet exported. Independent approval and publication are NOT enabled.':
  'Review packet exported with pending issues. Not approved or published.');
});
$('createCheckpoint').addEventListener('click',()=>{
 const title=prompt('Short description of this local checkpoint (no private information):');
 if(title===null)return;
 try{
  const next=governance.createCheckpoint(draft,reviews,title,history);
  const old=history;history=next;
  if(!saveHistory()){history=old;return;}
  updateCheckpoints();$('checkpointList').value='0';
  status('Local checkpoint saved. Export JSON for a durable backup; this is not an audit log.');
 }catch(err){status(String(err.message).slice(0,140),true);}
});
$('restoreCheckpoint').addEventListener('click',()=>{
 const n=Number($('checkpointList').value);
 if($('checkpointList').value===''||!Number.isInteger(n)||n<0||n>=history.length){
  status('Choose a saved checkpoint to restore.',true);return;
 }
 if(!confirm('Restore this browser-local checkpoint? Unsaved current changes will be replaced.'))return;
 try{
  const snap=history[n];const restored=normalize(snap.draft);
  // Restored review records are still checked against exact content fingerprints.
  draft=restored;reviews=governance.cleanReviews(snap.reviews);
  selected={kind:'profile',act:0,scene:0};hasReviewed=false;
  if(!safeStore()||!saveReviews())return;
  paint();status('Checkpoint restored locally; review the story before exporting.');
 }catch(err){status('Could not restore selected checkpoint: '+String(err.message).slice(0,100),true);}
});
$('profileTab').addEventListener('click',()=>{selected={kind:'profile',act:0,scene:0};paint();});
$('addAct').addEventListener('click',()=>{
 if(draft.acts.length>=12){status('Maximum 12 chapters in a draft.',true);return;}
 draft.acts.push(schema.act());selected={kind:'chapter',act:draft.acts.length-1,scene:0};safeStore();paint();
});
$('saveDraft').addEventListener('click',()=>{if(safeStore())status('Saved locally. Export JSON for a backup; nothing is published.');});
$('newDraft').addEventListener('click',()=>{
 if(!confirm('Replace the current local draft with a blank one? Export first to keep a backup.'))return;
 draft=schema.blank();reviews=governance.blankReview();saveReviews();selected={kind:'profile',act:0,scene:0};hasReviewed=false;safeStore();paint();
 status('A new blank local draft is ready.');
});
$('loadSample').addEventListener('click',()=>{
 if(!confirm('Replace the current local draft with the documented example? Export first to keep your work.'))return;
 draft=schema.demo();reviews=governance.blankReview();saveReviews();selected={kind:'profile',act:0,scene:0};hasReviewed=false;safeStore();paint();
 status('Research example loaded. You can preview it or adapt it.');
});
$('exportDraft').addEventListener('click',()=>{
 const payload=JSON.stringify(draft,null,2);
 const blob=new Blob([payload],{type:'application/json'});
 const url=URL.createObjectURL(blob),anchor=document.createElement('a');
 anchor.href=url;anchor.download='origin-creator-draft-v1.json';anchor.hidden=true;
 document.body.append(anchor);anchor.click();anchor.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1200);
 status('JSON export prepared. Keep it safe; browser drafts can be cleared.');
});
$('importDraft').addEventListener('change',event=>importFile(event.target.files?.[0]));
$('checkDraft').addEventListener('click',()=>{
 const r=review(true);
 status(r.ok?'Structure and citations validated. Historical and rights review still required.':'Please correct '+r.errors.length+' item(s) before preview.',!r.ok);
});
$('previewDraft').addEventListener('click',event=>{
 const r=review(true);
 if(!r.ok){event.preventDefault();status('Preview blocked: resolve '+r.errors.length+' validation error(s).',true);return;}
 if(!safeStore()){event.preventDefault();return;}
 status('Opening local draft inside the existing ORIGIN cinematic player. Not publishing.');
});
initial();
})();