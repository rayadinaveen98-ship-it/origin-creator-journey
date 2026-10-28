import assert from 'node:assert/strict';
import {runPreflight,checkConfiguration} from '../backend/preflight.mjs';
const base={
 ORIGIN_SUPABASE_URL:'https://origin-fixture.supabase.co',
 ORIGIN_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_syntheticKeyOnlyForUnitTests_1234',
 ORIGIN_SUPABASE_SECRET_KEY:'sb_secret_syntheticKeyOnlyForUnitTests_123456',
 ORIGIN_STUDIO_ALLOWED_ORIGIN:'https://origin-creator-journey.example.test'
};
assert.equal(checkConfiguration(base).ok,true);
const invalid={...base,ORIGIN_SUPABASE_SECRET_KEY:''};
let calls=0;
const dummy=async(url,opts)=>{
 calls++;
 assert.equal(opts.method,'GET');
 assert.ok(!opts.headers.Authorization,'Preflight never submits session or secret as bearer JWT');
 assert.equal(opts.headers.apikey,url.includes('/auth/')?base.ORIGIN_SUPABASE_PUBLISHABLE_KEY:base.ORIGIN_SUPABASE_SECRET_KEY);
 return {status:200};
};
let r=await runPreflight(invalid,dummy);
assert.equal(r.ready,false);
assert.equal(calls,0,'Fail closed without credentials or network calls');
r=await runPreflight(base,dummy);
assert.equal(r.ready,true);
assert.equal(calls,2);
assert.equal(r.checks.auth,'pass');
assert.equal(r.checks.membershipSchema,'pass');
assert.match(r.note,/real-user security QA still required/);
const badAPI=async(url)=>({status:url.includes('/rest/')?404:200});
r=await runPreflight(base,badAPI);
assert.equal(r.ready,false,'No Data API exposure must block production readiness');
assert.equal(r.checks.membershipSchema,'fail');
r=await runPreflight(base,async()=>{throw new Error('Never echo user secrets here');});
assert.equal(r.ready,false);
assert.ok(!JSON.stringify(r).includes('Never echo'),'Sensitive network errors stay private');
for(const key of ['ORIGIN_SUPABASE_URL','ORIGIN_SUPABASE_PUBLISHABLE_KEY','ORIGIN_SUPABASE_SECRET_KEY','ORIGIN_STUDIO_ALLOWED_ORIGIN']){
 const malformed={...base,[key]:''};
 assert.equal(checkConfiguration(malformed).ok,false,'Missing '+key+' must block rollout');
}
console.log('ORIGIN V11.6 preflight PASS: fail-closed keys, read-only Auth/REST probes, no secrets in output, no accidental writes.');
