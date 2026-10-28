/* ORIGIN V11.5 — isolated authenticated editorial API.
 * This is NOT deployed by the public www/ Cloudflare Worker workflow.
 * Requires a dedicated ORIGIN Supabase project, secure secrets, and production
 * authorization tests before deployment. No frontend service-role secrets.
 */
import {validateEditorialDraft} from './validate-draft.mjs';
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG=/^[a-z0-9][a-z0-9-]{1,62}$/;
const ALLOWED_ROLES=new Set(['contributor','reviewer','publisher','admin']);
const MAX_BODY=300000;
function reply(status,data,headers={}){
 return new Response(JSON.stringify(data),{status,headers:{
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer',...headers
 }});
}
const invalid=(status,code,headers)=>reply(status,{error:code},headers);
function cleanOrigin(request,env){
 const allowed=String(env.ORIGIN_STUDIO_ALLOWED_ORIGIN||'').replace(/\/$/,'');
 if(!/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(allowed))throw Error('Server origin configuration missing');
 const origin=request.headers.get('origin');
 if(origin && origin!==allowed)return null;
 return {'Access-Control-Allow-Origin':allowed,'Vary':'Origin'};
}
function configuration(env){
 const url=String(env.ORIGIN_SUPABASE_URL||'');
 const publishable=String(env.ORIGIN_SUPABASE_PUBLISHABLE_KEY||'');
 const secret=String(env.ORIGIN_SUPABASE_SECRET_KEY||'');
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)||
    !/^sb_publishable_[a-zA-Z0-9_]{24,}$/.test(publishable)||
    !/^sb_secret_[a-zA-Z0-9_]{24,}$/.test(secret))
    throw Error('Backend configuration incomplete');
 // Secrets are independent of user access tokens. They are only passed via apikey.
 return {url,publishable,secret};
}
function authenticatedHeaders(publishable,userJwt){
 return {'apikey':publishable,'Authorization':'Bearer '+userJwt};
}
function adminHeaders(secret){
 return {'apikey':secret};
}
async function parseJson(request){
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))throw Error('type');
 const n=Number(request.headers.get('content-length')||'0');
 if(n>MAX_BODY+2000)throw Error('size');
 const body=await request.text();
 if(body.length>MAX_BODY+2000)throw Error('size');
 try{
  const v=JSON.parse(body);
  if(!v||typeof v!=='object'||Array.isArray(v))throw Error('json');
  return v;
 }catch{throw Error('json');}
}
async function getAuthUser(fetcher,cfg,token){
 const r=await fetcher(cfg.url+'/auth/v1/user',{
  headers:authenticatedHeaders(cfg.publishable,token),redirect:'error',cache:'no-store'
 });
 if(!r.ok)return null;
 const user=await r.json().catch(()=>null);
 if(!UUID.test(user?.id||''))return null;
 // An authenticated Supabase user record is the sole trusted identity source.
 return {id:user.id};
}
async function serviceFetch(fetcher,cfg,pathname,options={}){
 const r=await fetcher(cfg.url+pathname,{...options,headers:{
  ...adminHeaders(cfg.secret),
  'Accept':'application/json',...(options.headers||{})
 },redirect:'error',cache:'no-store'});
 if(!r.ok){
  // Do not expose DB error details, SQL hints, or raw tokens to the caller.
  if(r.status===409)throw {status:409,code:'conflict'};
  if(r.status===401||r.status===403)throw {status:403,code:'database_denied'};
  throw {status:422,code:'database_rejected'};
 }
 if(r.status===204)return null;
 return r.json();
}
async function memberRole(fetcher,cfg,userId){
 const rows=await serviceFetch(fetcher,cfg,'/rest/v1/origin_memberships?select=user_id,role,active&user_id=eq.'+encodeURIComponent(userId)+'&limit=1');
 const member=Array.isArray(rows)?rows[0]:null;
 if(member?.user_id!==userId||member?.active!==true||!ALLOWED_ROLES.has(member.role))return null;
 return member.role;
}
function route(method,pathname){
 if(method==='GET'&&pathname==='/v1/me')return {roles:ALLOWED_ROLES,op:'me'};
 if(method==='GET'&&pathname==='/v1/journeys')return {roles:ALLOWED_ROLES,op:'list'};
 const journeyRevisions=/^\/v1\/journeys\/([0-9a-f-]+)\/revisions$/.exec(pathname);
 if(method==='GET'&&journeyRevisions&&UUID.test(journeyRevisions[1]))
  return {roles:ALLOWED_ROLES,op:'revisionList',id:journeyRevisions[1]};
 const singleRevision=/^\/v1\/revisions\/([0-9a-f-]+)$/.exec(pathname);
 if(method==='GET'&&singleRevision&&UUID.test(singleRevision[1]))
  return {roles:ALLOWED_ROLES,op:'revisionRead',id:singleRevision[1]};
 if(method==='POST'&&pathname==='/v1/journeys')return {roles:new Set(['contributor','admin']),op:'create'};
 if(method==='POST'&&pathname==='/v1/revisions')return {roles:new Set(['contributor','admin']),op:'append'};
 const match=/^\/v1\/revisions\/([0-9a-f-]+)\/(submit|review|stage)$/.exec(pathname);
 if(method==='POST'&&match&&UUID.test(match[1])){
  const action=match[2];
  return {roles:new Set(action==='submit'?['contributor','admin']:action==='review'?['reviewer','admin']:['publisher','admin']),op:action,id:match[1]};
 }
 return null;
}
export async function handle(request,env,fetcher=fetch){
 let cors;
 try{cors=cleanOrigin(request,env);if(!cors)return invalid(403,'origin_denied');}
 catch{return invalid(503,'backend_not_configured');}
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{
  ...cors,'Access-Control-Allow-Methods':'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers':'authorization, content-type',
  'Access-Control-Max-Age':'600','Cache-Control':'no-store'
 }});
 const path=new URL(request.url).pathname;
 const action=route(request.method,path);
 if(!action)return invalid(404,'not_found',cors);
 let cfg;
 try{cfg=configuration(env);}catch{return invalid(503,'backend_not_configured',cors);}
 const match=/^Bearer ([A-Za-z0-9._~-]+)$/.exec(request.headers.get('authorization')||'');
 if(!match||match[1].length>8192)return invalid(401,'authentication_required',cors);
 try{
  const user=await getAuthUser(fetcher,cfg,match[1]);
  if(!user)return invalid(401,'invalid_session',cors);
  const role=await memberRole(fetcher,cfg,user.id);
  if(!role||!action.roles.has(role))return invalid(403,'role_denied',cors);
  if(action.op==='me')return reply(200,{userId:user.id,role,authenticated:true},cors);
  // All reads use pre-approved, fixed PostgREST query shapes: no user-provided filters.
  // Membership is rechecked per request; SQL's authenticated/RLS read-only rules remain.
  if(action.op==='list'){
   const rows=await serviceFetch(fetcher,cfg,
    '/rest/v1/origin_journeys?select=id,slug,title,head_revision,updated_at&order=updated_at.desc&limit=30');
   return reply(200,{journeys:rows},cors);
  }
  if(action.op==='revisionList'){
   const rows=await serviceFetch(fetcher,cfg,
    '/rest/v1/origin_revisions?select=id,revision_no,state,created_at,submitted_at,reviewed_at&journey_id=eq.'+
    encodeURIComponent(action.id)+'&order=revision_no.desc&limit=40');
   return reply(200,{revisions:rows},cors);
  }
  if(action.op==='revisionRead'){
   const rows=await serviceFetch(fetcher,cfg,
    '/rest/v1/origin_revisions?select=id,journey_id,revision_no,state,content,created_at&id=eq.'+
    encodeURIComponent(action.id)+'&limit=1');
   if(!Array.isArray(rows)||rows.length===0)return invalid(404,'revision_not_found',cors);
   return reply(200,{revision:rows[0]},cors);
  }
  const data=(action.op==='create'||action.op==='append'||action.op==='review')?await parseJson(request):{};
  let fn,params;
  if(action.op==='create'){
   if(typeof data.slug!=='string'||!SLUG.test(data.slug)||
      typeof data.title!=='string'||data.title.trim().length<2||data.title.length>140)
    return invalid(400,'invalid_journey',cors);
   fn='origin_create_journey';params={p_actor:user.id,p_slug:data.slug,p_title:data.title};
  }else if(action.op==='append'){
   if(!UUID.test(data.journeyId||'')||!validateEditorialDraft(data.content).ok)
    return invalid(400,'invalid_revision',cors);
   fn='origin_append_revision';params={p_actor:user.id,p_journey:data.journeyId,p_content:data.content};
  }else if(action.op==='submit'){
   fn='origin_submit_revision';params={p_actor:user.id,p_revision:action.id};
  }else if(action.op==='review'){
   if(!['approve','request_changes'].includes(data.decision)||
      typeof data.reason!=='string'||data.reason.trim().length<20||data.reason.length>2000)
    return invalid(400,'invalid_review',cors);
   fn='origin_review_revision';params={p_actor:user.id,p_revision:action.id,p_decision:data.decision,p_reason:data.reason};
  }else if(action.op==='stage'){
   fn='origin_stage_release';params={p_actor:user.id,p_revision:action.id};
  }else{return invalid(404,'not_found',cors);}
  const result=await serviceFetch(fetcher,cfg,'/rest/v1/rpc/'+fn,{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify(params)
  });
  return reply(200,{ok:true,result,operation:action.op,
   notice:action.op==='stage'?'Internal release candidate only; NOT deployed or publicly published':undefined},cors);
 }catch(error){
  if(error?.message==='size')return invalid(413,'payload_too_large',cors);
  if(error?.message==='type'||error?.message==='json')return invalid(400,'invalid_json',cors);
  if(error?.status)return invalid(error.status,error.code,cors);
  return invalid(502,'upstream_unavailable',cors);
 }
}
export default {fetch(request,env){return handle(request,env);}};
