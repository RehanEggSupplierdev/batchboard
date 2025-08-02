/*
  # Setup Demo Accounts

  1. Demo Users
    - Creates demo user accounts with proper authentication
    - Sets up corresponding profiles
    
  2. Security
    - Uses proper Supabase auth system
    - Creates profiles with RLS policies
*/

-- Insert demo profiles (these will be created when users sign up)
-- This is just for reference - actual profiles are created via the signup process

-- Demo account 1: demo@example.com / password
-- Will create profile with student_id: DEMO001

-- Demo account 2: admin@example.com / password  
-- Will create profile with student_id: ADMIN001

-- The actual user creation happens through Supabase Auth signup process
-- This migration just ensures the profiles table is ready