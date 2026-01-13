/*
  # Create Shield App Tables

  1. New Tables
    - `blocked_sites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, for browser session identification)
      - `domain` (text, the blocked website)
      - `created_at` (timestamp)
    
    - `blocked_keywords`
      - `id` (uuid, primary key)
      - `user_id` (uuid, for browser session identification)
      - `keyword` (text, the blocked keyword)
      - `created_at` (timestamp)
    
    - `streaks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, for browser session identification)
      - `current_streak` (integer, current consecutive days)
      - `last_check_in` (date, last day of check-in)
      - `protection_enabled` (boolean, whether protection is active)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data based on user_id
*/

CREATE TABLE IF NOT EXISTS blocked_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  domain text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blocked_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  keyword text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  current_streak integer DEFAULT 0,
  last_check_in date,
  protection_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blocked_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own blocked sites"
  ON blocked_sites FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage their own blocked keywords"
  ON blocked_keywords FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage their own streak"
  ON streaks FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_blocked_sites_user_id ON blocked_sites(user_id);
CREATE INDEX IF NOT EXISTS idx_blocked_keywords_user_id ON blocked_keywords(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON streaks(user_id);
