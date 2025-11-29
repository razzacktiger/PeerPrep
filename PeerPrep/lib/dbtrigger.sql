-- STEP 1: Create a function that creates the profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    streak_days,
    total_sessions,
    avg_peer_score
  ) VALUES (
    NEW.id,                                    -- auth user's ID
    NEW.email,                                  -- auth user's email
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email), -- name from metadata or email
    'https://ui-avatars.com/api/?name=' || 
      COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email), -- avatar URL
    0,                                          -- default streak
    0,                                          -- default sessions
    0.0                                         -- default score
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 2: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();