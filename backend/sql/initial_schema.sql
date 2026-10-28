-- ORIGIN V11.5 — ISOLATED BACKEND SCHEMA BLUEPRINT.
-- NOT APPLIED to any connected Supabase project. Apply only to a NEW dedicated ORIGIN project
-- after verifying organization, plan, RLS tests, and administrator bootstrap procedure.
-- All state-changing RPCs are service_role-only, SECURITY INVOKER.
-- All actor IDs are supplied ONLY by the ORIGIN backend after verifying a Supabase Auth token.
begin;

create table public.origin_memberships (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null check (role in ('contributor','reviewer','publisher','admin')),
 active boolean not null default false,
 created_at timestamptz not null default now()
);

create table public.origin_journeys (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,62}$'),
 title text not null check (length(btrim(title)) between 2 and 140),
 created_by uuid not null references auth.users(id),
 head_revision integer not null default 0 check (head_revision >= 0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table public.origin_revisions (
 id uuid primary key default gen_random_uuid(),
 journey_id uuid not null references public.origin_journeys(id) on delete restrict,
 revision_no integer not null check (revision_no > 0),
 created_by uuid not null references auth.users(id),
 content jsonb not null check (
   jsonb_typeof(content)='object' and content ? 'profile' and content ? 'acts'
   and content->>'schemaVersion'='1'
   and octet_length(content::text) between 50 and 300000
 ),
 state text not null default 'draft' check (state in ('draft','submitted','changes_requested','approved')),
 created_at timestamptz not null default now(),
 submitted_at timestamptz,
 reviewed_at timestamptz,
 unique(journey_id,revision_no)
);

create table public.origin_review_decisions (
 id uuid primary key default gen_random_uuid(),
 revision_id uuid not null unique references public.origin_revisions(id) on delete restrict,
 reviewer_id uuid not null references auth.users(id),
 decision text not null check(decision in ('approve','request_changes')),
 explanation text not null check(length(btrim(explanation)) between 20 and 2000),
 created_at timestamptz not null default now()
);

create table public.origin_release_candidates (
 id uuid primary key default gen_random_uuid(),
 revision_id uuid not null unique references public.origin_revisions(id) on delete restrict,
 journey_id uuid not null references public.origin_journeys(id) on delete restrict,
 staged_by uuid not null references auth.users(id),
 state text not null default 'awaiting_external_build'
  check(state = 'awaiting_external_build'),
 created_at timestamptz not null default now()
);

create table public.origin_audit_events (
 id bigint generated always as identity primary key,
 journey_id uuid references public.origin_journeys(id) on delete restrict,
 revision_id uuid references public.origin_revisions(id) on delete restrict,
 actor_id uuid not null references auth.users(id),
 event_name text not null check(event_name in
  ('journey_created','revision_appended','revision_submitted','review_approved',
   'changes_requested','candidate_staged')),
 metadata jsonb not null default '{}'::jsonb,
 occurred_at timestamptz not null default now()
);

create index origin_journeys_creator_idx on public.origin_journeys(created_by);
create index origin_revisions_journey_idx on public.origin_revisions(journey_id,revision_no desc);
create index origin_reviews_reviewer_idx on public.origin_review_decisions(reviewer_id);
create index origin_candidates_journey_idx on public.origin_release_candidates(journey_id);
create index origin_audit_journey_idx on public.origin_audit_events(journey_id,occurred_at desc);

-- Preserve provenance under normal application-level database credentials.
-- State transitions remain possible through the authenticated backend RPCs,
-- but content and authorship of an existing revision can never be overwritten.
create function public.origin_protect_revision_history()
 returns trigger language plpgsql security invoker set search_path = '' as $origin_trigger$
begin
 if new.id is distinct from old.id or new.journey_id is distinct from old.journey_id
  or new.revision_no is distinct from old.revision_no
  or new.content is distinct from old.content
  or new.created_by is distinct from old.created_by
  or new.created_at is distinct from old.created_at then
  raise exception 'revision content is immutable' using errcode='42501';
 end if;
 if new.state is distinct from old.state and not (
   (old.state='draft' and new.state='submitted') or
   (old.state='submitted' and new.state in ('approved','changes_requested'))
  ) then
  raise exception 'invalid revision state transition' using errcode='42501';
 end if;
 return new;
end $origin_trigger$;
create trigger origin_revisions_immutable before update
 on public.origin_revisions for each row execute function public.origin_protect_revision_history();

create function public.origin_block_append_only_mutation()
 returns trigger language plpgsql security invoker set search_path = '' as $origin_trigger$
begin
 raise exception 'append-only records cannot be changed or deleted' using errcode='42501';
end $origin_trigger$;
create trigger origin_audit_no_changes before update or delete
 on public.origin_audit_events for each row execute function public.origin_block_append_only_mutation();
create trigger origin_review_decisions_no_changes before update or delete
 on public.origin_review_decisions for each row execute function public.origin_block_append_only_mutation();
revoke all on function
 public.origin_protect_revision_history(),
 public.origin_block_append_only_mutation() from public,anon,authenticated;
-- Trigger execution itself does not require client-side EXECUTE permission.

-- Explicitly deny browser writes. RLS is a second boundary, not the only one.
alter table public.origin_memberships enable row level security;
alter table public.origin_journeys enable row level security;
alter table public.origin_revisions enable row level security;
alter table public.origin_review_decisions enable row level security;
alter table public.origin_release_candidates enable row level security;
alter table public.origin_audit_events enable row level security;

revoke all on table public.origin_memberships,public.origin_journeys,
 public.origin_revisions,public.origin_review_decisions,
 public.origin_release_candidates,public.origin_audit_events from public,anon,authenticated;
revoke all on sequence public.origin_audit_events_id_seq from public,anon,authenticated;
grant select on public.origin_memberships,public.origin_journeys,
 public.origin_revisions,public.origin_review_decisions,
 public.origin_release_candidates,public.origin_audit_events to authenticated;
grant select,insert,update,delete on public.origin_memberships,public.origin_journeys,
 public.origin_revisions,public.origin_review_decisions,
 public.origin_release_candidates,public.origin_audit_events to service_role;
grant usage,select on sequence public.origin_audit_events_id_seq to service_role;

create policy origin_memberships_self_read on public.origin_memberships
 for select to authenticated
 using(user_id=(select auth.uid()) and active = true);

create policy origin_journeys_team_read on public.origin_journeys
 for select to authenticated using (
  exists(select 1 from public.origin_memberships m
   where m.user_id=(select auth.uid()) and m.active = true)
 );
create policy origin_revisions_team_read on public.origin_revisions
 for select to authenticated using (
  exists(select 1 from public.origin_memberships m
   where m.user_id=(select auth.uid()) and m.active = true)
 );
create policy origin_review_decisions_team_read on public.origin_review_decisions
 for select to authenticated using (
  exists(select 1 from public.origin_memberships m
   where m.user_id=(select auth.uid()) and m.active = true)
 );
create policy origin_release_candidates_team_read on public.origin_release_candidates
 for select to authenticated using (
  exists(select 1 from public.origin_memberships m
   where m.user_id=(select auth.uid()) and m.active = true)
 );
create policy origin_audit_events_team_read on public.origin_audit_events
 for select to authenticated using (
  exists(select 1 from public.origin_memberships m
   where m.user_id=(select auth.uid()) and m.active = true)
 );

-- No public, anon or authenticated user can directly execute the write RPCs.
-- The backend authenticates the caller and sends a SERVER-derived p_actor.
create function public.origin_create_journey(p_actor uuid,p_slug text,p_title text)
 returns uuid language plpgsql security invoker set search_path = '' as $$
declare v_id uuid;
begin
 if not exists(select 1 from public.origin_memberships
   where user_id=p_actor and active and role in ('contributor','admin')) then
  raise exception 'role denied' using errcode='42501';
 end if;
 if p_slug is null or p_slug !~ '^[a-z0-9][a-z0-9-]{1,62}$'
    or length(btrim(coalesce(p_title,''))) not between 2 and 140 then
  raise exception 'invalid journey metadata' using errcode='22023';
 end if;
 insert into public.origin_journeys(slug,title,created_by)
 values(p_slug,btrim(p_title),p_actor) returning id into v_id;
 insert into public.origin_audit_events(journey_id,actor_id,event_name)
 values(v_id,p_actor,'journey_created');
 return v_id;
end $$;

create function public.origin_append_revision(p_actor uuid,p_journey uuid,p_content jsonb)
 returns uuid language plpgsql security invoker set search_path = '' as $$
declare v_journey public.origin_journeys%rowtype;v_revision uuid;v_next int;
begin
 select * into v_journey from public.origin_journeys
  where id=p_journey for update;
 if not found then raise exception 'journey not found' using errcode='22023';end if;
 if not exists(select 1 from public.origin_memberships
  where user_id=p_actor and active and
   (role='admin' or (role='contributor' and v_journey.created_by=p_actor))) then
  raise exception 'role denied' using errcode='42501';
 end if;
 if p_content is null or jsonb_typeof(p_content)<>'object'
  or not (p_content ? 'profile' and p_content ? 'acts')
  or p_content->>'schemaVersion'<>'1'
  or octet_length(p_content::text) not between 50 and 300000 then
  raise exception 'invalid draft JSON' using errcode='22023';
 end if;
 v_next:=v_journey.head_revision+1;
 insert into public.origin_revisions(journey_id,revision_no,created_by,content)
 values(p_journey,v_next,p_actor,p_content) returning id into v_revision;
 update public.origin_journeys set head_revision=v_next,updated_at=now() where id=p_journey;
 insert into public.origin_audit_events(journey_id,revision_id,actor_id,event_name)
 values(p_journey,v_revision,p_actor,'revision_appended');
 return v_revision;
end $$;

create function public.origin_submit_revision(p_actor uuid,p_revision uuid)
 returns boolean language plpgsql security invoker set search_path = '' as $$
declare v_revision public.origin_revisions%rowtype;v_head integer;
begin
 select * into v_revision from public.origin_revisions where id=p_revision for update;
 if not found then raise exception 'revision not found' using errcode='22023';end if;
 select head_revision into v_head from public.origin_journeys where id=v_revision.journey_id for update;
 if v_revision.state<>'draft' or v_revision.revision_no<>v_head
  or v_revision.created_by<>p_actor
  or not exists(select 1 from public.origin_memberships where user_id=p_actor and active
    and role in ('contributor','admin')) then
  raise exception 'submission denied' using errcode='42501';
 end if;
 update public.origin_revisions set state='submitted',submitted_at=now() where id=p_revision;
 insert into public.origin_audit_events(journey_id,revision_id,actor_id,event_name)
 values(v_revision.journey_id,p_revision,p_actor,'revision_submitted');
 return true;
end $$;

create function public.origin_review_revision(
 p_actor uuid,p_revision uuid,p_decision text,p_reason text)
 returns boolean language plpgsql security invoker set search_path = '' as $$
declare v_revision public.origin_revisions%rowtype;
begin
 select * into v_revision from public.origin_revisions where id=p_revision for update;
 if not found then raise exception 'revision not found' using errcode='22023';end if;
 if v_revision.state<>'submitted' or p_actor=v_revision.created_by
   or p_decision not in ('approve','request_changes')
   or length(btrim(coalesce(p_reason,''))) not between 20 and 2000
   or not exists(select 1 from public.origin_memberships
      where user_id=p_actor and active and role in ('reviewer','admin')) then
  raise exception 'review denied' using errcode='42501';
 end if;
 insert into public.origin_review_decisions(revision_id,reviewer_id,decision,explanation)
 values(p_revision,p_actor,p_decision,btrim(p_reason));
 update public.origin_revisions set
   state=case when p_decision='approve' then 'approved' else 'changes_requested' end,
   reviewed_at=now() where id=p_revision;
 insert into public.origin_audit_events(journey_id,revision_id,actor_id,event_name)
 values(v_revision.journey_id,p_revision,p_actor,
  case when p_decision='approve' then 'review_approved' else 'changes_requested' end);
 return true;
end $$;

create function public.origin_stage_release(p_actor uuid,p_revision uuid)
 returns uuid language plpgsql security invoker set search_path = '' as $$
declare v_revision public.origin_revisions%rowtype;v_head integer;v_reviewer uuid;v_candidate uuid;
begin
 select * into v_revision from public.origin_revisions where id=p_revision for update;
 if not found then raise exception 'revision not found' using errcode='22023';end if;
 select head_revision into v_head from public.origin_journeys where id=v_revision.journey_id for update;
 select reviewer_id into v_reviewer from public.origin_review_decisions
  where revision_id=p_revision and decision='approve';
 if v_revision.state<>'approved' or v_head<>v_revision.revision_no
   or v_reviewer is null or p_actor in (v_revision.created_by,v_reviewer)
   or not exists(select 1 from public.origin_memberships
      where user_id=p_actor and active and role in ('publisher','admin')) then
  raise exception 'release staging denied' using errcode='42501';
 end if;
 insert into public.origin_release_candidates(revision_id,journey_id,staged_by)
 values(p_revision,v_revision.journey_id,p_actor) returning id into v_candidate;
 insert into public.origin_audit_events(journey_id,revision_id,actor_id,event_name,
  metadata) values(v_revision.journey_id,p_revision,p_actor,'candidate_staged',
  jsonb_build_object('candidate_id',v_candidate));
 -- Staging writes only an internal candidate; it NEVER changes public static assets.
 return v_candidate;
end $$;

revoke all on function
 public.origin_create_journey(uuid,text,text),
 public.origin_append_revision(uuid,uuid,jsonb),
 public.origin_submit_revision(uuid,uuid),
 public.origin_review_revision(uuid,uuid,text,text),
 public.origin_stage_release(uuid,uuid)
 from public,anon,authenticated;
grant execute on function
 public.origin_create_journey(uuid,text,text),
 public.origin_append_revision(uuid,uuid,jsonb),
 public.origin_submit_revision(uuid,uuid),
 public.origin_review_revision(uuid,uuid,text,text),
 public.origin_stage_release(uuid,uuid)
 to service_role;

commit;
