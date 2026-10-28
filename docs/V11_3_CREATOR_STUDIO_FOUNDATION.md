# ORIGIN V11.3 — Creator Studio Foundation

## What shipped
A **local-only editorial sandbox** at `/v11/studio/`, built on the existing V11 journey engine. It is intentionally *not* a remotely managed content management system, and not a private web application. The URL is on the publicly accessible Cloudflare site; do **not** enter confidential data, personal records or unreleased proprietary archival material.

The objective is to demonstrate that a third creator can be authored, previewed and exported without adding developer-authored biography modules.

### Editable content
- Profile: creator, subtitle, role, time period, cultural setting.
- Cinematic identity: four validated colors, typography, composition, pacing and a signature line.
- Chapters: names, periods, ordered story moments.
- Per-chapter research sources: title and HTTPS URL.
- Per-scene sources: explicit citations referencing declared source IDs.
- Story scenes: date, place, title, factual narrative, documented context, interpretation, original-visual disclaimer and reusable visual template.
- Image-rights review status and evidence notes. **No media upload/hosting or user image playback is implemented.**
- Add, duplicate or delete scenes and chapters; edit source lists; form-based revisions.
- Local autosave to `origin_v11_studio_local_draft_v1`, download JSON export and import JSON. No server data transfer or accounts.
- Structural and provenance checks (all scenes need references; no unauthorized URLs, arbitrary HTML/CSS or unsupported visual styles), with an original illustration fallback.
- Click **Preview cinematic journey** to render in the **existing** V11 player via `/v11/?person=studio-local&draft=1` (browser-local only).

### Data pipeline
`www/v11/studio/schema.js` contains a reusable `schemaVersion:1` contract and a constrained compiler from creator draft to `registerCreator` + `registerAct`. Source IDs are mapped to per-act source-index arrays. No scene content is executed as JavaScript.

`www/v11/studio/editor.js` creates editor form controls using DOM APIs and assigns content to form values or `textContent`. Imported JSON is copied into a fixed document shape; it is not injected as HTML. `www/v11/studio/preview.js` registers the local draft only if **both** `draft=1` and `person=studio-local` are supplied. A fresh browser context cannot access another browser's draft.

### Example journey
The optional **Load research example** button inserts a single scene about Satyajit Ray's documented birth, with an archive biography citation. This is a demonstrator, not a replacement for the 87-scene Ray experience and not a new complete biography. The default document is deliberately blank and cannot be previewed until its research and narrative fields are complete.

### Safety and limitations
- There is no account authentication or private backend. A publicly accessible URL is **not** access control.
- Drafts can disappear if browser data is cleared, private mode closes, or a device is lost. Use **Export JSON** regularly. No cross-device or cloud sync.
- The editor allows only public HTTPS research source links. This is basic structural checking, not proof a source is authoritative or historically correct.
- `cleared` image-rights status is an editor-entered assertion, **not** rights verification. No uploaded external images appear in previews.
- Structural QA is **not editorial approval**. There is no publishing button, review queue, moderation, revision history, legal signoff, shared team workflow or production database.
- The V11 shared engine remains an early original-art preview. Preserve the handcrafted V10 Ray viewer and all existing legacy routes.

### Quality gates
- `node scripts/verify-v10.mjs` guards frozen routes/opening.
- `node scripts/verify-v11.mjs` guards all 87 Ray scene objects, the Kurosawa preview, reusable visual/identity code.
- `node scripts/verify-v11-studio.mjs` tests draft compilation, source linkage, unsafe URLs/markup, image-rights evidence, payload limits and the no-publish boundary.
- `node tests/v11-browser.mjs` tests established player continuity and mobile rendering.
- `node tests/v11-studio-browser.mjs` tests blank-draft errors, sample preview through shared engine, JSON import/export, autosave, add/edit scenes, separate browser isolation, hostile imported text and 320px mobile.
- Cloudflare deploy QA verifies distinct actual editor, schema, CSS and preview assets on the live Worker.

### Next steps (not yet shipped)
1. Add an authenticated, permissioned Studio with owner/editor/reviewer roles and server-side validation.
2. Add editorial checklists, provenance categories, uncertainty markers, editorial approvals, audit history and revision/version control.
3. Add a licensed asset register with evidence of rights and limited-use terms.
4. Add real draft publishing via reviewed, signed static journey packages or a reliable CMS backend, followed by deployment and rollback.
5. Prove end-to-end authoring of an additional full creator journey without manually creating code for scenes.
