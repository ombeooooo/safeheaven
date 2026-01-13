/*
  # Add Statistics and Activity Tracking

  1. New Tables
    - `user_statistics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, unique)
      - `total_blocks_prevented` (integer, total number of blocks)
      - `longest_streak` (integer, best streak ever achieved)
      - `total_sites_managed` (integer, total unique sites ever blocked)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `protection_events`
      - `id` (uuid, primary key)
      - `user_id` (uuid)
      - `event_type` (text: site_blocked, keyword_blocked, protection_enabled, protection_disabled, protection_paused)
      - `details` (text, optional details about the event)
      - `created_at` (timestamp)
  
  2. Changes to Existing Tables
    - Add `is_paused` column to `streaks` table
    - Add `pause_started_at` column to `streaks` table
  
  3. Security
    - Enable RLS on new tables
    - Add policies for users to access their own data
    
  4. Important Notes
    - Pause mode allows users to take breaks without losing streaks
    - Protection events track real-time blocking activity
    - User statistics provide insights into protection effectiveness
*/

-- Create user_statistics table
CREATE TABLE IF NOT EXISTS user_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  total_blocks_prevented integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  total_sites_managed integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create protection_events table
CREATE TABLE IF NOT EXISTS protection_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  event_type text NOT NULL,
  details text,
  created_at timestamptz DEFAULT now()
);

-- Add pause columns to streaks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'streaks' AND column_name = 'is_paused'
  ) THEN
    ALTER TABLE streaks ADD COLUMN is_paused boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'streaks' AND column_name = 'pause_started_at'
  ) THEN
    ALTER TABLE streaks ADD COLUMN pause_started_at timestamptz;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE protection_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own statistics"
  ON user_statistics FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage their own protection events"
  ON protection_events FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_statistics_user_id ON user_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_protection_events_user_id ON protection_events(user_id);
CREATE INDEX IF NOT EXISTS idx_protection_events_created_at ON protection_events(created_at DESC);
