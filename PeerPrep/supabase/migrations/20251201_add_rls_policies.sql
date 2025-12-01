-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- Enable RLS and create policies for all tables
-- ============================================================================

-- ----------------------------------------------------------------------------
-- SESSIONS TABLE POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS on sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own sessions
CREATE POLICY "Users can view their own sessions"
ON public.sessions
FOR SELECT
TO authenticated
USING (
  auth.uid() = host_id OR auth.uid() = guest_id
);

-- Policy: Users can update their own sessions (for ending sessions, updating code/notes)
CREATE POLICY "Users can update their own sessions"
ON public.sessions
FOR UPDATE
TO authenticated
USING (
  auth.uid() = host_id OR auth.uid() = guest_id
)
WITH CHECK (
  auth.uid() = host_id OR auth.uid() = guest_id
);

-- Policy: System can insert sessions (via Edge Function with service role)
-- No policy needed for INSERT as it's done by Edge Function with service_role key

-- ----------------------------------------------------------------------------
-- MATCHMAKING_QUEUE TABLE POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS on matchmaking_queue
ALTER TABLE public.matchmaking_queue ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own queue entries
CREATE POLICY "Users can view their own queue entries"
ON public.matchmaking_queue
FOR SELECT
TO authenticated
USING (
  auth.uid() = profile_id
);

-- Policy: Users can insert their own queue entries
CREATE POLICY "Users can insert their own queue entries"
ON public.matchmaking_queue
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = profile_id
);

-- Policy: Users can delete their own queue entries
CREATE POLICY "Users can delete their own queue entries"
ON public.matchmaking_queue
FOR DELETE
TO authenticated
USING (
  auth.uid() = profile_id
);

-- ----------------------------------------------------------------------------
-- PROFILES TABLE POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all profiles (for partner info)
CREATE POLICY "Users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id
)
WITH CHECK (
  auth.uid() = id
);

-- ----------------------------------------------------------------------------
-- TOPICS TABLE POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS on topics
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view topics
CREATE POLICY "Everyone can view topics"
ON public.topics
FOR SELECT
TO authenticated, anon
USING (true);

-- ----------------------------------------------------------------------------
-- SESSION_MESSAGES TABLE POLICIES (for real-time chat)
-- ----------------------------------------------------------------------------

-- Enable RLS on session_messages
ALTER TABLE public.session_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages from their sessions
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

-- Policy: Users can insert messages into their sessions
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

COMMENT ON POLICY "Users can view their own sessions" ON public.sessions IS 'Allow users to view sessions they are part of';
COMMENT ON POLICY "Users can update their own sessions" ON public.sessions IS 'Allow users to update sessions they are part of (end session, update code/notes)';

