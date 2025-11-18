-- supabase/migrations/001_initial_schema.sql
-- Initial schema for PeerPrep (profiles, topics, sessions, feedback, matchmaking queue)

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles (extend auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  bio text,
  skills jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Topics
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Session status enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'session_status') THEN
    CREATE TYPE session_status AS ENUM ('pending','active','completed','cancelled');
  END IF;
END $$;

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES topics(id) ON DELETE SET NULL,
  host_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  guest_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  scheduled_for timestamptz, -- for scheduled sessions
  started_at timestamptz,
  ended_at timestamptz,
  status session_status DEFAULT 'pending',
  transcript jsonb DEFAULT '[]'::jsonb,
  notes jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessions_topic_status ON sessions(topic_id, status);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at);

-- Session feedback (peer ratings)
CREATE TABLE IF NOT EXISTS session_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  from_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating smallint,
  comments text,
  created_at timestamptz DEFAULT now()
);

-- AI feedback
CREATE TABLE IF NOT EXISTS ai_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  model_name text,
  prompt text,
  result jsonb,
  created_at timestamptz DEFAULT now()
);

-- Matchmaking queue (temporary)
CREATE TABLE IF NOT EXISTS matchmaking_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_queue_topic_created_at ON matchmaking_queue(topic_id, created_at);

COMMIT;