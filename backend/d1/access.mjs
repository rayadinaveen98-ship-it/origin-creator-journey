/* ORIGIN Cloudflare Access JWT validation — no header-only identity trust.
 * Verifies the RS256 signature against current Cloudflare Access JWKS, aud/iss/time/sub.
 * TEAM_DOMAIN and AUD must correspond to a genuine Access application.
 */
const encoder=new TextEncoder();
const b64decode=value=>{
 if(!/^[A-Za-z0-9_-]+$/.test(value)||value.length>18000)throw Error('invalid_token');
 const base=value.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-value.length%4)%4);
 return Uint8Array.from(atob(base),c=>c.charCodeAt(0));
};
const decodeJson=part=>JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(b64decode(part)));
export async function verifyAccessToken(token,env,fetcher=fetch){
 const team=String(env.ORIGIN_ACCESS_TEAM_DOMAIN||'');
 const aud=String(env.ORIGIN_ACCESS_AUD||'');
 if(!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(team)||
    !/^[a-z0-9]{32,64}$/i.test(aud))throw Error('access_not_configured');
 if(typeof token!=='string'||token.length>9000)throw Error('missing_access_token');
 const parts=token.split('.');
 if(parts.length!==3)throw Error('invalid_token');
 const [head,body,signature]=parts;
 let header,payload;
 try{header=decodeJson(head);payload=decodeJson(body);}catch{throw Error('invalid_token');}
 if(header.alg!=='RS256'||typeof header.kid!=='string'||header.kid.length>150)throw Error('invalid_algorithm');
 const now=Math.floor(Date.now()/1000);
 if(payload.iss!==team||
    !(Array.isArray(payload.aud)?payload.aud.includes(aud):payload.aud===aud)||
    typeof payload.exp!=='number'||payload.exp<=now||
    typeof payload.iat!=='number'||payload.iat>now+60||
    (payload.nbf!==undefined&&(typeof payload.nbf!=='number'||payload.nbf>now+60))||
    typeof payload.sub!=='string'||payload.sub.length<8||payload.sub.length>255)
    throw Error('invalid_claims');
 let keys;
 try{
  const response=await fetcher(team+'/cdn-cgi/access/certs',{
   method:'GET',redirect:'error',cache:'no-store'
  });
  if(!response.ok)throw Error('fetch_failed');
  const jwks=await response.json();
  if(!Array.isArray(jwks.keys)||jwks.keys.length>15)throw Error('bad_keys');
  keys=jwks.keys;
 }catch{throw Error('access_keys_unavailable');}
 const jwk=keys.find(k=>k.kid===header.kid&&k.kty==='RSA'&&
   (!k.alg||k.alg==='RS256')&&(!k.use||k.use==='sig'));
 if(!jwk)throw Error('unrecognized_access_key');
 try{
  const key=await crypto.subtle.importKey('jwk',jwk,
   {name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  const valid=await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,
   b64decode(signature),encoder.encode(head+'.'+body));
  if(!valid)throw Error('bad_signature');
 }catch{throw Error('invalid_signature');}
 return {subject:payload.sub,email:typeof payload.email==='string'?payload.email:null};
}
