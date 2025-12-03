-- ============================================================================
-- SEED DATA: Topics
-- Run this FOURTH after 03_triggers.sql
-- ============================================================================

-- Insert practice topics (must match constants.ts TOPICS array)
INSERT INTO topics (id, slug, name, description, icon, difficulty_levels) VALUES
  ('1', 'data-structures', 'Data Structures', 'Arrays, Linked Lists, Trees, Graphs', '📊', ARRAY['Easy', 'Medium', 'Hard']),
  ('2', 'algorithms', 'Algorithms', 'Sorting, Searching, Dynamic Programming', '🧮', ARRAY['Easy', 'Medium', 'Hard']),
  ('3', 'system-design', 'System Design', 'Scalability, Architecture, Distributed Systems', '🏗️', ARRAY['Medium', 'Hard']),
  ('4', 'behavioral', 'Behavioral', 'STAR method, Leadership, Conflict Resolution', '💬', ARRAY['Easy', 'Medium']),
  ('5', 'oop-design', 'Object-Oriented Design', 'Classes, Inheritance, Design Patterns', '🎨', ARRAY['Medium', 'Hard']),
  ('6', 'database-design', 'Database Design', 'SQL, NoSQL, Normalization, Indexing', '🗄️', ARRAY['Easy', 'Medium', 'Hard'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  difficulty_levels = EXCLUDED.difficulty_levels;

-- Verify topics were inserted
SELECT id, name, icon FROM topics ORDER BY id;

-- ============================================================================
-- SEED DATA COMPLETE
-- Next: Run 05_session_messages.sql
-- ============================================================================

