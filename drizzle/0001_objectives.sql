ALTER TABLE jobs ADD COLUMN objective_id TEXT;
--> statement-breakpoint
ALTER TABLE jobs ADD COLUMN phase TEXT;
--> statement-breakpoint
ALTER TABLE jobs ADD COLUMN objective_version INTEGER NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE jobs ADD COLUMN step_index INTEGER NOT NULL DEFAULT 0;
--> statement-breakpoint
CREATE TABLE objectives (
 id TEXT PRIMARY KEY NOT NULL,
 title TEXT NOT NULL,
 description TEXT NOT NULL,
 criteria TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'planning',
 version INTEGER NOT NULL DEFAULT 1,
 plan TEXT NOT NULL DEFAULT '[]',
 step_index INTEGER NOT NULL DEFAULT 0,
 revision INTEGER NOT NULL DEFAULT 0,
 api_calls INTEGER NOT NULL DEFAULT 0,
 result TEXT NOT NULL DEFAULT '',
 review TEXT NOT NULL DEFAULT '',
 error TEXT NOT NULL DEFAULT '',
 paused_from TEXT NOT NULL DEFAULT '',
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE objective_updates (
 id TEXT PRIMARY KEY NOT NULL,
 objective_id TEXT NOT NULL,
 type TEXT NOT NULL,
 message TEXT NOT NULL,
 notified INTEGER NOT NULL DEFAULT 0,
 created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX objective_jobs ON jobs(objective_id,objective_version,phase,step_index);
