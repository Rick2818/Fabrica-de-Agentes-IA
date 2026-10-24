CREATE TABLE jobs (
 id TEXT PRIMARY KEY NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('chat','task')),
 title TEXT NOT NULL,
 input TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'queued',
 result TEXT NOT NULL DEFAULT '',
 evidence TEXT NOT NULL DEFAULT '',
 error TEXT NOT NULL DEFAULT '',
 attempts INTEGER NOT NULL DEFAULT 0,
 due_at INTEGER NOT NULL,
 next_attempt_at INTEGER NOT NULL,
 lease_until INTEGER NOT NULL DEFAULT 0,
 lease_token TEXT NOT NULL DEFAULT '',
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX jobs_pending ON jobs(status,next_attempt_at,created_at);
--> statement-breakpoint
CREATE TABLE messages (
 id TEXT PRIMARY KEY NOT NULL,
 job_id TEXT NOT NULL,
 role TEXT NOT NULL,
 text TEXT NOT NULL,
 created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX messages_time ON messages(created_at,id);
--> statement-breakpoint
CREATE TABLE notes (
 title TEXT PRIMARY KEY NOT NULL,
 content TEXT NOT NULL,
 updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE runner_lock (id INTEGER PRIMARY KEY,token TEXT NOT NULL,expires INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE usage (id TEXT PRIMARY KEY NOT NULL,day TEXT NOT NULL,created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX usage_day ON usage(day);
--> statement-breakpoint
CREATE TABLE settings (key TEXT PRIMARY KEY NOT NULL,value TEXT NOT NULL);
