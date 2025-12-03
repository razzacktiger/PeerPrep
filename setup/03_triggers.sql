-- ============================================================================
-- DATABASE TRIGGERS
-- Run this THIRD after 02_rls_policies.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TRIGGER: Auto-create profile on user signup
-- When a user signs up via Supabase Auth, automatically create their profile
-- ----------------------------------------------------------------------------

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- TRIGGER: Update profile updated_at timestamp
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ----------------------------------------------------------------------------
-- TRIGGER: Update user stats updated_at timestamp
-- ----------------------------------------------------------------------------

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- TRIGGERS COMPLETE
-- Next: Run 04_seed_topics.sql
-- ============================================================================

