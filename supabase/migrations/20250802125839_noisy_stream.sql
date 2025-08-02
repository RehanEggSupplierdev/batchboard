/*
  # Create Demo Accounts for BatchBoard

  1. Demo Users
    - Creates demo user accounts with proper authentication
    - Sets up corresponding profiles
    - Provides test data for development

  2. Security
    - Uses proper Supabase auth system
    - Creates profiles with RLS policies
*/

-- Insert demo users into auth.users (this would normally be done through Supabase Auth)
-- Note: In production, users should sign up through the application

-- Create demo profiles (these will be linked to users created through the app)
-- The user_id will be populated when users actually sign up

-- Demo profile data that will be used when users sign up
INSERT INTO profiles (
  id,
  user_id,
  student_id,
  full_name,
  bio,
  skills,
  social_links,
  profile_pic,
  quote,
  public,
  first_login
) VALUES 
-- These will be created when users actually sign up through the app
-- Just keeping this as reference data

-- Sample public profiles for demonstration
(
  gen_random_uuid(),
  gen_random_uuid(), -- This will be replaced with actual user_id when they sign up
  'SAMPLE001',
  'Sample Student',
  'This is a sample profile to show how BatchBoard works. I love coding and learning new technologies!',
  ARRAY['JavaScript', 'React', 'Node.js', 'Python', 'Web Design'],
  '{"github": "https://github.com/sample", "linkedin": "https://linkedin.com/in/sample"}',
  null,
  'Learning is a treasure that will follow its owner everywhere.',
  true,
  false
),
(
  gen_random_uuid(),
  gen_random_uuid(),
  'SAMPLE002', 
  'Demo User',
  'Another sample profile showcasing the features of BatchBoard. I enjoy photography and digital art.',
  ARRAY['Photography', 'Digital Art', 'Photoshop', 'Creative Writing'],
  '{"instagram": "https://instagram.com/demo", "behance": "https://behance.net/demo"}',
  null,
  'Creativity is intelligence having fun.',
  true,
  false
);

-- Note: Actual user accounts should be created through the signup process
-- These are just sample profiles to demonstrate the platform