/* ORIGIN V11.7 D1 repository: no direct client SQL access.
 * D1.batch is transactional, so content revision+head+audit commit together.
 * Every DB call is server-only following verified Access JWT + active membership.
 */
import {validateEditorialDraft} from '../validate-draft.mjs';
export class EditorialError extends Error{
 constructor(status,code){super(code);this.status=status;this.code=code;}
}
const deny=()=>{throw new EditorialError(403,'role_denied');};
const conflict=()=>{throw new EditorialError(409,'revision_conflict');};
const roles=new Set(['contributor','reviewer','publisher','admin']);
const userCan=(role,...allowed)=>role==='admin'||allowed.includes(role);
const uuid=x=>typeof x==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(x);
const slug=x=>typeof x==='string'&&/^[a-z0-9][a-z0-9-]{1,62}$/.test(x);
const take=(result)=>result?.meta?.changes===1;
export async function member(db,subject){
 const row=await db.prepare('SELECT role,active FROM origin_memberships WHERE subject=?')
  .bind(subject).first();
 if(!row||row.active!==1||!roles.has(row.role))deny();
 return {subject,role:row.role};
}
export async function execute(db,actor,op,data={}){
 const {subject,role}=actor;
 if(!roles.has(role))deny();
 if(op==='me')return {subject,role};
 if(op==='list'){
  const rows=await db.prepare('SELECT id,slug,title,head_revision,updated_at FROM origin_journeys ORDER BY updated_at DESC LIMIT 30').all();
  return {journeys:rows.results||[]};
 }
 if(op==='revisionList'){
  if(!uuid(data.journeyId))throw new EditorialError(400,'invalid_journey');
  const rows=await db.prepare('SELECT id,revision_no,state,created_at,submitted_at,reviewed_at FROM origin_revisions WHERE journey_id=? ORDER BY revision_no DESC LIMIT 40').bind(data.journeyId).all();
  return {revisions:rows.results||[]};
 }
 if(op==='revisionRead'){
  if(!uuid(data.revisionId))throw new EditorialError(400,'invalid_revision');
  const row=await db.prepare('SELECT id,journey_id,revision_no,state,content,created_at FROM origin_revisions WHERE id=?').bind(data.revisionId).first();
  if(!row)throw new EditorialError(404,'not_found');
  return {revision:{...row,content:JSON.parse(row.content)}};
 }
 if(op==='create'){
  if(!userCan(role,'contributor'))deny();
  if(!slug(data.slug)||typeof data.title!=='string'||data.title.trim().length<2||data.title.trim().length>140)throw new EditorialError(400,'invalid_journey');
  const id=crypto.randomUUID();
  await db.batch([
   db.prepare('INSERT INTO origin_journeys(id,slug,title,created_by) VALUES(?,?,?,?)').bind(id,data.slug,data.title.trim(),subject),
   db.prepare("INSERT INTO origin_audit_events(journey_id,actor_subject,event_name) VALUES(?,?,'journey_created')").bind(id,subject)
  ]);
  return {id};
 }
 if(op==='append'){
  if(!userCan(role,'contributor'))deny();
  if(!uuid(data.journeyId)||!validateEditorialDraft(data.content).ok)throw new EditorialError(400,'invalid_revision');
  const journey=await db.prepare('SELECT id,created_by,head_revision FROM origin_journeys WHERE id=?').bind(data.journeyId).first();
  if(!journey)throw new EditorialError(404,'not_found');
  if(role!=='admin'&&journey.created_by!==subject)deny();
  const revisionId=crypto.randomUUID(),next=journey.head_revision+1;
  const results=await db.batch([
   db.prepare("INSERT INTO origin_revisions(id,journey_id,revision_no,created_by,content,state) VALUES(?,?,?,?,?,'draft')")
    .bind(revisionId,journey.id,next,subject,JSON.stringify(data.content)),
   db.prepare("UPDATE origin_journeys SET head_revision=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND head_revision=?")
    .bind(next,journey.id,journey.head_revision),
   db.prepare("INSERT INTO origin_audit_events(journey_id,revision_id,actor_subject,event_name) VALUES(?,?,?,'revision_appended')")
    .bind(journey.id,revisionId,subject)
  ]);
  if(!take(results[0])||!take(results[1]))conflict();
  return {id:revisionId,revisionNo:next};
 }
 if(!uuid(data.revisionId))throw new EditorialError(400,'invalid_revision');
 const row=await db.prepare(
  'SELECT r.id,r.journey_id,r.created_by,r.revision_no,r.state,j.head_revision FROM origin_revisions r JOIN origin_journeys j ON j.id=r.journey_id WHERE r.id=?'
 ).bind(data.revisionId).first();
 if(!row)throw new EditorialError(404,'not_found');
 if(op==='submit'){
  if(!userCan(role,'contributor')||row.created_by!==subject)deny();
  if(row.state!=='draft'||row.revision_no!==row.head_revision)conflict();
  const results=await db.batch([
   db.prepare("UPDATE origin_revisions SET state='submitted',submitted_at=CURRENT_TIMESTAMP WHERE id=? AND state='draft' AND revision_no=(SELECT head_revision FROM origin_journeys WHERE id=journey_id)")
    .bind(row.id),
   db.prepare("INSERT INTO origin_audit_events(journey_id,revision_id,actor_subject,event_name) SELECT ?,?,?,'revision_submitted' WHERE changes()=1")
    .bind(row.journey_id,row.id,subject)
  ]);
  if(!take(results[0])||!take(results[1]))conflict();
  return {ok:true,state:'submitted'};
 }
 if(op==='review'){
  if(!userCan(role,'reviewer')||row.created_by===subject)deny();
  if(row.state!=='submitted'||row.revision_no!==row.head_revision)conflict();
  if(!['approve','request_changes'].includes(data.decision)||
   typeof data.reason!=='string'||data.reason.trim().length<20||data.reason.trim().length>2000)
   throw new EditorialError(400,'invalid_review');
  const outcome=data.decision==='approve'?'approved':'changes_requested',id=crypto.randomUUID();
  const results=await db.batch([
   db.prepare("INSERT INTO origin_review_decisions(id,revision_id,reviewer_subject,decision,explanation) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM origin_revisions WHERE id=? AND state='submitted')")
    .bind(id,row.id,subject,data.decision,data.reason.trim(),row.id),
   db.prepare('UPDATE origin_revisions SET state=?,reviewed_at=CURRENT_TIMESTAMP WHERE id=? AND state=\'submitted\' AND revision_no=(SELECT head_revision FROM origin_journeys WHERE id=journey_id)')
    .bind(outcome,row.id),
   db.prepare('INSERT INTO origin_audit_events(journey_id,revision_id,actor_subject,event_name) SELECT ?,?,?,? WHERE changes()=1')
    .bind(row.journey_id,row.id,subject,data.decision==='approve'?'review_approved':'changes_requested')
  ]);
  if(!take(results[0])||!take(results[1])||!take(results[2]))conflict();
  return {ok:true,state:outcome};
 }
 if(op==='stage'){
  if(!userCan(role,'publisher')||row.created_by===subject)deny();
  if(row.state!=='approved'||row.revision_no!==row.head_revision)conflict();
  const decision=await db.prepare("SELECT reviewer_subject FROM origin_review_decisions WHERE revision_id=? AND decision='approve'").bind(row.id).first();
  if(!decision||decision.reviewer_subject===subject)deny();
  const id=crypto.randomUUID();
  const results=await db.batch([
   db.prepare("INSERT INTO origin_release_candidates(id,revision_id,journey_id,staged_by) VALUES(?,?,?,?)")
    .bind(id,row.id,row.journey_id,subject),
   db.prepare("INSERT INTO origin_audit_events(journey_id,revision_id,actor_subject,event_name,metadata) SELECT ?,?,?,'candidate_staged',? WHERE changes()=1")
    .bind(row.journey_id,row.id,subject,JSON.stringify({candidateId:id}))
  ]);
  if(!take(results[0])||!take(results[1]))conflict();
  return {id,state:'awaiting_external_build',published:false};
 }
 throw new EditorialError(404,'not_found');
}
