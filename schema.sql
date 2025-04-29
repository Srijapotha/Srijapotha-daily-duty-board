-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'incomplete',
  priority TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create policies for tasks
CREATE POLICY "Users can view their own tasks" 
  ON tasks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" 
  ON tasks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
  ON tasks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
  ON tasks FOR DELETE 
  USING (auth.uid() = user_id);

-- Create demo user and test users
-- Note: In a real application, you would create these users through the auth API
-- This is just for demonstration purposes

-- Insert seed data for demo
INSERT INTO profiles (id, email, full_name)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'demo@example.com', 'Demo User'),
  ('00000000-0000-0000-0000-000000000002', 'test1@example.com', 'Test User 1'),
  ('00000000-0000-0000-0000-000000000003', 'test2@example.com', 'Test User 2')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks for demo user
INSERT INTO tasks (title, description, status, priority, user_id)
VALUES 
  ('Complete project', 'Finish the React project by Friday', 'incomplete', 'high', '00000000-0000-0000-0000-000000000001'),
  ('Buy groceries', 'Milk, eggs, bread', 'complete', 'medium', '00000000-0000-0000-0000-000000000001'),
  ('Call dentist', 'Schedule appointment for next week', 'incomplete', 'low', '00000000-0000-0000-0000-000000000001'),
  ('Review code', 'Review pull request #42', 'incomplete', 'high', '00000000-0000-0000-0000-000000000002'),
  ('Team meeting', 'Prepare for weekly team meeting', 'complete', 'medium', '00000000-0000-0000-0000-000000000002'),
  ('Learn Next.js', 'Complete the Next.js tutorial', 'incomplete', 'medium', '00000000-0000-0000-0000-000000000003'),
  ('Exercise', 'Go for a 30-minute run', 'complete', 'low', '00000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;
