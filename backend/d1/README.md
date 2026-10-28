# ORIGIN V11.7 — Dedicated Cloudflare D1 Editorial Backend

## Why this backend
Supabase quoted $0/month for a separate ORIGIN project but refused to create it because the connected free account has **two active free projects**. We preserve the tested V11.5/11.6 Supabase backend files for future use and instead prepare an independent, free-tier-compatible **Cloudflare D1** service.

Official Free-tier allowance as of October 28, 2026: 5 million rows read/day, 100,000 rows written/day, and 5 GB storage across the account. Free-tier calls stop returning results when daily limits are exceeded; they do not automatically expand to paid capacity. If the account is on a paid tier, usage may have additional costs after the included quotas. Sources: [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) and [daily limits enforcement](https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/).

## V11.7 components
- `backend/d1/migrations/0001_origin_editorial.sql` — isolated SQLite schema for staff memberships, journeys, numbered immutable revisions, independent review decisions, internal release candidates, and append-only audit events. Database triggers protect revision numbering, valid state changes, and independent release staging.
- `backend/d1/access.mjs` — verifies **Cloudflare Access RS256 JWT signatures** using the rotating JWKS, checks issuer, audience, expiry, not-before, signature and stable subject. Never trusts an unverified `cf-access-jwt-assertion` header or email alone.
- `backend/d1/store.mjs` — parameter-bound SQL via the D1 Worker binding and transactional `D1.batch` for journey creation, revision append, submission, independent review and release staging. The role is read from active server-side memberships for every request.
- `backend/d1/worker.mjs` — a completely separate, deny-by-default Worker entrypoint; it requires Cloudflare Access configuration and a D1 binding, accepts only known operations, rejects unsafe Origins, and suppresses internal SQL details.
- `tests/v11-d1-integration.mjs` — real SQLite integration tests with generated RSA-signed Cloudflare Access tokens. Exercises duplicate/foreign author denial, stale head protections, review/publish segregation, tampered JWT, immutable SQL triggers, audit events and draft validation.
- `.github/workflows/origin-v11-d1.yml` — runs the integration tests on every relevant PR or commit.
- `.github/workflows/origin-d1-provision.yml` — one-time, idempotent D1 provisioning via existing Cloudflare GitHub credentials on merge to main. Database **name** `origin-editorial-v1`, primary location hint `apac`. The workflow runs the full security test first, checks whether that exact database already exists, creates it if absent, then applies tracked migrations and checks that the revisions table exists. Does **not** deploy a Worker, expose an API, or change the public ORIGIN deployment.
- `backend/d1/wrangler.example.jsonc` — fails closed; future private Worker configuration template without a real database ID.

## Connection and authentication gate
Cloudflare D1 is a storage engine, **not a login or permissions provider**. V11.7 uses **Cloudflare Access** as the intended staff authentication mechanism; verify the Worker's production `workers.dev` hostname is *protected by a configured Access application* before deploying it. Access must be configured in the Cloudflare account and must issue application JWTs with the correct Audience tag.

The Worker must have these server-side environment values:
- `ORIGIN_EDITORIAL_DB` — a D1 binding configured to the dedicated database's UUID.
- `ORIGIN_ACCESS_TEAM_DOMAIN` — e.g. `https://your-team.cloudflareaccess.com` (actual Access team URL, **not** guessed).
- `ORIGIN_ACCESS_AUD` — actual Access application audience tag.
- `ORIGIN_STUDIO_ALLOWED_ORIGIN` — the actual trusted Studio origin.
The Access application policy must allow only explicitly invited editorial staff. **Do not protect the existing public ORIGIN Worker with Access.** Protect the **new editorial Worker only** when it is ready.

The database starts with **zero authorized members**. Admin/bootstrap memberships must be inserted through authenticated Cloudflare account administration by exact, verified Access `sub` values. Roles are `contributor`, `reviewer`, `publisher`, and `admin`; the minimum real demonstration needs *three different identities*. All accounts start inactive unless explicitly enabled. No public registration, auto-approval, or browser-managed role escalation exists.

Review [Cloudflare Access for Workers](https://developers.cloudflare.com/workers/configuration/cloudflare-access/) and [Access JWT validation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/).

## API shape (prepared, NOT deployed)
```
GET  /v1/me
GET  /v1/journeys
GET  /v1/journeys/:uuid/revisions
GET  /v1/revisions/:uuid
POST /v1/journeys                 {slug,title}
POST /v1/revisions                {journeyId,content}
POST /v1/revisions/:uuid/submit
POST /v1/revisions/:uuid/review    {decision,reason}
POST /v1/revisions/:uuid/stage
```
There is **no publish endpoint**. Stage only means an internal `awaiting_external_build` candidate. The public V10/V11 website and current Creator Studio remain unaffected.

## Operational safety
- The one-time provisioning workflow uses a **new** GitHub Actions secret, `ORIGIN_D1_API_TOKEN`, with **account-scoped Cloudflare D1 Read and D1 Write**. The existing `CLOUDFLARE_API_TOKEN` is used only to discover which Cloudflare account owns the public ORIGIN Worker, not to manage the D1 database. **Do not replace the public website's deployment token** or paste any token in chat. The originally stored `CLOUDFLARE_ACCOUNT_ID` failed a 32-character ID check; the workflow now resolves the correct account automatically using the existing Workers token.
- The first provisioning attempts failed with D1 API 401 / Cloudflare code 10000. This is an authorization failure; no D1 resource was created. Add the **new** dedicated D1 token in GitHub repository Settings → Secrets and variables → Actions → New repository secret, then re-run the `Provision isolated ORIGIN D1 database` workflow. No D1 migration/public Worker deploy occurs while the token is missing.
- Database creation and migration happen only in `origin-editorial-v1`, never in Backlot, CineRelay, another D1 database, or the public `origin-creator-journey` Worker.
- Idempotent provisioning checks existing DB name and applies only unapplied migration files. No `d1 delete` or `DROP TABLE` commands.
- D1 may be unavailable if Free plan daily limits are reached, requiring waiting for the reset or a separately authorized upgrade.
- Every editorial write creates an audit event, and historic revision content is immutable through ordinary SQL writes. Do **not** claim these records are cryptographically immutable or legal approval.
- The reviewer does not equal the author; the publisher is neither the author nor the reviewer, including for administrators.
- The repository's previous Supabase architecture is preserved; the D1 Worker lives in a different folder and cannot accidentally be deployed by the static-site GitHub workflow.

## Remaining before real users
1. Confirm dedicated D1 provisioning and migrations succeeded; correct the Cloudflare token's D1 scope if not.
2. Set up Cloudflare Zero Trust/Access for a new **editorial Worker only**, configure allowed emails, obtain real Team Domain + AUD.
3. Create least-privileged member records for three actual staff identities, after verifying their Access tokens. Do not invent IDs or grant roles from client-controlled fields.
4. Attach D1 to the **separate** Worker and test the real signed Access JWT, role denials, identity revocation and rate limits.
5. Build authenticated Studio cloud-sync UI without exposing secret bindings or defaulting to browser-local-only data.
6. Add editorial research/licensing checks, signed release manifests, production rollback, and supervised publishing. Do not activate public publishing yet.
