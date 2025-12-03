-- ============================================================================
-- PEERPREP DATABASE SCHEMA
-- Run this FIRST in Supabase SQL Editor
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
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  icon text,
  difficulty_levels text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE topics IS 'Available practice topics';

-- ----------------------------------------------------------------------------
-- TABLE 3: sessions
-- Practice sessions between two users
-- ----------------------------------------------------------------------------

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id text NOT NULL REFERENCES topics(id),
  host_id uuid NOT NULL REFERENCES profiles(id),
  guest_id uuid NOT NULL REFERENCES profiles(id),
  question_id uuid,
  status session_status DEFAULT 'pending',
  scheduled_for timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  duration_minutes integer DEFAULT 25,
  recording_enabled boolean DEFAULT false,
  recording_url text,
  transcript jsonb DEFAULT '[]',
  notes jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT different_users CHECK (host_id != guest_id)
);

COMMENT ON TABLE sessions IS 'Practice sessions between two users';
COMMENT ON COLUMN sessions.host_id IS 'User who initiated/created the session';
COMMENT ON COLUMN sessions.guest_id IS 'User who was matched or accepted invitation';
COMMENT ON COLUMN sessions.status IS 'pending=created, active=in progress, completed=finished, cancelled=aborted';

-- ----------------------------------------------------------------------------
-- TABLE 4: session_feedback
-- Peer ratings after each session
-- ----------------------------------------------------------------------------

CREATE TABLE session_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  from_id uuid NOT NULL REFERENCES profiles(id),
  to_id uuid NOT NULL REFERENCES profiles(id),
  clarity smallint NOT NULL CHECK (clarity BETWEEN 1 AND 5),
  correctness smallint NOT NULL CHECK (correctness BETWEEN 1 AND 5),
  confidence smallint NOT NULL CHECK (confidence BETWEEN 1 AND 5),
  comments text,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT different_feedback_users CHECK (from_id != to_id),
  CONSTRAINT unique_feedback UNIQUE (session_id, from_id, to_id)
);

COMMENT ON TABLE session_feedback IS 'Peer ratings after sessions';

-- ----------------------------------------------------------------------------
-- TABLE 5: ai_feedback (Phase 2+)
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
  
  CONSTRAINT unique_ai_feedback UNIQUE (session_id)
);

COMMENT ON TABLE ai_feedback IS 'AI-generated feedback (Phase 2+)';

-- ----------------------------------------------------------------------------
-- TABLE 6: practice_questions (Phase 2+)
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
-- TABLE 7: user_stats (Phase 2+)
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
  weekly_scores jsonb DEFAULT '[]',
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE user_stats IS 'Aggregated user statistics (Phase 2+)';

-- ----------------------------------------------------------------------------
-- TABLE 8: matchmaking_queue
-- Users currently waiting to be matched
-- ----------------------------------------------------------------------------

CREATE TABLE matchmaking_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id text NOT NULL REFERENCES topics(id),
  difficulty text CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  preferences jsonb DEFAULT '{}',
  status text DEFAULT 'waiting',
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_user_in_queue UNIQUE (profile_id)
);

COMMENT ON TABLE matchmaking_queue IS 'Users waiting to be matched';

-- ----------------------------------------------------------------------------
-- TABLE 9: scheduled_sessions (Phase 2+)
-- ----------------------------------------------------------------------------

CREATE TABLE scheduled_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES profiles(id),
  topic_id text NOT NULL REFERENCES topics(id),
  scheduled_for timestamptz NOT NULL,
  partner_id uuid REFERENCES profiles(id),
  session_id uuid REFERENCES sessions(id),
  status text DEFAULT 'pending',
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
-- SCHEMA COMPLETE
-- Next: Run 02_rls_policies.sql
-- ============================================================================

