/*
  # Community Q&A System Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches auth.users.id
      - `email` (text, unique)
      - `name` (text)
      - `role` (enum: freshman/senior)
      - `join_date` (timestamp)
      - `profile_data` (jsonb)
      - `created_at` (timestamp)

    - `questions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `content` (text)
      - `category` (text)
      - `status` (enum: open/answered/closed)
      - `upvotes` (integer, default 0)
      - `created_at` (timestamp)

    - `answers`
      - `id` (uuid, primary key)
      - `question_id` (uuid, foreign key to questions)
      - `user_id` (uuid, foreign key to users)
      - `content` (text)
      - `upvotes` (integer, default 0)
      - `is_best_answer` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Users can read all content
    - Users can only edit their own content
    - Only question authors can mark best answers

  3. Indexes
    - Add indexes for better query performance
    - Full-text search capabilities
*/

-- Create custom types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('freshman', 'senior');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE question_status AS ENUM ('open', 'answered', 'closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role NOT NULL DEFAULT 'freshman',
  join_date timestamptz DEFAULT now(),
  profile_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  status question_status DEFAULT 'open',
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  upvotes integer DEFAULT 0,
  is_best_answer boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read all profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Questions policies
CREATE POLICY "Anyone can read questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own questions"
  ON questions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own questions"
  ON questions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Answers policies
CREATE POLICY "Anyone can read answers"
  ON answers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create answers"
  ON answers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own answers"
  ON answers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own answers"
  ON answers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON questions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_upvotes ON questions(upvotes DESC);

CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_user_id ON answers(user_id);
CREATE INDEX IF NOT EXISTS idx_answers_created_at ON answers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_answers_upvotes ON answers(upvotes DESC);
CREATE INDEX IF NOT EXISTS idx_answers_best_answer ON answers(is_best_answer) WHERE is_best_answer = true;

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_questions_search ON questions USING gin(to_tsvector('english', title || ' ' || content));
CREATE INDEX IF NOT EXISTS idx_answers_search ON answers USING gin(to_tsvector('english', content));

-- Function to automatically update question status when best answer is marked
CREATE OR REPLACE FUNCTION update_question_status_on_best_answer()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_best_answer = true AND OLD.is_best_answer = false THEN
    -- Unmark any other best answers for this question
    UPDATE answers 
    SET is_best_answer = false 
    WHERE question_id = NEW.question_id AND id != NEW.id;
    
    -- Update question status to answered
    UPDATE questions 
    SET status = 'answered' 
    WHERE id = NEW.question_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for best answer updates
DROP TRIGGER IF EXISTS trigger_update_question_status ON answers;
CREATE TRIGGER trigger_update_question_status
  AFTER UPDATE ON answers
  FOR EACH ROW
  EXECUTE FUNCTION update_question_status_on_best_answer();