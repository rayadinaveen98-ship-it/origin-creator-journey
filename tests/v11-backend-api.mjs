import assert from 'node:assert/strict';
import {handle} from '../backend/worker.mjs';
import {exampleEditorialDraft} from './fixtures/editorial-draft.mjs';
const BASE='https://studio-api.example.test';
const SITE='https://origin-creator-journey.example.test';
const API='https://origin-backend.supabase.co';
const SECRET='sb_secret_syntheticBackendKeyNeverProduction_1234567890';
const PUBLISHABLE='sb_publishable_syntheticPublicKeyNeverProduction_1234567890';
const ACTORS={
 contributor:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
 reviewer:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
 publisher:'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
 admin:'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
 inactive:'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'
};
const USER_TOKENS=Object.fromEntries(Object.entries(ACTORS).map(([key,id])=>['user-'+key,id]));
const uuid='11111111-1111-4111-8111-111111111111';
const config={ORIGIN_STUDIO_ALLOWED_ORIGIN:SITE,ORIGIN_SUPABASE_URL:API,ORIGIN_SUPABASE_SECRET_KEY:SECRET,ORIGIN_SUPABASE_PUBLISHABLE_KEY:PUBLISHABLE};
let requests=[],upstreamMode='okay';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
async function mock(url,opt){
 requests.push({url,method:opt.method||'GET',headers:opt.headers,body:opt.body});
 if(url===API+'/auth/v1/user'){
  assert.equal(opt.headers.apikey,PUBLISHABLE,'User session validation uses only the publishable key');
  const token=opt.headers.Authorization?.replace('Bearer ','');
  const id=USER_TOKENS[token];
  return id?json({id}):json({message:'invalid token'},401);
 }
 if(url.startsWith(API+'/rest/v1/origin_memberships?')){
  assert.equal(opt.headers.apikey,SECRET);
  assert.equal(opt.headers.Authorization,undefined,'Secret API keys must not be sent as bearer JWTs');
  const query=new URL(url).searchParams;
  const id=query.get('user_id').slice(3);
  const role=Object.entries(ACTORS).find(([,v])=>v===id)?.[0];
  return json(role?[{user_id:id,role:role==='inactive'?'contributor':role,active:role!=='inactive'}]:[]);
 }
 if(url.startsWith(API+'/rest/v1/origin_journeys?')){
  assert.equal(opt.headers.apikey,SECRET);
  assert.equal(opt.headers.Authorization,undefined);
  return json([{id:uuid,slug:'original-creator',title:'Original Creator',head_revision:2}]);
 }
 if(url.startsWith(API+'/rest/v1/origin_revisions?')){
  assert.equal(opt.headers.apikey,SECRET);
  assert.equal(opt.headers.Authorization,undefined);
  const params=new URL(url).searchParams;
  if(params.has('journey_id'))return json([{id:uuid,revision_no:2,state:'submitted'}]);
  return json([{id:uuid,journey_id:uuid,revision_no:2,state:'submitted',content:exampleEditorialDraft()}]);
 }
 if(url.startsWith(API+'/rest/v1/rpc/')){
  assert.equal(opt.headers.apikey,SECRET);
  assert.equal(opt.headers.Authorization,undefined,'Service REST calls must not send secret API keys as JWTs');
  if(upstreamMode==='denied')return json({message:'sensitive SQL details'},403);
  const data=JSON.parse(opt.body);
  assert.equal(data.p_actor,ACTORS[roleForToken]);
  return json(url.endsWith('origin_submit_revision')||url.endsWith('origin_review_revision')?true:uuid);
 }
 throw Error('Unexpected upstream URL '+url);
}
let roleForToken='contributor';
async function call(route,role='contributor',method='POST',data={},origin=SITE,headers={}){
 roleForToken=role;requests=[];
 const requestHeaders={Origin:origin,Authorization:'Bearer user-'+role,...headers};
 if(data!==null)requestHeaders['Content-Type']='application/json';
 const req=new Request(BASE+route,{method,headers:requestHeaders,
  body:method==='POST'&&data!==null?JSON.stringify(data):undefined});
 const res=await handle(req,config,mock);
 return {status:res.status,headers:res.headers,body:await res.json().catch(()=>null),calls:requests.slice()};
}
function lastRpc(r){return r.calls.at(-1);}
const validContent=exampleEditorialDraft();
{
 const r=await call('/v1/journeys','reviewer','GET',null);
 assert.equal(r.status,200);
 assert.equal(r.body.journeys[0].slug,'original-creator');
 assert.equal(r.calls.length,3,'Read request requires real session and live membership check');
 assert.ok(r.calls.at(-1).url.endsWith('order=updated_at.desc&limit=30'));
}
{
 const r=await call('/v1/journeys/'+uuid+'/revisions','contributor','GET',null);
 assert.equal(r.status,200);
 assert.equal(r.body.revisions.length,1);
 assert.equal(r.body.revisions[0].revision_no,2);
}
{
 const r=await call('/v1/revisions/'+uuid,'reviewer','GET',null);
 assert.equal(r.status,200);
 assert.equal(r.body.revision.content.acts.length,1);
}
{
 const r=await call('/v1/journeys/'+uuid+'/revisions','inactive','GET',null);
 assert.equal(r.status,403);
 assert.equal(r.calls.filter(x=>x.url.includes('/rest/v1/origin_revisions')).length,0);
}

{
 const r=await call('/v1/me','contributor','GET',null);
 assert.equal(r.status,200);assert.equal(r.body.userId,ACTORS.contributor);
 assert.equal(r.body.role,'contributor');
 assert.equal(r.headers.get('access-control-allow-origin'),SITE);
 assert.equal(r.headers.get('cache-control'),'no-store');
 assert.equal(r.calls.length,2,'Auth + membership must be consulted on every request');
}
{
 const r=await call('/v1/journeys','contributor','POST',{slug:'new-journey',title:'A Story',userId:ACTORS.admin,role:'admin'});
 assert.equal(r.status,200);
 assert.match(lastRpc(r).url,/origin_create_journey/);
 assert.equal(JSON.parse(lastRpc(r).body).p_actor,ACTORS.contributor,'Client-supplied identity ignored');
}
{
 const r=await call('/v1/revisions','contributor','POST',{journeyId:uuid,content:validContent});
 assert.equal(r.status,200);assert.match(lastRpc(r).url,/origin_append_revision/);
 assert.equal(JSON.parse(lastRpc(r).body).p_actor,ACTORS.contributor);
}
{
 const r=await call('/v1/revisions/'+uuid+'/submit','contributor','POST',null);
 assert.equal(r.status,200,'Submit supports empty body after authenticated role check');
 assert.match(lastRpc(r).url,/origin_submit_revision/);
}
{
 const r=await call('/v1/revisions/'+uuid+'/review','reviewer','POST',
  {decision:'approve',reason:'I checked the evidence against the original source.'});
 assert.equal(r.status,200);assert.match(lastRpc(r).url,/origin_review_revision/);
}
{
 const r=await call('/v1/revisions/'+uuid+'/stage','publisher','POST',null);
 assert.equal(r.status,200);assert.match(lastRpc(r).url,/origin_stage_release/);
 assert.match(r.body.notice,/NOT deployed/,'Staging must never claim to publish');
}
for(const [role,endpoint] of [
 ['reviewer','/v1/journeys'],['publisher','/v1/revisions'],
 ['contributor','/v1/revisions/'+uuid+'/review'],['reviewer','/v1/revisions/'+uuid+'/stage'],
 ['publisher','/v1/revisions/'+uuid+'/submit']
]){
 const r=await call(endpoint,role,'POST',null);
 assert.equal(r.status,403,role+' denied '+endpoint);
 assert.equal(r.calls.filter(x=>x.url.includes('/rpc/')).length,0);
}
{
 const r=await call('/v1/me','inactive','GET',null);
 assert.equal(r.status,403,'Inactive members denied even with valid Auth session');
}
{
 const r=await call('/v1/journeys','contributor','POST',{slug:'OK',title:'A valid-looking title'});
 assert.equal(r.status,400);assert.equal(r.calls.filter(x=>x.url.includes('/rpc/')).length,0);
}
{
 const r=await call('/v1/revisions','contributor','POST',{journeyId:uuid,content:{schemaVersion:1}});
 assert.equal(r.status,400);
}
{
 const r=await call('/v1/revisions/'+uuid+'/review','reviewer','POST',{decision:'approve',reason:'short'});
 assert.equal(r.status,400);
}
{
 const r=await call('/v1/me','contributor','GET',null,'https://untrusted.example.test');
 assert.equal(r.status,403);assert.equal(r.calls.length,0,'Wrong website origin blocked before Auth');
}
{
 requests=[];
 const req=new Request(BASE+'/v1/me',{method:'GET',headers:{Origin:SITE}});
 const r=await handle(req,config,mock);assert.equal(r.status,401);
 assert.equal(requests.length,0,'No token, no backend lookup');
}
{
 const req=new Request(BASE+'/v1/me',{method:'GET',headers:{Origin:SITE,Authorization:'Bearer forged'}});
 requests=[];
 const r=await handle(req,config,mock);assert.equal(r.status,401);
 assert.equal(requests.length,1,'Forged token may only call Auth verify endpoint');
}
{
 const req=new Request(BASE+'/v1/revisions/'+uuid+'/review',{method:'POST',
  headers:{Origin:SITE,Authorization:'Bearer user-reviewer','Content-Type':'text/plain'},body:'{}'});
 const r=await handle(req,config,mock);assert.equal(r.status,400,'Reject non-JSON');
}
{
 const r=await call('/v1/private-admin','admin','GET',null);
 assert.equal(r.status,404,'No wildcard internal RPC proxy');
}
{
 const req=new Request(BASE+'/v1/me',{method:'OPTIONS',headers:{Origin:SITE,'Access-Control-Request-Method':'GET'}});
 const r=await handle(req,config,mock);assert.equal(r.status,204);
 assert.equal(r.headers.get('access-control-allow-origin'),SITE);
}
{
 upstreamMode='denied';
 const r=await call('/v1/revisions/'+uuid+'/stage','publisher','POST',null);
 assert.equal(r.status,403);assert.equal(r.body.error,'database_denied');
 assert.ok(!JSON.stringify(r.body).includes('sensitive SQL'));
 upstreamMode='okay';
}
{
 const bad={...config,ORIGIN_SUPABASE_SECRET_KEY:''};
 const req=new Request(BASE+'/v1/me',{method:'GET',headers:{Origin:SITE,Authorization:'Bearer user-admin'}});
 const r=await handle(req,bad,mock);assert.equal(r.status,503,'Fail closed without backend configuration');
}
for(const [label,breakDraft] of [
 ['unsourced story',v=>{v.acts[0].scenes[0].sources=[];}],
 ['invalid source URL',v=>{v.acts[0].archive[0].url='javascript:alert(1)';}],
 ['script markup',v=>{v.acts[0].scenes[0].title='<script>alert(1)</script>'; }],
 ['duplicate scene',v=>{v.acts[0].scenes.push({...v.acts[0].scenes[0]});}],
 ['unverified arbitrary artwork',v=>{v.acts[0].scenes[0].asset='https://invalid.example/img.png';}]
]){
 const content=exampleEditorialDraft();breakDraft(content);
 const response=await call('/v1/revisions','contributor','POST',{journeyId:uuid,content});
 assert.equal(response.status,400,label+' must never reach database');
 assert.equal(response.calls.filter(x=>x.url.includes('/rpc/')).length,0);
}
{
 const invalidKey={...config,ORIGIN_SUPABASE_PUBLISHABLE_KEY:''};
 const request=new Request(BASE+'/v1/me',{method:'GET',headers:{Origin:SITE,Authorization:'Bearer user-admin'}});
 const response=await handle(request,invalidKey,mock);
 assert.equal(response.status,503,'Fail closed without publishable Supabase key');
}
console.log('ORIGIN V11.6 API gate tests PASS: verified bearer user, role lookup on every action, actor spoof defense, malformed-body rejection, cross-origin guards, no generic proxy, release staging only and no exposed service secrets.');
