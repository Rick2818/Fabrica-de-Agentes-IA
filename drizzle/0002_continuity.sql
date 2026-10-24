CREATE TABLE agent_cycles (
 id TEXT PRIMARY KEY NOT NULL,
 cycle_id TEXT NOT NULL,
 schedule_id TEXT NOT NULL DEFAULT '',
 source TEXT NOT NULL,
 status TEXT NOT NULL,
 job_id TEXT,
 started_at INTEGER NOT NULL,
 completed_at INTEGER
);
--> statement-breakpoint
CREATE INDEX agent_cycles_time ON agent_cycles(started_at);
--> statement-breakpoint
CREATE TABLE notifications (
 id TEXT PRIMARY KEY NOT NULL,
 kind TEXT NOT NULL,
 title TEXT NOT NULL,
 message TEXT NOT NULL,
 target_id TEXT,
 created_at INTEGER NOT NULL,
 announced_at INTEGER,
 read_at INTEGER
);
--> statement-breakpoint
CREATE INDEX notifications_time ON notifications(created_at);
