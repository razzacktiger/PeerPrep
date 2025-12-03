-- ============================================================================
-- SESSION MESSAGES TABLE (Real-time Chat)
-- Run this FIFTH after 04_seed_topics.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: session_messages
-- In-session chat messages between users
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS session_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE session_messages IS 'Real-time chat messages within sessions';

-- Index for efficient message retrieval
CREATE INDEX IF NOT EXISTS idx_session_messages_session ON session_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_session_messages_created ON session_messages(created_at);

-- ----------------------------------------------------------------------------
-- RLS POLICIES for session_messages
-- ----------------------------------------------------------------------------

ALTER TABLE public.session_messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages from their sessions
CREATE POLICY "Users can view messages from their sessions"
ON public.session_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.sessions
    WHERE id = session_id
    AND (host_id = auth.uid() OR guest_id = auth.uid())
  )
);

-- Users can insert messages into their sessions
CREATE POLICY "Users can insert messages into their sessions"
ON public.session_messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.sessions
    WHERE id = session_id
    AND (host_id = auth.uid() OR guest_id = auth.uid())
  )
);

-- ============================================================================
-- SESSION MESSAGES COMPLETE
-- Next: Run 06_realtime_columns.sql
-- ============================================================================

