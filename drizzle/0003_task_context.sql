ALTER TABLE jobs ADD COLUMN context_mode TEXT NOT NULL DEFAULT 'saved' CHECK(context_mode IN ('saved','isolated'));
