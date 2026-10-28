-- ORIGIN V11.7 — dedicated Cloudflare D1 (SQLite), original draft source of truth.
-- Never apply to other apps/databases. Run via wrangler d1 migrations apply on ORIGIN only.
-- D1 is NOT public. Every query must run behind a signature-verified Cloudflare Access identity.
PRAGMA foreign_keys = ON;

CREATE TABLE origin_memberships (
 subject TEXT PRIMARY KEY NOT NULL CHECK(length(subject) BETWEEN 8 AND 255),
 email TEXT,
 role TEXT NOT NULL CHECK(role IN ('contributor','reviewer','publisher','admin')),
 active INTEGER NOT NULL DEFAULT 0 CHECK(active IN (0,1)),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE origin_journeys (
 id TEXT PRIMARY KEY NOT NULL,
 slug TEXT NOT NULL UNIQUE CHECK(length(slug) BETWEEN 2 AND 63),
 title TEXT NOT NULL CHECK(length(trim(title)) BETWEEN 2 AND 140),
 created_by TEXT NOT NULL REFERENCES origin_memberships(subject) ON DELETE RESTRICT,
 head_revision INTEGER NOT NULL DEFAULT 0 CHECK(head_revision >= 0),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE origin_revisions (
 id TEXT PRIMARY KEY NOT NULL,
 journey_id TEXT NOT NULL REFERENCES origin_journeys(id) ON DELETE RESTRICT,
 revision_no INTEGER NOT NULL CHECK(revision_no > 0),
 created_by TEXT NOT NULL REFERENCES origin_memberships(subject) ON DELETE RESTRICT,
 content TEXT NOT NULL CHECK(json_valid(content) AND length(content) BETWEEN 50 AND 300000),
 state TEXT NOT NULL DEFAULT 'draft' CHECK(state IN ('draft','submitted','approved','changes_requested')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 submitted_at TEXT,
 reviewed_at TEXT,
 UNIQUE(journey_id,revision_no)
);

CREATE TABLE origin_review_decisions (
 id TEXT PRIMARY KEY NOT NULL,
 revision_id TEXT NOT NULL UNIQUE REFERENCES origin_revisions(id) ON DELETE RESTRICT,
 reviewer_subject TEXT NOT NULL REFERENCES origin_memberships(subject) ON DELETE RESTRICT,
 decision TEXT NOT NULL CHECK(decision IN ('approve','request_changes')),
 explanation TEXT NOT NULL CHECK(length(trim(explanation)) BETWEEN 20 AND 2000),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE origin_release_candidates (
 id TEXT PRIMARY KEY NOT NULL,
 revision_id TEXT NOT NULL UNIQUE REFERENCES origin_revisions(id) ON DELETE RESTRICT,
 journey_id TEXT NOT NULL REFERENCES origin_journeys(id) ON DELETE RESTRICT,
 staged_by TEXT NOT NULL REFERENCES origin_memberships(subject) ON DELETE RESTRICT,
 state TEXT NOT NULL DEFAULT 'awaiting_external_build' CHECK(state='awaiting_external_build'),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE origin_audit_events (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 journey_id TEXT REFERENCES origin_journeys(id) ON DELETE RESTRICT,
 revision_id TEXT REFERENCES origin_revisions(id) ON DELETE RESTRICT,
 actor_subject TEXT NOT NULL REFERENCES origin_memberships(subject) ON DELETE RESTRICT,
 event_name TEXT NOT NULL CHECK(event_name IN (
   'journey_created','revision_appended','revision_submitted',
   'review_approved','changes_requested','candidate_staged'
 )),
 metadata TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(metadata)),
 occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX origin_journeys_owner_idx ON origin_journeys(created_by);
CREATE INDEX origin_revisions_journey_idx ON origin_revisions(journey_id,revision_no DESC);
CREATE INDEX origin_audit_journey_idx ON origin_audit_events(journey_id,id DESC);
CREATE INDEX origin_candidates_journey_idx ON origin_release_candidates(journey_id);

-- Atomic revision numbering (insert runs before head_revision UPDATE in one D1.batch transaction).
CREATE TRIGGER origin_revision_sequence BEFORE INSERT ON origin_revisions
BEGIN
 SELECT CASE WHEN (
   SELECT head_revision + 1 FROM origin_journeys WHERE id=NEW.journey_id
 ) IS NOT NEW.revision_no THEN RAISE(ABORT,'revision_head_conflict') END;
END;

-- Draft contents and provenance cannot be changed through normal D1 writes.
CREATE TRIGGER origin_revision_immutable BEFORE UPDATE ON origin_revisions
BEGIN
 SELECT CASE WHEN
   NEW.id IS NOT OLD.id OR NEW.journey_id IS NOT OLD.journey_id OR
   NEW.revision_no IS NOT OLD.revision_no OR NEW.content IS NOT OLD.content OR
   NEW.created_by IS NOT OLD.created_by OR NEW.created_at IS NOT OLD.created_at
 THEN RAISE(ABORT,'immutable_revision') END;
 SELECT CASE WHEN NOT (
   (NEW.state=OLD.state) OR
   (OLD.state='draft' AND NEW.state='submitted') OR
   (OLD.state='submitted' AND NEW.state IN ('approved','changes_requested'))
 ) THEN RAISE(ABORT,'invalid_revision_transition') END;
END;

CREATE TRIGGER origin_audit_no_update BEFORE UPDATE ON origin_audit_events
BEGIN SELECT RAISE(ABORT,'immutable_audit'); END;
CREATE TRIGGER origin_audit_no_delete BEFORE DELETE ON origin_audit_events
BEGIN SELECT RAISE(ABORT,'immutable_audit'); END;
CREATE TRIGGER origin_reviews_no_update BEFORE UPDATE ON origin_review_decisions
BEGIN SELECT RAISE(ABORT,'immutable_review'); END;
CREATE TRIGGER origin_reviews_no_delete BEFORE DELETE ON origin_review_decisions
BEGIN SELECT RAISE(ABORT,'immutable_review'); END;

-- State-machine guards also enforced at the DB layer.
CREATE TRIGGER origin_revision_submit_gate BEFORE UPDATE OF state ON origin_revisions
WHEN NEW.state='submitted' AND OLD.state='draft'
BEGIN
 SELECT CASE WHEN NEW.revision_no <> (
  SELECT head_revision FROM origin_journeys WHERE id=NEW.journey_id
 ) THEN RAISE(ABORT,'stale_revision') END;
END;
CREATE TRIGGER origin_approval_gate BEFORE UPDATE OF state ON origin_revisions
WHEN NEW.state='approved' AND OLD.state='submitted'
BEGIN
 SELECT CASE WHEN NEW.revision_no <> (
   SELECT head_revision FROM origin_journeys WHERE id=NEW.journey_id
 ) THEN RAISE(ABORT,'stale_revision') END;
 SELECT CASE WHEN NOT EXISTS (
  SELECT 1 FROM origin_review_decisions
  WHERE revision_id=NEW.id AND decision='approve'
    AND reviewer_subject <> NEW.created_by
 ) THEN RAISE(ABORT,'independent_review_required') END;
END;

-- Prevent direct candidate creation without fresh independent approval.
CREATE TRIGGER origin_candidate_gate BEFORE INSERT ON origin_release_candidates
BEGIN
 SELECT CASE WHEN NOT EXISTS (
  SELECT 1 FROM origin_revisions r
  JOIN origin_journeys j ON j.id=r.journey_id
  JOIN origin_review_decisions d ON d.revision_id=r.id
  WHERE r.id=NEW.revision_id AND r.journey_id=NEW.journey_id
    AND r.state='approved' AND r.revision_no=j.head_revision
    AND d.decision='approve'
    AND d.reviewer_subject <> r.created_by
    AND NEW.staged_by <> r.created_by
    AND NEW.staged_by <> d.reviewer_subject
 ) THEN RAISE(ABORT,'independent_release_required') END;
END;
