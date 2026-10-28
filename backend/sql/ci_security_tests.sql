-- Tested inside disposable Postgres 17 GitHub Actions service.
-- No modifications to an actual user Supabase project.
\set ON_ERROR_STOP on
insert into public.origin_memberships(user_id,role,active) values
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','contributor',true),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','reviewer',true),
 ('cccccccc-cccc-4ccc-8ccc-cccccccccccc','publisher',true),
 ('dddddddd-dddd-4ddd-8ddd-dddddddddddd','admin',true),
 ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','contributor',false);

set role service_role;
do $v11_5_test$
declare
 owner uuid:='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
 reviewer uuid:='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
 publisher uuid:='cccccccc-cccc-4ccc-8ccc-cccccccccccc';
 admin uuid:='dddddddd-dddd-4ddd-8ddd-dddddddddddd';
 inactive uuid:='eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
 journey uuid;
 first_revision uuid;
 newer_revision uuid;
 candidate uuid;
 content jsonb:='{"schemaVersion":1,"profile":{"name":"An Original Creator","subtitle":"A life","years":"1900–2000"},"acts":[{"name":"First act","scenes":[{"title":"A moment","lead":"Documented fact"}]}]}'::jsonb;
begin
 begin
  perform public.origin_create_journey(inactive,'inactive-journey','Not allowed');
  raise exception 'Inactive member created journey';
 exception when insufficient_privilege then null;
 end;
 begin
  perform public.origin_create_journey(reviewer,'reviewer-journey','Not allowed');
  raise exception 'Reviewer created journey';
 exception when insufficient_privilege then null;
 end;
 journey:=public.origin_create_journey(owner,'first-journey','First Journey');
 if journey is null then raise exception 'Journey missing';end if;
 begin
  perform public.origin_append_revision(reviewer,journey,content);
  raise exception 'Reviewer appended revision';
 exception when insufficient_privilege then null;
 end;
 first_revision:=public.origin_append_revision(owner,journey,content);
 if (select revision_no from public.origin_revisions where id=first_revision)<>1 then
  raise exception 'Revision not numbered 1';
 end if;
 begin
  perform public.origin_review_revision(owner,first_revision,'approve',
   'Author is trying to approve their own work');
  raise exception 'Author reviewed own revision';
 exception when insufficient_privilege then null;
 end;
 begin
  perform public.origin_stage_release(publisher,first_revision);
  raise exception 'Staged unreviewed draft';
 exception when insufficient_privilege then null;
 end;
 perform public.origin_submit_revision(owner,first_revision);
 begin
  perform public.origin_review_revision(publisher,first_revision,'approve',
   'Publisher should not perform editorial review');
  raise exception 'Publisher reviewed revision';
 exception when insufficient_privilege then null;
 end;
 perform public.origin_review_revision(reviewer,first_revision,'approve',
  'Verified factual narrative and archival citations independently');
 if (select state from public.origin_revisions where id=first_revision)<>'approved' then
  raise exception 'Approved status missing';
 end if;
 begin
  perform public.origin_stage_release(owner,first_revision);
  raise exception 'Author staged own release';
 exception when insufficient_privilege then null;
 end;
 begin
  perform public.origin_stage_release(reviewer,first_revision);
  raise exception 'Reviewer staged their own release';
 exception when insufficient_privilege then null;
 end;
 candidate:=public.origin_stage_release(publisher,first_revision);
 if (select state from public.origin_release_candidates where id=candidate)<>'awaiting_external_build' then
  raise exception 'Stage candidate did not remain internal';
 end if;
 begin
  perform public.origin_stage_release(publisher,first_revision);
  raise exception 'Same revision staged twice';
 exception when unique_violation then null;
 end;
 newer_revision:=public.origin_append_revision(owner,journey,content);
 if (select revision_no from public.origin_revisions where id=newer_revision)<>2 then
  raise exception 'Revision numbering failed';
 end if;
 begin
  perform public.origin_stage_release(publisher,first_revision);
  raise exception 'Old revision staged after update';
 exception when insufficient_privilege then null;
 when unique_violation then raise exception 'Wrong reject reason: stale revision must fail before duplicate';
 end;
 if (select count(*) from public.origin_audit_events where journey_id=journey)<>7 then
  raise exception 'Expected precisely 7 append-only audit events';
 end if;
 if (select count(*) from public.origin_release_candidates where journey_id=journey)<>1 then
  raise exception 'Release candidates duplicated';
 end if;
 raise notice 'ORIGIN PostgreSQL three-person workflow PASS';
end $v11_5_test$;
reset role;

set role authenticated;
select set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',false);
do $rls_user$
begin
 if (select count(*) from public.origin_memberships)<>1 then
  raise exception 'Authenticated user can read other membership rows';
 end if;
 if (select count(*) from public.origin_journeys)<>1 then
  raise exception 'Active member should be able to read team journeys';
 end if;
 begin
  insert into public.origin_memberships(user_id,role,active)
   values('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','admin',true);
  raise exception 'User escalated their role directly';
 exception when insufficient_privilege then null;
 end;
 begin
  perform public.origin_create_journey('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
   'bypass','Attempt direct RPC');
  raise exception 'Authenticated client executed privileged RPC';
 exception when insufficient_privilege then null;
 end;
end $rls_user$;
select set_config('request.jwt.claim.sub','eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',false);
do $inactive$
begin
 if (select count(*) from public.origin_memberships)<>0
  or (select count(*) from public.origin_journeys)<>0 then
  raise exception 'Inactive member could read editorial content';
 end if;
end $inactive$;
reset role;
set role anon;
do $anonymous$
begin
 begin
  perform 1 from public.origin_journeys limit 1;
  raise exception 'Anonymous visitor read internal journeys';
 exception when insufficient_privilege then null;
 end;
end $anonymous$;
reset role;
select 'ORIGIN V11.5 POSTGRES RLS, ROLE SEGREGATION, AUDIT & RELEASE GATES PASS' as result;
