# ORIGIN V11.5–V11.6 — Isolated Authenticated Editorial Backend Foundation

**V11.6 update:** Supabase now recommends `sb_publishable_...` and `sb_secret_...` API keys. The backend has been updated to use these rather than the deprecated long-lived service-role JWT. It also validates complete editorial drafts, offers bounded authenticated cloud-read endpoints, and includes a read-only project preflight. The authoritative connection instructions are in [V11_6_CONNECTION_READINESS.md](V11_6_CONNECTION_READINESS.md). **There is still no live ORIGIN project or backend deployment.**

## Delivery status
**Backend source and an independent security test suite, not a deployed production backend.** The public ORIGIN V10 and V11 Studio Cloudflare Worker is unchanged. There is **no dedicated ORIGIN Supabase project in the connected account** as of October 28, 2026. The three connected projects belong to Movie Newsroom, CineRelay and FrameByNavin Creator OS, and MUST NOT be repurposed or contaminated.

The code lives entirely in `backend/` and `tests/v11-backend-api.mjs`. The existing static Cloudflare deployment only deploys `www/` and does not deploy this API. This separation is an intentional fail-closed control: no public admin endpoint or login is advertised.

## Backend architecture
- **Supabase Auth:** a valid bearer access token is verified against `GET /auth/v1/user` for every request; no trusted user IDs or roles are accepted from JSON input.
- **Team membership:** each action queries `origin_memberships` server-side, including the `active` flag. The membership table is centrally managed (no self-signup for editorial roles).
- **Contributors** create journeys, append numbered content revisions to journeys they own, and submit drafts.
- **Reviewers** assess submitted revisions from other people and record an independent approval or changes-requested decision.
- **Publishers** can stage approved revisions that are still the newest version, but neither the author nor the reviewer may stage that same revision.
- **Admins** can perform role-level operations, but still cannot approve or stage work they authored, or stage an item they reviewed.
- **Public publishing remains disabled:** `stage` creates only an `awaiting_external_build` internal candidate. No static assets are deployed and no creator catalogue is modified.
- **Revision history:** each new revision is append-only and numbered atomically while the journey row is locked. Submitted and approved revision content is never overwritten.
- **Audit trail:** trusted server actions append database events with actor, journey/revision, action and time. No direct browser writes to audit rows.
- **Permissions:** tables have RLS enabled, anonymous clients receive no grants, authenticated clients get membership-scoped read-only access, and privileged RPC functions grant EXECUTE only to `service_role`. RPC functions use `SECURITY INVOKER`, never `SECURITY DEFINER`.
- **Secrets:** the service-role key must be stored in the *separate backend Worker* secret configuration, never under `www/`, the GitHub repository, a client JavaScript bundle or a public URL.

## Backend API contract (NOT LIVE)
```
GET  /v1/me                        -> verified user and membership role
POST /v1/journeys                  -> {slug,title}                      [contributor,admin]
POST /v1/revisions                 -> {journeyId,content}               [contributor,admin]
POST /v1/revisions/:uuid/submit    -> empty body                        [contributor,admin]
POST /v1/revisions/:uuid/review    -> {decision,reason}                 [reviewer,admin]
POST /v1/revisions/:uuid/stage     -> empty body                        [publisher,admin]
```

All endpoints require `Authorization: Bearer <Supabase access token>`. Browser CORS permits only the configured ORIGIN Studio origin, without cookies. The Worker re-verifies identity and role for every request. Database rules additionally restrict actual authorship and independent approval. The API refuses malformed payloads and does not expose detailed SQL errors.

## Expected configuration — NOT SET
```text
ORIGIN_SUPABASE_URL=https://<dedicated-origin-project>.supabase.co
ORIGIN_SUPABASE_PUBLISHABLE_KEY=<new sb_publishable key, never treated as an access token>
ORIGIN_SUPABASE_SECRET_KEY=<new sb_secret key; backend Worker secret only>
ORIGIN_STUDIO_ALLOWED_ORIGIN=https://origin-creator-journey.rayadinaveen98.workers.dev
```

**Do not deploy this code yet.** Before deploying, select an organization for an isolated ORIGIN Supabase project and review any quoted project costs. The service expects the legacy Supabase service-role JWT in the backend secret; verify compatibility with your specific project's new secret/publishable key setup. Bootstrap at least three *distinct* authorized staff accounts (contributor, reviewer, publisher) through a controlled, authenticated administrator-only process.

## Secure rollout steps
1. Select a separate organization/project for ORIGIN and verify project creation will not incur unapproved cost. Never use the CineRelay or Backlot database.
2. Once its project is healthy, create a migration file through the Supabase CLI (`supabase migration new origin_editorial_v11_5`), copy the reviewed contents of `backend/sql/initial_schema.sql` into that generated file, then apply it only to ORIGIN.
3. Run actual database role/RLS denial tests, Supabase Security Advisor, and check both GRANTs and RLS policies. This repo's disposable Postgres integration tests are an early automated safety net, not proof of live-project settings.
4. Configure an entirely separate private backend Worker with the three listed values. Inject secrets using the deployment system's secret store; don't add them to git or publish any service role key.
5. Verify real Supabase Auth sessions, account bootstrap, expired/revoked token behavior, roles and offboarding, rate limits, CSRF/Origin policy, request size/race behavior, and audit events. Require MFA for admins, reviewers and publishers before launch.
6. Add a separate, authenticated Studio frontend and deploy it only after all denial-path and end-to-end tests pass. The existing public Studio remains local-only until then.
7. Add a controlled release packager, historical/media-rights verification, signed asset manifest and rollback process. Staging a candidate must not be mistaken for public release.

## Automated CI
GitHub workflow `.github/workflows/origin-v11-5-backend.yml` runs:
- Dependency-free Node mock Auth/API tests: no token, invalid token, inactive account, wrong role, actor spoofing, cross-origin requests, invalid JSON and no generic privileged RPC proxy.
- Disposable **real PostgreSQL 17** integration tests, with emulated Supabase Auth roles, verifying RLS visibility, direct-write rejection, independent approval, atomic revision sequencing, release staging and audit trail.

`backend/sql/ci_auth_fixture.sql` is **only a disposable CI Auth simulation**. NEVER run it against Supabase. No user/customer data is in the test files.

## Deferred production work
No working account sign-in, roles UI, server-side encrypted storage, invite management, live remote editorial sync, asset licenses, signed releases, or public publish automation is claimed in V11.5. The work provides the foundation and tests needed before safely adding these capabilities.
