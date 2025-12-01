-- Add real-time collaboration columns to sessions table
ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS code text DEFAULT '// Write your solution here\n\nfunction twoSum(nums, target) {\n    \n}',
ADD COLUMN IF NOT EXISTS shared_notes text DEFAULT '';

-- Create session_messages table for in-session chat
CREATE TABLE IF NOT EXISTS session_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Index for fast message retrieval
CREATE INDEX IF NOT EXISTS idx_session_messages_session_id ON session_messages(session_id, created_at);

-- Enable Row Level Security
ALTER TABLE session_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read messages from their sessions
CREATE POLICY "Users can read messages from their sessions"
ON session_messages FOR SELECT
USING (
  session_id IN (
    SELECT id FROM sessions 
    WHERE host_id = auth.uid() OR guest_id = auth.uid()
  )
);

-- RLS Policy: Users can insert messages to their sessions
CREATE POLICY "Users can insert messages to their sessions"
ON session_messages FOR INSERT
WITH CHECK (
  session_id IN (
    SELECT id FROM sessions 
    WHERE host_id = auth.uid() OR guest_id = auth.uid()
  )
  AND sender_id = auth.uid()
);

-- Enable Realtime for sessions table (code/notes sync)
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;

-- Enable Realtime for session_messages table (chat)
ALTER PUBLICATION supabase_realtime ADD TABLE session_messages;

