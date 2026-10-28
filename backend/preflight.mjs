/* ORIGIN V11.6 — opt-in real-project connectivity preflight.
 * Run only after a dedicated ORIGIN project is approved. Never prints secrets.
 * Read-only: no migrations, writes, account creation or publishing.
 */
const SUPABASE=/^https:\/\/[a-z0-9-]+\.supabase\.co$/;
export function checkConfiguration(env){
 const url=String(env.ORIGIN_SUPABASE_URL||'');
 const pub=String(env.ORIGIN_SUPABASE_PUBLISHABLE_KEY||'');
 const secret=String(env.ORIGIN_SUPABASE_SECRET_KEY||'');
 const origin=String(env.ORIGIN_STUDIO_ALLOWED_ORIGIN||'');
 return {
  ok:SUPABASE.test(url)&&/^sb_publishable_[a-zA-Z0-9_]{24,}$/.test(pub)&&
   /^sb_secret_[a-zA-Z0-9_]{24,}$/.test(secret)&&
   /^https:\/\/[a-z0-9.-]+$/.test(origin),
  url,pub,secret,origin
 };
}
export async function runPreflight(env,transport=fetch){
 const cfg=checkConfiguration(env);
 if(!cfg.ok)return {ready:false,checks:{configuration:'fail'},note:'No writes attempted'};
 const checks={configuration:'pass'};
 const get=async(path,key)=>{
  try{
   const r=await transport(cfg.url+path,{
    method:'GET',headers:{apikey:key,Accept:'application/json'},
    redirect:'error',cache:'no-store'
   });
   return r.status;
  }catch{return 0;}
 };
 // Auth gateway + publishable credential connectivity (no account data read).
 const auth=await get('/auth/v1/settings',cfg.pub);
 checks.auth=auth===200?'pass':'fail';
 // limit=0 checks schema exposure without returning membership rows.
 const rest=await get('/rest/v1/origin_memberships?select=user_id&limit=0',cfg.secret);
 checks.membershipSchema=rest===200?'pass':'fail';
 return {ready:checks.auth==='pass'&&checks.membershipSchema==='pass',
  checks,note:'Read-only connectivity checks only; real-user security QA still required'};
}
if(import.meta.url==='file://'+process.argv[1]){
 const {ready,checks,note}=await runPreflight(process.env);
 for(const [name,result] of Object.entries(checks))
  console.log('ORIGIN preflight '+name+': '+result);
 console.log(note);
 process.exitCode=ready?0:1;
}
