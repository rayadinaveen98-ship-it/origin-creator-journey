# ORIGIN V11.4 — Editorial Review & Local Checkpoint Foundation

## What this version adds
V11.4 extends the working local Creator Studio with a practical pre-publishing **handoff checklist**, evidence notes, stale-review detection and a compact local checkpoint history. It is deliberately **not** an authenticated CMS, legal rights registry, independent editor approval system, or publishing backend.

### Editorial controls
1. Every research source has a review status (unreviewed / checked / needs work) and a written explanation.
2. Every scene has a factual review status (unreviewed / fact-reviewed / needs work) and an explanation.
3. Every scene also receives a visual provenance declaration. The only status that counts toward the local handoff checklist is **original-only** (CSS illustration, no third-party media). The statuses for evidence recorded and permission needed are informational; they do not imply legal clearance.
4. The overall **self-attested handoff** checklist requires valid source citations, reviewed sources, reviewed scenes, and original-visual declarations for every scene.
5. Reviewing an item records a content fingerprint. If scene text, its source, attribution, references or media-rights note changes, the previous review no longer counts. This fingerprint is an accidental-change detection signal, **not** a tamper-proof signature.
6. The handoff report can be downloaded as `origin-editorial-review-packet-v1.json`, containing the draft, review notes, status, counts and outstanding issues. It is an export file, not a publishing token, approval, or verified certificate.

### Local history
The editor can create up to **six manual checkpoints**, each capturing the current draft and local review metadata. The user can restore a checkpoint after confirmation. All records stay in browser `localStorage` and can be lost when the browser data is cleared or the user switches devices. Browser checkpoints are not immutable, signed, multi-user or a reliable audit trail. The regular JSON draft export remains available.

### Current security boundary
The Studio URL is available on the public Cloudflare website. Anyone who opens that URL can use a separate local copy, without access to another visitor's local storage. **It does not verify who is acting as editor/reviewer, does not host private content, and cannot publish.** Enter only non-confidential research materials, and do not mistake the handoff checklist for legal or historical signoff.

The V10 Ray journey and V11 Ray/Kurosawa player remain unchanged. The local Studio preview still uses the same `/v11/?person=studio-local&draft=1` renderer.

### Tested invariants
- A structurally valid draft with citations is *not* automatically handoff-ready.
- A source must be checked with a note, a scene fact-reviewed with a note, and its original graphic declared with a note.
- Changes to a cited source invalidate both the source review and dependent scene approvals.
- Source and scene IDs are scoped by chapter to prevent collisions in the review store.
- Checkpoints can be restored, but exact duplicates are rejected and history is capped to six entries.
- Review packets explicitly report self-attested status and cannot authorize publication.
- Existing browser/viewport checks and immutable V10 regression tests continue passing.

### Next actual production infrastructure
**Do not turn on a public Publish button yet.** That would require a real server-side login and permission system with separated contributor/editor/approver roles; server-owned draft revision IDs and immutable audit events; controlled approved-image licenses and legal evidence; independently verified references and conflicts of interest; and a signed publishing/deployment workflow that rejects stale/unapproved revisions. Role enforcement must happen on the server, not in editable browser JavaScript. Provisioning a backend and deciding who may authorize publication remains an uncompleted step.
