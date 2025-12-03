-- ============================================================================
-- ADDITIONAL COLUMNS FOR REAL-TIME SYNC
-- Run this SIXTH after 05_session_messages.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Add columns for real-time code and notes sync
-- ----------------------------------------------------------------------------

-- Add code column for collaborative code editor
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS code text DEFAULT '';

-- Add shared_notes column for collaborative notes
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS shared_notes text DEFAULT '';

-- ----------------------------------------------------------------------------
-- ENABLE REALTIME
-- Go to Supabase Dashboard > Database > Replication
-- Enable realtime for these tables:
-- - sessions (for code/notes/status sync)
-- - session_messages (for chat)
-- - matchmaking_queue (for queue updates)
-- ----------------------------------------------------------------------------

-- Alternatively, enable via SQL (requires superuser):
-- ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE session_messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE matchmaking_queue;

-- Note: It's easier to enable via the Supabase Dashboard GUI

-- ============================================================================
-- REALTIME COLUMNS COMPLETE
-- 
-- IMPORTANT: After running all SQL scripts, you must:
-- 1. Go to Supabase Dashboard > Database > Replication
-- 2. Enable realtime for: sessions, session_messages, matchmaking_queue
-- ============================================================================

