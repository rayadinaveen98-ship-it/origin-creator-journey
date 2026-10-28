/* ORIGIN V11 — generic schema/registry. No specific director required. */
(()=>{'use strict';
const profiles=new Map(), chapters=new Map();
function assert(ok,message){if(!ok)throw new Error('ORIGIN content: '+message);}
function safeUrl(url){try{const x=new URL(url);return x.protocol==='https:'||x.protocol==='http:';}catch{return false;}}
function registerCreator(profile){
 assert(profile&&/^[a-z0-9-]+$/.test(profile.id),'invalid creator id');
 assert(typeof profile.name==='string'&&profile.name.trim(),'name missing');
 assert(typeof profile.subtitle==='string','subtitle missing');
 assert(!profiles.has(profile.id),'duplicate creator '+profile.id);
 const clean={...profile,preview:!!profile.preview};
 profiles.set(profile.id,clean);chapters.set(profile.id,new Map());
}
function registerAct(act){
 assert(act&&profiles.has(act.creatorId),'creator must exist before act registration');
 assert(Number.isInteger(act.index)&&act.index>=1,'invalid act index');
 assert(typeof act.name==='string'&&act.name.trim(),'act name missing');
 assert(Array.isArray(act.scenes)&&act.scenes.length>0&&act.scenes.length<=150,'act scenes required');
 assert(Array.isArray(act.archive),'act archive must be an array');
 assert(!chapters.get(act.creatorId).has(act.index),'duplicate act index');
 for(const src of act.archive)assert(src&&typeof src.label==='string'&&safeUrl(src.url),'source needs label and web URL');
 for(let i=0;i<act.scenes.length;i++){
  const scene=act.scenes[i];
  for(const key of ['year','place','title','lead','more'])assert(typeof scene[key]==='string'&&scene[key].trim(),`act ${act.index} scene ${i+1} missing ${key}`);
  assert(!scene.asset||safeUrl(scene.asset),'invalid asset URL');
  assert(!scene.assetLink||safeUrl(scene.assetLink),'invalid asset credit URL');
  assert(!scene.sources||Array.isArray(scene.sources),'source indexes must be an array');
  for(const sourceIndex of (scene.sources||[]))assert(Number.isInteger(sourceIndex)&&sourceIndex>=0&&sourceIndex<act.archive.length,'source index outside archive');
 }
 chapters.get(act.creatorId).set(act.index,act);
}
function creators(){return [...profiles.values()];}
function creator(id){return profiles.get(id)||null;}
function acts(id){return [...(chapters.get(id)?.values()||[])].sort((a,b)=>a.index-b.index);}
function inspect(){
 return creators().map(c=>{
  const arr=acts(c.id);
  for(let i=0;i<arr.length;i++)assert(arr[i].index===i+1,`nonsequential acts for ${c.id}`);
  return {id:c.id,acts:arr.length,scenes:arr.reduce((sum,a)=>sum+a.scenes.length,0),preview:c.preview};
 });
}
window.ORIGIN_V11=Object.freeze({registerCreator,registerAct,creators,creator,acts,inspect});
})();