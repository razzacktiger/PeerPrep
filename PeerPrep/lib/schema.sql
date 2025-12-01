-- ============================================================================
-- PEERPREP DATABASE SCHEMA
-- Review this file, make edits, then I'll execute it
-- ============================================================================

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------

-- Session status enum
CREATE TYPE session_status AS ENUM ('pending', 'active', 'completed', 'cancelled');

-- ----------------------------------------------------------------------------
-- TABLE 1: profiles
-- Extends Supabase auth.users with app-specific data
-- ----------------------------------------------------------------------------

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text NOT NULL,
  avatar_url text,
  bio text,
  streak_days integer DEFAULT 0,
  total_sessions integer DEFAULT 0,
  avg_peer_score numeric DEFAULT 0.0,
  preferred_topics text[] DEFAULT '{}',
  skills jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE profiles IS 'User profiles extending Supabase Auth';
COMMENT ON COLUMN profiles.id IS 'Links to auth.users(id)';
COMMENT ON COLUMN profiles.streak_days IS 'Consecutive days with sessions';
COMMENT ON COLUMN profiles.avg_peer_score IS 'Average of clarity/correctness/confidence ratings';

-- ----------------------------------------------------------------------------
-- TABLE 2: topics
-- Practice topics like Data Structures, Algorithms, etc.
-- ----------------------------------------------------------------------------

CREATE TABLE topics (
  id text PRIMARY KEY,  -- '1', '2', etc from constants.ts
  slug text NOT NULL UNIQUE,  -- 'data-structures', 'algorithms'
  name text NOT NULL,  -- 'Data Structures', 'Algorithms'
  description text,
  icon text,  -- emoji like '📊'
  difficulty_levels text[] DEFAULT '{}',  -- ['Easy', 'Medium', 'Hard']
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE topics IS 'Available practice topics';

-- ----------------------------------------------------------------------------
-- TABLE 3: sessions
-- Practice sessions between two users
-- 
-- LOGIC REVIEW NEEDED:
-- - topic_id: NULLABLE or NOT NULL? (I think NOT NULL - every session needs a topic)
-- - host_id: NULLABLE or NOT NULL? (I think NOT NULL - can't have session without users)
-- - guest_id: NULLABLE or NOT NULL? (I think NOT NULL for active sessions)
-- - host_id = user who initiated/scheduled the session
-- - guest_id = user who got matched or accepted invitation
-- ----------------------------------------------------------------------------

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id text NOT NULL REFERENCES topics(id),  -- CHANGED: NOT NULL (every session needs topic)
  host_id uuid NOT NULL REFERENCES profiles(id),  -- CHANGED: NOT NULL (session creator)
  guest_id uuid NOT NULL REFERENCES profiles(id),  -- CHANGED: NOT NULL (matched partner)
  question_id uuid,  -- NULLABLE: Phase 2 feature (practice_questions table)
  status session_status DEFAULT 'pending',
  scheduled_for timestamptz,  -- NULLABLE: only for scheduled sessions
  started_at timestamptz,  -- NULLABLE: set when session actually starts
  ended_at timestamptz,  -- NULLABLE: set when session ends
  duration_minutes integer DEFAULT 25,
  recording_enabled boolean DEFAULT false,
  recording_url text,  -- NULLABLE: Phase 3 feature
  transcript jsonb DEFAULT '[]',  -- NULLABLE: Phase 3 feature
  notes jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  
  -- Prevent users from matching with themselves
  CONSTRAINT different_users CHECK (host_id != guest_id)
);

COMMENT ON TABLE sessions IS 'Practice sessions between two users';
COMMENT ON COLUMN sessions.host_id IS 'User who initiated/created the session';
COMMENT ON COLUMN sessions.guest_id IS 'User who was matched or accepted invitation';
COMMENT ON COLUMN sessions.status IS 'pending=created, active=in progress, completed=finished, cancelled=aborted';

-- ----------------------------------------------------------------------------
-- TABLE 4: session_feedback
-- Peer ratings after each session (3 dimensions: clarity, correctness, confidence)
-- 
-- LOGIC REVIEW:
-- - Should from_id and to_id be NOT NULL? YES - feedback needs both parties
-- - Should clarity/correctness/confidence be NOT NULL? (I think YES for submitted feedback)
-- ----------------------------------------------------------------------------

CREATE TABLE session_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  from_id uuid NOT NULL REFERENCES profiles(id),  -- who gave the feedback
  to_id uuid NOT NULL REFERENCES profiles(id),  -- who received the feedback
  clarity smallint NOT NULL CHECK (clarity BETWEEN 1 AND 5),
  correctness smallint NOT NULL CHECK (correctness BETWEEN 1 AND 5),
  confidence smallint NOT NULL CHECK (confidence BETWEEN 1 AND 5),
  comments text,  -- NULLABLE: optional written feedback
  created_at timestamptz DEFAULT now(),
  
  -- Prevent self-feedback
  CONSTRAINT different_feedback_users CHECK (from_id != to_id),
  -- Prevent duplicate feedback (one feedback per user pair per session)
  CONSTRAINT unique_feedback UNIQUE (session_id, from_id, to_id)
);

COMMENT ON TABLE session_feedback IS 'Peer ratings after sessions';

-- ----------------------------------------------------------------------------
-- TABLE 5: ai_feedback
-- AI-generated feedback and fairness scoring (Phase 2+)
-- All fields nullable - optional feature
-- ----------------------------------------------------------------------------

CREATE TABLE ai_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  model_name text,
  fairness_score numeric CHECK (fairness_score BETWEEN 1 AND 10),
  summary text,
  strengths text[] DEFAULT '{}',
  improvements text[] DEFAULT '{}',
  prompt text,
  result jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  
  -- One AI feedback per session
  CONSTRAINT unique_ai_feedback UNIQUE (session_id)
);

COMMENT ON TABLE ai_feedback IS 'AI-generated feedback (Phase 2+)';

-- ----------------------------------------------------------------------------
-- TABLE 6: practice_questions
-- Question bank (AI-generated or curated) (Phase 2+)
-- Use constants.ts mock questions for Phase 1
-- ----------------------------------------------------------------------------

CREATE TABLE practice_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id text NOT NULL REFERENCES topics(id),
  title text NOT NULL,
  prompt text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  hints text[] DEFAULT '{}',
  ai_generated boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  cached_at timestamptz,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE practice_questions IS 'Question bank (Phase 2+)';

-- ----------------------------------------------------------------------------
-- TABLE 7: user_stats
-- Aggregated user statistics (Phase 2+)
-- Can calculate on-the-fly initially, store later for performance
-- ----------------------------------------------------------------------------

CREATE TABLE user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  total_sessions integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_session_date date,
  avg_clarity numeric DEFAULT 0.0,
  avg_correctness numeric DEFAULT 0.0,
  avg_confidence numeric DEFAULT 0.0,
  weekly_scores jsonb DEFAULT '[]',  -- [{date, score}, ...]
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE user_stats IS 'Aggregated user statistics (Phase 2+)';

-- ----------------------------------------------------------------------------
-- TABLE 8: matchmaking_queue
-- Users currently waiting to be matched
-- 
-- LOGIC REVIEW:
-- - Should profile_id be NOT NULL? YES - need to know who's waiting
-- - Should topic_id be NOT NULL? YES - need to match by topic
-- ----------------------------------------------------------------------------

CREATE TABLE matchmaking_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id text NOT NULL REFERENCES topics(id),
  difficulty text CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  preferences jsonb DEFAULT '{}',
  status text DEFAULT 'waiting',  -- 'waiting', 'matched', 'cancelled'
  created_at timestamptz DEFAULT now(),
  
  -- One queue entry per user (prevent duplicate joins)
  CONSTRAINT unique_user_in_queue UNIQUE (profile_id)
);

COMMENT ON TABLE matchmaking_queue IS 'Users waiting to be matched';

-- ----------------------------------------------------------------------------
-- TABLE 9: scheduled_sessions
-- Pre-scheduled sessions for specific times (Phase 2+)
-- ----------------------------------------------------------------------------

CREATE TABLE scheduled_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES profiles(id),
  topic_id text NOT NULL REFERENCES topics(id),
  scheduled_for timestamptz NOT NULL,
  partner_id uuid REFERENCES profiles(id),  -- NULLABLE: can schedule without partner
  session_id uuid REFERENCES sessions(id),  -- NULLABLE: linked when session created
  status text DEFAULT 'pending',  -- 'pending', 'confirmed', 'cancelled'
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE scheduled_sessions IS 'Pre-scheduled sessions (Phase 2+)';

-- ----------------------------------------------------------------------------
-- INDEXES for performance
-- ----------------------------------------------------------------------------

-- Profiles
CREATE INDEX idx_profiles_email ON profiles(email);

-- Sessions
CREATE INDEX idx_sessions_host ON sessions(host_id);
CREATE INDEX idx_sessions_guest ON sessions(guest_id);
CREATE INDEX idx_sessions_topic ON sessions(topic_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);

-- Feedback
CREATE INDEX idx_feedback_session ON session_feedback(session_id);
CREATE INDEX idx_feedback_from ON session_feedback(from_id);
CREATE INDEX idx_feedback_to ON session_feedback(to_id);

-- Queue
CREATE INDEX idx_queue_topic ON matchmaking_queue(topic_id);
CREATE INDEX idx_queue_status ON matchmaking_queue(status);
CREATE INDEX idx_queue_created ON matchmaking_queue(created_at);

-- Questions
CREATE INDEX idx_questions_topic ON practice_questions(topic_id);
CREATE INDEX idx_questions_difficulty ON practice_questions(difficulty);

-- ============================================================================
-- QUESTIONS FOR YOU TO REVIEW:
-- ============================================================================
-- 
-- 1. TABLE 3 (sessions):
--    - Is topic_id NOT NULL correct? (I think yes) approved
--    - Is host_id NOT NULL correct? (I think yes) approved
--    - Is guest_id NOT NULL correct? (I think yes) approved
--    - host_id = initiator, guest_id = matched partner - is this logic correct?
-- 
-- 2. TABLE 4 (session_feedback):
--    - Should ratings be NOT NULL? (I think yes - if submitting feedback, must provide ratings) approved
-- 
-- 3. TABLE 8 (matchmaking_queue):
--    - Is the UNIQUE constraint on profile_id correct? (prevents duplicate queue entries) approved
-- 
-- 4. General:
--    - Any fields should be NOT NULL that I made nullable?
--    - Any fields should be NULLABLE that I made NOT NULL?
-- 
-- ============================================================================
-- REVIEW COMPLETE? Reply with your changes or "approved"
-- ============================================================================

