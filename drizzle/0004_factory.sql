CREATE TABLE factory_orders (
 id TEXT PRIMARY KEY, customer_id TEXT NOT NULL, payload TEXT NOT NULL, payload_hash TEXT NOT NULL,
 status TEXT NOT NULL, attempt INTEGER NOT NULL DEFAULT 0, failures INTEGER NOT NULL DEFAULT 0, max_attempts INTEGER NOT NULL DEFAULT 3,
 next_attempt_at INTEGER NOT NULL DEFAULT 0, lease TEXT, lease_until INTEGER NOT NULL DEFAULT 0,
 agent TEXT, report TEXT, access TEXT, delivery TEXT, error_code TEXT,
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX factory_orders_queue ON factory_orders(status,next_attempt_at,lease_until);
--> statement-breakpoint
CREATE TABLE factory_events (
 id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES factory_orders(id),
 stage TEXT NOT NULL, outcome TEXT NOT NULL, detail TEXT NOT NULL, created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX factory_events_order ON factory_events(order_id,created_at);
--> statement-breakpoint
CREATE TABLE factory_memberships (
 user_id TEXT NOT NULL, customer_id TEXT NOT NULL, created_at INTEGER NOT NULL,
 PRIMARY KEY(user_id,customer_id)
);
