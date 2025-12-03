-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- Run this SECOND after 01_schema.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PROFILES TABLE POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles (needed for partner info)
CREATE POLICY "Users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Users can insert their own profile (for signup)
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- TOPICS TABLE POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- Everyone can view topics
CREATE POLICY "Everyone can view topics"
ON public.topics
FOR SELECT
TO authenticated, anon
USING (true);

-- ----------------------------------------------------------------------------
-- SESSIONS TABLE POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own sessions
CREATE POLICY "Users can view their own sessions"
ON public.sessions
FOR SELECT
TO authenticated
USING (auth.uid() = host_id OR auth.uid() = guest_id);

-- Users can update their own sessions
CREATE POLICY "Users can update their own sessions"
ON public.sessions
FOR UPDATE
TO authenticated
USING (auth.uid() = host_id OR auth.uid() = guest_id)
WITH CHECK (auth.uid() = host_id OR auth.uid() = guest_id);

-- Note: INSERT is done via Edge Function with service_role key

-- ----------------------------------------------------------------------------
-- MATCHMAKING_QUEUE TABLE POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE public.matchmaking_queue ENABLE ROW LEVEL SECURITY;

-- Users can view their own queue entries
CREATE POLICY "Users can view their own queue entries"
ON public.matchmaking_queue
FOR SELECT
TO authenticated
USING (auth.uid() = profile_id);

-- Users can insert their own queue entries
CREATE POLICY "Users can insert their own queue entries"
ON public.matchmaking_queue
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = profile_id);

-- Users can delete their own queue entries
CREATE POLICY "Users can delete their own queue entries"
ON public.matchmaking_queue
FOR DELETE
TO authenticated
USING (auth.uid() = profile_id);

-- ----------------------------------------------------------------------------
-- SESSION_FEEDBACK TABLE POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE public.session_feedback ENABLE ROW LEVEL SECURITY;

-- Users can view feedback they gave or received
CREATE POLICY "Users can view their feedback"
ON public.session_feedback
FOR SELECT
TO authenticated
USING (auth.uid() = from_id OR auth.uid() = to_id);

-- Users can insert feedback for sessions they participated in
CREATE POLICY "Users can insert feedback"
ON public.session_feedback
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = from_id
  AND EXISTS (
    SELECT 1 FROM public.sessions
    WHERE id = session_id
    AND (host_id = auth.uid() OR guest_id = auth.uid())
  )
);

-- ----------------------------------------------------------------------------
-- AI_FEEDBACK TABLE POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;

-- Users can view AI feedback for their sessions
CREATE POLICY "Users can view AI feedback for their sessions"
ON public.ai_feedback
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.sessions
    WHERE id = session_id
    AND (host_id = auth.uid() OR guest_id = auth.uid())
  )
);

-- ----------------------------------------------------------------------------
-- PRACTICE_QUESTIONS TABLE POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;

-- Everyone can view questions
CREATE POLICY "Everyone can view questions"
ON public.practice_questions
FOR SELECT
TO authenticated
USING (true);

-- ----------------------------------------------------------------------------
-- USER_STATS TABLE POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Users can view their own stats
CREATE POLICY "Users can view their own stats"
ON public.user_stats
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own stats
CREATE POLICY "Users can update their own stats"
ON public.user_stats
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- SCHEDULED_SESSIONS TABLE POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE public.scheduled_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view scheduled sessions they're part of
CREATE POLICY "Users can view their scheduled sessions"
ON public.scheduled_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = creator_id OR auth.uid() = partner_id);

-- Users can create scheduled sessions
CREATE POLICY "Users can create scheduled sessions"
ON public.scheduled_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);

-- Users can update their scheduled sessions
CREATE POLICY "Users can update their scheduled sessions"
ON public.scheduled_sessions
FOR UPDATE
TO authenticated
USING (auth.uid() = creator_id OR auth.uid() = partner_id);

-- ============================================================================
-- RLS POLICIES COMPLETE
-- Next: Run 03_triggers.sql
-- ============================================================================

