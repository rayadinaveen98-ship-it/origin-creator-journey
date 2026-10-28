-- Ephemeral CI-only Supabase auth/role emulation for isolated PostgreSQL testing.
-- Never apply this file to a real Supabase project.
create schema auth;
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
 select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid;
$$;
grant usage on schema auth to authenticated,service_role;
grant execute on function auth.uid() to authenticated,service_role;
insert into auth.users(id) values
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
 ('cccccccc-cccc-4ccc-8ccc-cccccccccccc'),
 ('dddddddd-dddd-4ddd-8ddd-dddddddddddd'),
 ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee');
