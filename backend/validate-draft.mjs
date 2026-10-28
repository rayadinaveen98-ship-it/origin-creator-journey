/* ORIGIN V11.6 — strict server-owned editorial draft validation.
 * No content execution, no dynamic URLs for imagery, no client-provided role.
 * Mirrors V11 Studio's v1 data contract for NEW backend revisions only.
 */
const slug=/^[a-z0-9][a-z0-9-]{0,39}$/;
const hex=/^#[0-9a-f]{6}$/i;
const allowedStyles={
 typography:new Set(['literary','graphic','neutral']),
 composition:new Set(['observational','angular','balanced']),
 motion:new Set(['dissolve','cut','steady']),
 visual:new Set(['abstract','field','absence','studio','paper','frame','sound','negative','archive','map','ensemble']),
 rights:new Set(['not-reviewed','permission-required','cleared'])
};
function line(value,min,max){
 return typeof value==='string'&&value.trim().length>=min&&value.trim().length<=max&&!/[<>]/.test(value);
}
function https(value){
 if(typeof value!=='string'||value.length>1500)return false;
 try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!!u.hostname;}
 catch{return false;}
}
export function validateEditorialDraft(doc){
 const issues=[];
 const fail=(p,s)=>{if(issues.length<32)issues.push(p+': '+s);};
 if(!doc||typeof doc!=='object'||Array.isArray(doc)||doc.schemaVersion!==1)
  return {ok:false,issues:['Draft: unsupported schema version']};
 let encoded;
 try{encoded=JSON.stringify(doc);}catch{return {ok:false,issues:['Draft: cannot encode JSON']};}
 if(BufferByteLength(encoded)>300000)fail('Draft','exceeds 300 KB');
 const p=doc.profile;
 if(!p||typeof p!=='object'||Array.isArray(p))return {ok:false,issues:['Profile: missing']};
 for(const [field,min,max] of [['name',2,100],['subtitle',4,150],['role',2,100],['years',2,100],['culture',2,100]])
  if(!line(p[field],min,max))fail('Profile '+field,'invalid text');
 const ident=p.identity;
 if(!ident||typeof ident!=='object'||Array.isArray(ident))fail('Identity','missing');
 else{
  for(const k of ['accent','glow','shadow','paper'])if(!hex.test(ident[k]||''))fail('Identity '+k,'invalid color');
  for(const k of ['typography','composition','motion'])if(!allowedStyles[k].has(ident[k]))fail('Identity '+k,'unsupported preset');
  if(!/^[A-Za-z0-9 &·.,'-]{2,52}$/.test(ident.signature||''))fail('Identity signature','unsupported text');
 }
 if(!Array.isArray(doc.acts)||doc.acts.length<1||doc.acts.length>12)
  return {ok:false,issues:[...issues,'Acts: count out of range']};
 const actIds=new Set();
 let total=0;
 for(const [a,ch] of doc.acts.entries()){
  const ref='Act '+(a+1);
  if(!ch||typeof ch!=='object'||Array.isArray(ch)){fail(ref,'invalid chapter');continue;}
  if(!slug.test(ch.id||'')||actIds.has(ch.id))fail(ref,'duplicate or invalid chapter ID');
  actIds.add(ch.id);
  if(!line(ch.name,2,100)||!line(ch.period,2,80))fail(ref,'missing title/period');
  if(!Array.isArray(ch.archive)||ch.archive.length<1||ch.archive.length>40){
   fail(ref,'must include 1–40 sources');continue;
  }
  const sourceIds=new Set();
  for(const [i,source] of ch.archive.entries()){
   const src=ref+' source '+(i+1);
   if(!source||typeof source!=='object'){fail(src,'invalid');continue;}
   if(!slug.test(source.id||'')||sourceIds.has(source.id))fail(src,'duplicate or invalid source ID');
   sourceIds.add(source.id);
   if(!line(source.label,3,180)||!https(source.url))fail(src,'HTTPS citation and title required');
  }
  if(!Array.isArray(ch.scenes)||ch.scenes.length<1||ch.scenes.length>40){
   fail(ref,'must include 1–40 story moments');continue;
  }
  total+=ch.scenes.length;
  const sceneIds=new Set();
  for(const [i,s] of ch.scenes.entries()){
   const loc=ref+' scene '+(i+1);
   if(!s||typeof s!=='object'){fail(loc,'invalid');continue;}
   if(!slug.test(s.id||'')||sceneIds.has(s.id))fail(loc,'duplicate or invalid scene ID');
   sceneIds.add(s.id);
   for(const [field,min,max] of [
    ['year',1,50],['place',2,120],['title',3,220],['lead',15,1200],
    ['more',15,2500],['history',12,2200],['meaning',5,1400],
    ['visual',12,1000],['prompt',2,70]
   ])if(!line(s[field],min,max))fail(loc+' '+field,'missing or unsafe plain text');
   if(!allowedStyles.visual.has(s.visualTemplate))fail(loc,'unsupported visual template');
   if(!allowedStyles.rights.has(s.rights))fail(loc,'unsupported media status');
   if(s.rights==='cleared'&&!line(s.rightsNote,12,1200))fail(loc,'rights evidence note required');
   if(!Array.isArray(s.sources)||s.sources.length<1||s.sources.some(id=>!sourceIds.has(id)))
    fail(loc,'all factual moments require declared citations');
   // The studio is currently original artwork only; importing an image asset is not supported.
   if('asset' in s||'assetLink' in s||'html' in s)fail(loc,'external artwork / HTML not supported');
  }
 }
 if(total>120)fail('Draft','more than 120 scenes');
 return {ok:issues.length===0,issues};
}
function BufferByteLength(s){return new TextEncoder().encode(s).byteLength;}
