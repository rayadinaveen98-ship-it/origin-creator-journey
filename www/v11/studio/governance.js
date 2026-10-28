/* ORIGIN V11.4 — editorial review foundation, LOCAL ATTESTATIONS ONLY.
 * Review metadata and checkpoints stay in browser storage. No auth or publishing.
 * Content fingerprints detect accidental stale reviews, NOT malicious tampering.
 */
(()=>{'use strict';
const REVIEW_KEY='origin_v11_studio_review_v1';
const HISTORY_KEY='origin_v11_studio_checkpoints_v1';
const MAX_CHECKPOINTS=6,MAX_CHECKPOINT_SIZE=360000;
const SOURCE_STATES=['unreviewed','checked','needs-work'];
const SCENE_STATES=['unreviewed','fact-reviewed','needs-work'];
const ASSET_STATES=['unreviewed','original-only','permission-needed','evidence-recorded'];
const note=value=>typeof value==='string'?value.trim().slice(0,1000):'';
const text=value=>typeof value==='string'?value.trim():'';
function fingerprint(value){
 // Non-cryptographic digest, for "review stale" detection only. Not an integrity signature.
 const str=JSON.stringify(value);
 let h=2166136261>>>0;
 for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}
 return h.toString(16).padStart(8,'0')+':'+str.length;
}
const sourceContent=s=>({label:text(s.label),url:text(s.url)});
const sceneContent=(s,chapter)=>({
  year:text(s.year),place:text(s.place),title:text(s.title),lead:text(s.lead),
  more:text(s.more),history:text(s.history),meaning:text(s.meaning),
  visual:text(s.visual),prompt:text(s.prompt),visualTemplate:text(s.visualTemplate),
  rights:text(s.rights),rightsNote:text(s.rightsNote),
  sources:(Array.isArray(s.sources)?s.sources:[]).map(id=>{
   const src=chapter.archive.find(a=>a.id===id);
   return {id,source:src?sourceContent(src):null};
  })
});
function blankReview(){return {version:1,sources:{},scenes:{},assets:{}};}
function cleanReviews(raw){
 const out=blankReview();if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
 for(const section of ['sources','scenes','assets']){
  if(!raw[section]||typeof raw[section]!=='object'||Array.isArray(raw[section]))continue;
  let count=0;
  for(const [key,value] of Object.entries(raw[section])){
   if(count>=160||!/^[a-z0-9][a-z0-9-]{0,63}$/i.test(key))continue;
   if(!value||typeof value!=='object'||Array.isArray(value))continue;
   const states=section==='sources'?SOURCE_STATES:section==='scenes'?SCENE_STATES:ASSET_STATES;
   if(!states.includes(value.status))continue;
   out[section][key]={
    status:value.status,
    note:note(value.note),tag:typeof value.tag==='string'?value.tag.slice(0,80):'',
    updatedAt:typeof value.updatedAt==='string'?value.updatedAt.slice(0,40):''
   };count++;
  }
 }
 return out;
}
function mark(reviews,section,item,chapter,status,reason,when){
 const states=section==='sources'?SOURCE_STATES:section==='scenes'?SCENE_STATES:ASSET_STATES;
 if(!states||!states.includes(status))throw Error('Unknown editorial review state');
 if(note(reason).length<12||note(reason).length>1000)throw Error('Add an explanation of at least 12 characters');
 const tag=section==='sources'?fingerprint(sourceContent(item)):fingerprint(sceneContent(item,chapter));
 const target=cleanReviews(reviews);
 const result={status,note:note(reason),tag,updatedAt:when||new Date().toISOString()};
 target[section][item.id]=result;
 return target;
}
function assess(doc,rawReview,schema){
 const review=cleanReviews(rawReview),issues=[],counts={sources:0,checkedSources:0,scenes:0,checkedScenes:0,media:0,reviewedMedia:0,stale:0};
 const form=schema.validate(doc);
 for(const error of form.errors.slice(0,25))issues.push('Structure · '+error);
 if(!Array.isArray(doc?.acts))return {handoffReady:false,issues,counts,form,review};
 for(const [a,chapter] of doc.acts.entries()){
  if(!chapter||!Array.isArray(chapter.archive)||!Array.isArray(chapter.scenes))continue;
  for(const source of chapter.archive){
   counts.sources++;
   const current=review.sources[source.id];
   const tag=fingerprint(sourceContent(source));
   if(current?.tag&&current.tag!==tag){counts.stale++;issues.push('Act '+(a+1)+' source '+source.id+' changed since review');}
   else if(current?.status==='checked'&&current.note.length>=12){counts.checkedSources++;}
   else issues.push('Act '+(a+1)+' source '+source.id+' needs documented review');
  }
  for(const [i,scene] of chapter.scenes.entries()){
   counts.scenes++;counts.media++;
   const tag=fingerprint(sceneContent(scene,chapter));
   const checked=review.scenes[scene.id];
   const media=review.assets[scene.id];
   if((checked?.tag&&checked.tag!==tag)||(media?.tag&&media.tag!==tag)){
    counts.stale++;issues.push('Act '+(a+1)+' scene '+(i+1)+' changed after editorial review');
   }
   if(checked?.tag===tag&&checked.status==='fact-reviewed'&&checked.note.length>=12)counts.checkedScenes++;
   else issues.push('Act '+(a+1)+' scene '+(i+1)+' requires a fresh fact-check note');
   // No third-party media in the Studio player. An original-only record is a
   // disclosure about the local illustration; it is NOT legal clearance.
   if(media?.tag===tag&&media.status==='original-only'&&media.note.length>=12)counts.reviewedMedia++;
   else issues.push('Act '+(a+1)+' scene '+(i+1)+' needs original-visual assessment');
  }
 }
 const handoffReady=form.ok&&issues.length===0&&counts.scenes>0;
 return {handoffReady,issues,counts,form,review,
  disclaimer:'Self-attested local review packet only. Not editorial approval, legal clearance or public publishing authorization.'};
}
function createPacket(doc,review,schema){
 const result=assess(doc,review,schema);
 return {
  format:'origin-editorial-handoff-v1',
  createdAt:new Date().toISOString(),
  status:result.handoffReady?'self-attested-handoff-ready':'needs-work',
  disclaimer:result.disclaimer,
  counts:result.counts,
  issues:result.issues,
  draft:JSON.parse(JSON.stringify(doc)),
  reviews:result.review
 };
}
function createCheckpoint(doc,review,title,history){
 const label=note(title);
 if(label.length<4)throw Error('Describe this checkpoint in at least four characters');
 const copy=JSON.parse(JSON.stringify(doc)),payload=JSON.stringify(copy);
 if(payload.length>MAX_CHECKPOINT_SIZE)throw Error('Checkpoint too large');
 const list=Array.isArray(history)?history.slice():[];
 const previous=list[0];
 const checksum=fingerprint(copy);
 if(previous?.checksum===checksum)throw Error('Current draft matches your latest checkpoint');
 const stamp=new Date().toISOString();
 const checkpoint={id:stamp+':'+checksum,title:label.slice(0,100),timestamp:stamp,checksum,draft:copy,reviews:cleanReviews(review)};
 list.unshift(checkpoint);
 return list.slice(0,MAX_CHECKPOINTS);
}
function cleanHistory(history){
 if(!Array.isArray(history))return [];
 return history.filter(x=>x&&typeof x==='object'&&x.draft&&typeof x.title==='string'&&
  typeof x.checksum==='string'&&JSON.stringify(x).length<=MAX_CHECKPOINT_SIZE+25000)
  .slice(0,MAX_CHECKPOINTS);
}
window.ORIGIN_STUDIO_GOVERNANCE=Object.freeze({
 REVIEW_KEY,HISTORY_KEY,MAX_CHECKPOINTS,blankReview,cleanReviews,mark,assess,
 createPacket,createCheckpoint,cleanHistory,fingerprint,sourceContent,sceneContent,
 SOURCE_STATES,SCENE_STATES,ASSET_STATES
});
})();