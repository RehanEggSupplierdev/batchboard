/*
  # Insert Demo Data for BatchBoard

  1. Demo Users and Profiles
    - Create sample student profiles
    - Create admin profile for Aftab
  
  2. Sample Pages and Content
    - Create sample pages for students
  
  3. Sample Comments
    - Add some demo comments
*/

-- Note: This is demo data. In production, users will be created through the auth system
-- For demo purposes, we'll create some sample profiles assuming users exist

-- Insert demo profiles (these would normally be created when users sign up)
INSERT INTO profiles (user_id, student_id, full_name, bio, skills, social_links, quote, public, first_login) VALUES
  (gen_random_uuid(), 'DEMO001', 'Aftab Alam', 'Creator of BatchBoard and passionate developer. Leading the Class of 2025 digital initiative.', 
   ARRAY['JavaScript', 'React', 'Node.js', 'Supabase', 'UI/UX Design'], 
   '{"github": "https://github.com/aftab", "linkedin": "https://linkedin.com/in/aftab"}',
   'Code is poetry, and every bug is just a feature waiting to be discovered!', true, false),
  
  (gen_random_uuid(), 'STU001', 'Priya Sharma', 'Aspiring data scientist with a love for machine learning and analytics.', 
   ARRAY['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow'], 
   '{"linkedin": "https://linkedin.com/in/priya-sharma", "github": "https://github.com/priya"}',
   'Data tells stories, and I love being the storyteller.', true, false),
  
  (gen_random_uuid(), 'STU002', 'Rahul Kumar', 'Full-stack developer and open source enthusiast. Building the future one commit at a time.', 
   ARRAY['JavaScript', 'Python', 'Docker', 'AWS', 'MongoDB'], 
   '{"github": "https://github.com/rahul", "twitter": "https://twitter.com/rahul_dev"}',
   'The best way to predict the future is to create it.', true, false),
  
  (gen_random_uuid(), 'STU003', 'Ananya Singh', 'Creative designer and frontend developer. Passionate about creating beautiful user experiences.', 
   ARRAY['UI/UX Design', 'Figma', 'React', 'CSS', 'Adobe Creative Suite'], 
   '{"behance": "https://behance.net/ananya", "dribbble": "https://dribbble.com/ananya"}',
   'Design is not just what it looks like - design is how it works.', true, false),
  
  (gen_random_uuid(), 'STU004', 'Vikram Patel', 'Cybersecurity enthusiast and ethical hacker. Protecting the digital world one vulnerability at a time.', 
   ARRAY['Cybersecurity', 'Ethical Hacking', 'Network Security', 'Python', 'Linux'], 
   '{"linkedin": "https://linkedin.com/in/vikram-security"}',
   'Security is not a product, but a process.', true, false),
  
  (gen_random_uuid(), 'STU005', 'Sneha Gupta', 'Mobile app developer and tech blogger. Creating apps that make a difference.', 
   ARRAY['Flutter', 'React Native', 'iOS Development', 'Firebase', 'Technical Writing'], 
   '{"medium": "https://medium.com/@sneha", "github": "https://github.com/sneha"}',
   'Great apps are built with great user experiences in mind.', true, false);

-- Insert sample pages
INSERT INTO pages (user_id, title, content, published) VALUES
  ((SELECT user_id FROM profiles WHERE student_id = 'DEMO001'), 'My Journey in Tech', 
   '# My Tech Journey\n\nStarted coding in high school and fell in love with creating digital solutions. BatchBoard is my latest project to connect our amazing class!\n\n## Skills Developed\n- Full-stack web development\n- Database design\n- User experience design\n\n## Current Projects\n- BatchBoard Portal\n- Personal Portfolio Website\n- Open Source Contributions', true),
  
  ((SELECT user_id FROM profiles WHERE student_id = 'STU001'), 'Data Science Projects', 
   '# My Data Science Portfolio\n\n## Project 1: Student Performance Analysis\nAnalyzed academic performance patterns using Python and pandas.\n\n## Project 2: Social Media Sentiment Analysis\nBuilt a sentiment analysis model for social media posts.\n\n## Skills\n- Python, R, SQL\n- Machine Learning\n- Data Visualization', true),
  
  ((SELECT user_id FROM profiles WHERE student_id = 'STU002'), 'Open Source Contributions', 
   '# Contributing to Open Source\n\nI believe in giving back to the community that taught me so much.\n\n## Recent Contributions\n- React component library\n- Node.js utilities\n- Documentation improvements\n\n## Why Open Source?\nIt''s about learning, sharing, and building together.', true);

-- Insert sample comments
INSERT INTO comments (user_id, target_type, target_id, content) VALUES
  ((SELECT user_id FROM profiles WHERE student_id = 'STU001'), 'profile', 
   (SELECT id FROM profiles WHERE student_id = 'DEMO001'), 
   'Amazing work on BatchBoard! This is exactly what our class needed. 🚀'),
  
  ((SELECT user_id FROM profiles WHERE student_id = 'STU002'), 'profile', 
   (SELECT id FROM profiles WHERE student_id = 'DEMO001'), 
   'The design and functionality are top-notch. Great job leading this project!'),
  
  ((SELECT user_id FROM profiles WHERE student_id = 'DEMO001'), 'profile', 
   (SELECT id FROM profiles WHERE student_id = 'STU001'), 
   'Your data science projects are inspiring! Would love to collaborate sometime.'),
  
  ((SELECT user_id FROM profiles WHERE student_id = 'STU003'), 'page', 
   (SELECT id FROM pages WHERE title = 'My Journey in Tech'), 
   'Love reading about your journey! The BatchBoard project is incredible.');