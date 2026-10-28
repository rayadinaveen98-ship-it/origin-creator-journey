/* ORIGIN V11.7 independent editorial D1 Worker.
 * Undeployed until Access team domain/AUD + distinct staff memberships configured.
 * Never route public V10/V11 journeys through this module.
 */
import {verifyAccessToken} from './access.mjs';
import {member,execute,EditorialError} from './store.mjs';
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const security={'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store',
 'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
function json(status,payload,extra={}){return new Response(JSON.stringify(payload),{status,headers:{...security,...extra}});}
function route(method,path){
 if(method==='GET'&&path==='/v1/me')return {op:'me'};
 if(method==='GET'&&path==='/v1/journeys')return {op:'list'};
 if(method==='POST'&&path==='/v1/journeys')return {op:'create'};
 if(method==='POST'&&path==='/v1/revisions')return {op:'append'};
 const journey=/^\/v1\/journeys\/([0-9a-f-]+)\/revisions$/i.exec(path);
 if(method==='GET'&&journey&&UUID.test(journey[1]))return {op:'revisionList',journeyId:journey[1]};
 const revision=/^\/v1\/revisions\/([0-9a-f-]+)$/i.exec(path);
 if(method==='GET'&&revision&&UUID.test(revision[1]))return {op:'revisionRead',revisionId:revision[1]};
 const op=/^\/v1\/revisions\/([0-9a-f-]+)\/(submit|review|stage)$/i.exec(path);
 if(method==='POST'&&op&&UUID.test(op[1]))return {op:op[2].toLowerCase(),revisionId:op[1]};
 return null;
}
async function parseBody(request){
 const type=request.headers.get('content-type')||'';
 if(!/^application\/json(?:\s*;|$)/i.test(type))throw new EditorialError(400,'json_required');
 const size=Number(request.headers.get('content-length')||0);
 if(size>303000)throw new EditorialError(413,'payload_too_large');
 const text=await request.text();
 if(new TextEncoder().encode(text).byteLength>303000)throw new EditorialError(413,'payload_too_large');
 let value;try{value=JSON.parse(text);}catch{throw new EditorialError(400,'invalid_json');}
 if(!value||typeof value!=='object'||Array.isArray(value))throw new EditorialError(400,'invalid_json');
 return value;
}
export async function handleD1(request,env,fetcher=fetch){
 const allowed=String(env.ORIGIN_STUDIO_ALLOWED_ORIGIN||'').replace(/\/$/,'');
 if(!/^https:\/\/[a-z0-9.-]+$/.test(allowed)||!env.ORIGIN_EDITORIAL_DB||
   !env.ORIGIN_ACCESS_TEAM_DOMAIN||!env.ORIGIN_ACCESS_AUD)
   return json(503,{error:'backend_not_configured'});
 const origin=request.headers.get('origin');
 if(origin&&origin!==allowed)return json(403,{error:'origin_denied'});
 const cors={'Access-Control-Allow-Origin':allowed,'Vary':'Origin'};
 if(request.method==='OPTIONS'){
  // Cloudflare Access must protect the Worker before requests reach this code.
  return new Response(null,{status:204,headers:{...cors,'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
   'Access-Control-Allow-Headers':'content-type','Access-Control-Max-Age':'300',
   'Cache-Control':'no-store'}});
 }
 const action=route(request.method,new URL(request.url).pathname);
 if(!action)return json(404,{error:'not_found'},cors);
 // Require an Origin for every browser-style write. This is not authentication:
 // signature-verification below remains mandatory even if Origin is correct.
 if(request.method==='POST'&&origin!==allowed)return json(403,{error:'origin_required'},cors);
 const token=request.headers.get('cf-access-jwt-assertion');
 let actor;
 try{
  const verified=await verifyAccessToken(token,env,fetcher);
  actor=await member(env.ORIGIN_EDITORIAL_DB,verified.subject);
 }catch{
  return json(403,{error:'access_denied'},cors);
 }
 try{
  const data=(action.op==='create'||action.op==='append'||action.op==='review')?
   await parseBody(request):{};
  const result=await execute(env.ORIGIN_EDITORIAL_DB,actor,action.op,{...data,
   ...(action.journeyId?{journeyId:action.journeyId}:{}),
   ...(action.revisionId?{revisionId:action.revisionId}:{})});
  return json(200,result,cors);
 }catch(error){
  if(error instanceof EditorialError)return json(error.status,{error:error.code},cors);
  // D1 metadata/SQL exception text and internal account details must stay private.
  return json(409,{error:'database_operation_failed'},cors);
 }
}
export default {fetch(request,env){return handleD1(request,env);}};
