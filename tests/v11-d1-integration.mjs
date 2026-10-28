/* Real SQLite 3 D1-compatible integration suite. Node 22+ with --experimental-sqlite. */
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {generateKeyPairSync,createSign} from 'node:crypto';
import {handleD1} from '../backend/d1/worker.mjs';
import {exampleEditorialDraft} from './fixtures/editorial-draft.mjs';
const db=new DatabaseSync(':memory:');
db.exec(readFileSync(new URL('../backend/d1/migrations/0001_origin_editorial.sql',import.meta.url),'utf8'));
class D1Statement{
 constructor(sql,args=[]){this.sql=sql;this.args=args;}
 bind(...args){return new D1Statement(this.sql,args);}
 first(){return db.prepare(this.sql).get(...this.args)||null;}
 all(){return {results:db.prepare(this.sql).all(...this.args)};}
 run(){const info=db.prepare(this.sql).run(...this.args);return {meta:{changes:Number(info.changes)}};}
}
const d1={
 prepare:sql=>new D1Statement(sql),
 async batch(statements){
  db.exec('BEGIN IMMEDIATE');
  try{
   const result=statements.map(x=>x.run());
   db.exec('COMMIT');
   return result;
  }catch(e){db.exec('ROLLBACK');throw e;}
 }
};
const subject={
 author:'access-subject-author', reviewer:'access-subject-reviewer',
 publisher:'access-subject-publisher', admin:'access-subject-admin',
 inactive:'access-subject-inactive', second:'access-subject-other-writer'
};
for(const [role,sub] of Object.entries(subject)){
 db.prepare('INSERT INTO origin_memberships(subject,email,role,active) VALUES(?,?,?,?)')
  .run(sub,role+'@example.test',
   role==='author'||role==='second'||role==='inactive'?'contributor':role,
   role==='inactive'?0:1);
}
const env={ORIGIN_STUDIO_ALLOWED_ORIGIN:'https://origin-creator-journey.example.test',
 ORIGIN_ACCESS_TEAM_DOMAIN:'https://origin-example.cloudflareaccess.com',
 ORIGIN_ACCESS_AUD:'0123456789abcdef0123456789abcdef',
 ORIGIN_EDITORIAL_DB:d1};
const pair=generateKeyPairSync('rsa',{modulusLength:2048});
const publicJwk=pair.publicKey.export({format:'jwk'});publicJwk.kid='origin-test-key';
publicJwk.alg='RS256';publicJwk.use='sig';
const jwks={keys:[publicJwk]};
let authFetches=0;
const fetcher=async(url)=>{
 authFetches++;
 assert.equal(url,env.ORIGIN_ACCESS_TEAM_DOMAIN+'/cdn-cgi/access/certs');
 return new Response(JSON.stringify(jwks),{status:200});
};
const b64=value=>Buffer.from(value).toString('base64url');
function accessToken(sub,override={}){
 const claims={iss:env.ORIGIN_ACCESS_TEAM_DOMAIN,aud:[env.ORIGIN_ACCESS_AUD],
  sub,iat:Math.floor(Date.now()/1000)-15,exp:Math.floor(Date.now()/1000)+1800,...override};
 const head=b64(JSON.stringify({alg:'RS256',kid:'origin-test-key',typ:'JWT'}));
 const body=b64(JSON.stringify(claims));
 const signature=createSign('RSA-SHA256').update(head+'.'+body).end().sign(pair.privateKey).toString('base64url');
 return head+'.'+body+'.'+signature;
}
async function request(method,path,role,body,headers={}){
 const h={'Origin':env.ORIGIN_STUDIO_ALLOWED_ORIGIN,
  'Cf-Access-Jwt-Assertion':accessToken(subject[role]),...headers};
 if(body!==undefined)h['Content-Type']='application/json';
 const r=await handleD1(new Request('https://origin-editorial.example.test'+path,{
  method,headers:h,body:body===undefined?undefined:JSON.stringify(body)
 }),env,fetcher);
 return {status:r.status,body:await r.json().catch(()=>null)};
}
const uuid=/^[0-9a-f-]{36}$/;
const sample=exampleEditorialDraft();
let res=await request('GET','/v1/me','author');
assert.equal(res.status,200);assert.equal(res.body.role,'contributor');
res=await request('GET','/v1/me','inactive');
assert.equal(res.status,403,'Inactive accounts not authorized');
res=await request('POST','/v1/journeys','reviewer',{slug:'reviewer-own',title:'No'});
assert.equal(res.status,403);
res=await request('POST','/v1/journeys','author',{slug:'creator-one',title:'Original Journey'});
assert.equal(res.status,200);const journeyId=res.body.id;assert.match(journeyId,uuid);
const forged=await request('POST','/v1/journeys','second',{slug:'another',title:'Second Journey',subject:subject.admin,role:'admin'});
assert.equal(forged.status,200,'A second writer may make own journey but cannot spoof identity');
assert.equal(db.prepare('SELECT created_by FROM origin_journeys WHERE id=?').get(forged.body.id).created_by,subject.second);
res=await request('POST','/v1/revisions','second',{journeyId,content:sample});
assert.equal(res.status,403,'Different contributor cannot alter another owner journey');
res=await request('POST','/v1/revisions','author',{journeyId,content:{...sample,acts:[{...sample.acts[0],scenes:[{...sample.acts[0].scenes[0],sources:[]}]}]}});
assert.equal(res.status,400,'Server-side citations validated');
res=await request('POST','/v1/revisions','author',{journeyId,content:sample});
assert.equal(res.status,200);const rev1=res.body.id;assert.match(rev1,uuid);
assert.equal(db.prepare('SELECT head_revision FROM origin_journeys WHERE id=?').get(journeyId).head_revision,1);
assert.equal(db.prepare('SELECT count(*) c FROM origin_audit_events WHERE journey_id=?').get(journeyId).c,2);
res=await request('POST','/v1/revisions/'+rev1+'/review','reviewer',{decision:'approve',reason:'I checked archival provenance and dates independently.'});
assert.equal(res.status,409,'Cannot review draft before submission');
res=await request('POST','/v1/revisions/'+rev1+'/submit','reviewer');
assert.equal(res.status,403,'Reviewer cannot submit author work');
res=await request('POST','/v1/revisions/'+rev1+'/submit','author');
assert.equal(res.status,200);
res=await request('POST','/v1/revisions/'+rev1+'/review','author',{decision:'approve',reason:'Author tries to approve their own submission.'});
assert.equal(res.status,403,'Author cannot self-approve');
res=await request('POST','/v1/revisions/'+rev1+'/review','publisher',{decision:'approve',reason:'Publisher tries to act as reviewer.'});
assert.equal(res.status,403);
res=await request('POST','/v1/revisions/'+rev1+'/review','reviewer',{decision:'approve',reason:'I checked archived materials and citation details independently.'});
assert.equal(res.status,200);
assert.equal(db.prepare('SELECT state FROM origin_revisions WHERE id=?').get(rev1).state,'approved');
res=await request('POST','/v1/revisions/'+rev1+'/stage','reviewer');
assert.equal(res.status,403,'Reviewer must not stage own reviewed item');
res=await request('POST','/v1/revisions/'+rev1+'/stage','author');
assert.equal(res.status,403,'Contributor cannot stage');
res=await request('POST','/v1/revisions/'+rev1+'/stage','publisher');
assert.equal(res.status,200);assert.equal(res.body.published,false);
assert.equal(db.prepare('SELECT state FROM origin_release_candidates WHERE revision_id=?').get(rev1).state,'awaiting_external_build');
assert.equal(db.prepare('SELECT count(*) c FROM origin_audit_events WHERE journey_id=?').get(journeyId).c,5);
assert.throws(()=>db.prepare('UPDATE origin_revisions SET content=? WHERE id=?').run('{"malicious":true}',rev1),/immutable_revision/);
assert.throws(()=>db.prepare("UPDATE origin_revisions SET state='draft' WHERE id=?").run(rev1),/invalid_revision_transition/);
assert.throws(()=>db.prepare('DELETE FROM origin_review_decisions').run(),/immutable_review/);
assert.throws(()=>db.prepare('DELETE FROM origin_audit_events').run(),/immutable_audit/);
res=await request('POST','/v1/revisions','author',{journeyId,content:sample});const rev2=res.body.id;
assert.equal(res.status,200);assert.equal(res.body.revisionNo,2);
res=await request('POST','/v1/revisions/'+rev1+'/stage','publisher');
assert.equal(res.status,409,'Older revision becomes stale after subsequent append');
res=await request('GET','/v1/journeys','reviewer');
assert.equal(res.status,200);assert.equal(res.body.journeys.length,2);
res=await request('GET','/v1/journeys/'+journeyId+'/revisions','reviewer');
assert.equal(res.status,200);assert.deepEqual(res.body.revisions.map(x=>x.revision_no),[2,1]);
res=await request('GET','/v1/revisions/'+rev2,'reviewer');
assert.equal(res.status,200);assert.equal(res.body.revision.content.profile.name,sample.profile.name);
const badOrigin=await request('GET','/v1/me','author',undefined,{'Origin':'https://attacker.example.test'});
assert.equal(badOrigin.status,403,'Cross-origin browser requests blocked');
const token=accessToken(subject.author),p=token.split('.');
const tampered=p[0]+'.'+b64(JSON.stringify({...JSON.parse(Buffer.from(p[1],'base64url')),sub:subject.admin}))+'.'+p[2];
const response=await handleD1(new Request('https://origin-editorial.example.test/v1/me',{
 headers:{Origin:env.ORIGIN_STUDIO_ALLOWED_ORIGIN,'Cf-Access-Jwt-Assertion':tampered}
}),env,fetcher);
assert.equal(response.status,403,'Forged signature must fail, even when a valid member is named');
for(const claims of [{iss:'https://attacker.cloudflareaccess.com'},{aud:['badbadbadbadbadbadbadbadbadbadba']},{exp:Math.floor(Date.now()/1000)-2}]){
 const token=accessToken(subject.author,claims);
 const result=await handleD1(new Request('https://origin-editorial.example.test/v1/me',{headers:{
  Origin:env.ORIGIN_STUDIO_ALLOWED_ORIGIN,'Cf-Access-Jwt-Assertion':token
 }}),env,fetcher);
 assert.equal(result.status,403,'Invalid issuer/audience/expiration blocked');
}
const missing=await handleD1(new Request('https://origin-editorial.example.test/v1/me',{
 headers:{Origin:env.ORIGIN_STUDIO_ALLOWED_ORIGIN}}),env,fetcher);
assert.equal(missing.status,403,'Missing Access token blocked');
res=await request('POST','/v1/revisions/'+rev2+'/submit','author',undefined,{'Origin':''});
assert.equal(res.status,403,'POST with no Origin is blocked, even with a valid JWT');
assert.ok(authFetches>10,'JWKS validation used for live requests');
db.close();
console.log('ORIGIN D1 integration PASS: Access RS256 verification, memberships, draft validation, atomic revisions, independent review and staging, immutable audit, real SQLite reads, origin controls.');
