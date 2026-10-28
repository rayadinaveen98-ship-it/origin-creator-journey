# ORIGIN V11.6 — Real Backend Connection Readiness

**Status: code-only preparation and automated tests. Not connected to a Supabase project, and not deployed as a live API.** Public V10/V11 journeys and the V11.4 local-only Creator Studio are intentionally unchanged.

## Verified account context (October 28, 2026)
The connected Supabase organization list includes one organization: **rayadinaveen98-ship-it's Org**. Existing projects are Movie Newsroom, CineRelay, and FrameByNavin Creator OS; none is ORIGIN. Their databases must remain untouched. Creating a new project requires confirmation of the chosen organization and review of the quoted cost (including any possible paid project slots). Do **not** create a project or incur charges without that confirmation.

## Production compatibility improvements

1. **New Supabase API keys.** The backend now expects separate `ORIGIN_SUPABASE_PUBLISHABLE_KEY` and `ORIGIN_SUPABASE_SECRET_KEY` bindings rather than a legacy `service_role` JWT. Supabase Auth verifies the user JWT with a publishable `apikey`; privileged server calls use only a secret `apikey`. Never pass opaque `sb_secret_...` values as JWT bearer headers.
2. **Server-side content schema.** `backend/validate-draft.mjs` independently checks creator identity, chapters, source URLs, distinct IDs, complete sourced story moments, plain text, supported visual templates and image-rights status before any cloud revision is appended. User-supplied image URLs and HTML are rejected.
3. **Cloud read APIs.** Active authenticated members can list up to 30 journeys, list up to 40 revisions for a journey and read a selected revision's actual content. Requests are assembled from fixed PostgREST query templates; no browser-defined arbitrary table/filter endpoints are exposed. Direct PostgREST writes remain unavailable to browser roles.
4. **Read-only preflight.** `backend/preflight.mjs` verifies key/URL binding formats, Supabase Auth connectivity and membership-table exposure through Data API using `limit=0`. No project records, people or user-content rows are read; it does not create any accounts or tables, and its output never prints credentials. It must run only after the user confirms the intended ORIGIN project and its costs.
5. **Fail-closed tests.** CI probes wrong roles, invalid JWTs, unauthorized Origins, unlinked citations, malicious markup, arbitrary images, inactive user access, read API role checks and preflight failures. PostgreSQL 17 tests for V11.5's RLS, audit and multi-person release gates continue.

Supabase documented that public-schema tables are **not automatically exposed via Data API on new projects**, with rollout enforced for existing projects on **October 30, 2026**. If a new ORIGIN project's secure backend cannot see its intended tables, check explicit API schema exposure and table GRANTs; do not disable RLS or grant broad anonymous access. See <https://supabase.com/changelog?types=breaking-change> and <https://supabase.com/docs/guides/api/securing-your-api>.

Supabase currently recommends `sb_publishable_...` and `sb_secret_...` keys; legacy `anon` and `service_role` JWT keys are being deprecated by the end of 2026. See <https://supabase.com/docs/guides/getting-started/api-keys>.

## API contract prepared (NOT LIVE)
```
GET  /v1/me                              current verified actor and role
GET  /v1/journeys                        bounded team journey list
GET  /v1/journeys/:id/revisions          bounded revision metadata
GET  /v1/revisions/:id                   selected content revision
POST /v1/journeys                        create (contributor/admin)
POST /v1/revisions                       append validated revision
POST /v1/revisions/:id/submit             submit for independent review
POST /v1/revisions/:id/review             independent reviewer/admin
POST /v1/revisions/:id/stage              distinct publisher/admin
```
Staging creates an internal release candidate only; **no API endpoint publicly publishes journeys**.

## Explicit future project setup — do NOT run against other apps
1. Ask the user which Supabase organization should own ORIGIN (the discovered option is `rayadinaveen98-ship-it's Org`), check the exact plan/project cost, and get approval of any nonzero charge.
2. Create a separate project named ORIGIN, region `ap-south-1` by default for Indian staff, only after the above approvals.
3. Apply the reviewed schema to the new project alone. Use a proper migration and verify every table's RLS, explicit permissions, functions' EXECUTE grants, and advisory notices. Existing connected projects remain unchanged.
4. Create an independent confidential Worker environment with secrets stored in deployment secrets manager. Publishable key can be exposed only as needed for Auth; never commit or expose the backend secret key. Do not deploy this worker from the existing static-site workflow.
5. Verify a real Supabase session, account offboarding, independent reviewer and publisher accounts, server membership, read access, source/asset editorial approval, password/MFA requirements and the end-to-end negative cases. Enable rate limits and audit alerts; no role assignments from browser-provided metadata.
6. Only then add login/cloud-sync UI and controlled publishing to the standalone Studio interface. Preserve public V10 until comprehensive user-device QA.

## Local and CI verification
```bash
node tests/v11-backend-api.mjs
node tests/v11-preflight.mjs
# CI additionally runs PostgreSQL 17 integration tests in disposable service container.
```

With real, approved project credentials already configured in a PRIVATE environment:
```bash
node backend/preflight.mjs
```
No credentials belong in public chat, markdown, commits, client bundles or screenshots.

## Remaining risks
The current backend is a safe foundation rather than a production-complete editorial platform. It lacks real Auth/account bootstrap, audited administrator onboarding, rate limiting, deployed secrets, media-license verification, secure reviewer identity controls/MFA and a signed public-release process. Schema validation checks content structure, **not the truth of the research**. Keep the publishing route disabled until these requirements are finished.
