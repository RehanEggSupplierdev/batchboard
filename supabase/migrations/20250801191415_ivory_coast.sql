/*
  # Fix All Issues - Complete Database Schema Update

  1. Database Schema Updates
    - Update profiles table structure
    - Fix constraints and indexes
    - Add proper validation for student IDs (11 digits)
    - Update sample data for testing

  2. Security Updates
    - Update RLS policies
    - Fix authentication flow

  3. Data Migration
    - Update existing data to new format
    - Add sample students for testing
*/

-- Drop existing constraints that might cause issues
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_student_id_key;
DROP INDEX IF EXISTS profiles_student_id_key;
DROP INDEX IF EXISTS idx_profiles_student_id;

-- Update profiles table structure
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_student_id_check,
  ADD CONSTRAINT profiles_student_id_check CHECK (student_id ~ '^[0-9]{11}$');

-- Recreate unique constraint and index
ALTER TABLE profiles ADD CONSTRAINT profiles_student_id_unique UNIQUE (student_id);
CREATE INDEX idx_profiles_student_id ON profiles(student_id);

-- Update existing admin data
UPDATE profiles 
SET student_id = '20230000001', full_name = 'ADMIN'
WHERE student_id IN ('ADMIN001', 'aftab', 'DEMO001');

-- Insert sample students for testing (Class 10th, Batch 2024-2028)
INSERT INTO profiles (student_id, full_name, bio, skills, public, first_login) VALUES
  ('20240253378', 'AFTAB', 'Tech enthusiast and coding lover. Always exploring new technologies and building cool projects.', ARRAY['JavaScript', 'React', 'Node.js', 'Python'], true, false),
  ('20240253379', 'RAHUL', 'Creative designer with a passion for UI/UX. Love creating beautiful and functional designs.', ARRAY['Design', 'Photoshop', 'Figma', 'UI/UX'], true, true),
  ('20240253380', 'PRIYA', 'Mathematics wizard and problem solver. Enjoy competitive programming and algorithms.', ARRAY['Mathematics', 'C++', 'Algorithms', 'Problem Solving'], true, true),
  ('20240253381', 'ARJUN', 'Sports enthusiast and team player. Captain of the school cricket team.', ARRAY['Cricket', 'Leadership', 'Teamwork', 'Sports'], true, true),
  ('20240253382', 'SNEHA', 'Artist and creative writer. Love expressing thoughts through art and literature.', ARRAY['Art', 'Writing', 'Poetry', 'Creativity'], true, true),
  ('20240253383', 'VIKRAM', 'Science lover and future engineer. Fascinated by physics and robotics.', ARRAY['Physics', 'Robotics', 'Arduino', 'Science'], true, true),
  ('20240253384', 'ANANYA', 'Music enthusiast and performer. Play guitar and love composing songs.', ARRAY['Music', 'Guitar', 'Singing', 'Composition'], true, true),
  ('20240253385', 'KARAN', 'Fitness freak and health conscious. Believe in maintaining a healthy lifestyle.', ARRAY['Fitness', 'Nutrition', 'Yoga', 'Health'], true, true)
ON CONFLICT (student_id) DO NOTHING;

-- Update RLS policies to work with new student ID format
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;

CREATE POLICY "Admin can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.student_id = '20230000001'
    )
  );

CREATE POLICY "Admin can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.student_id = '20230000001'
    )
  );

-- Ensure all tables have proper RLS enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;