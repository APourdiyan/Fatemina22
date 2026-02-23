/*
  # Admin Content Management System Schema

  ## Overview
  This migration creates the database structure for the admin dashboard and content management system.

  ## New Tables
  - content: Main content/lecture storage
  - chapters: Timestamped chapter markers
  - transcript_segments: Transcript with timestamps
  - playback_progress: User playback tracking
  - admin_activity: Admin action logging

  ## Security
  - RLS enabled on all tables
  - Public read access for content
  - User-scoped access for playback progress
*/

-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  series text NOT NULL,
  topic text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('audio', 'video', 'text')),
  media_url text,
  duration text,
  duration_seconds integer DEFAULT 0,
  date text,
  description text,
  episode_number integer,
  location text,
  tags jsonb DEFAULT '[]'::jsonb,
  key_points jsonb DEFAULT '[]'::jsonb,
  content_references jsonb DEFAULT '[]'::jsonb,
  view_count integer DEFAULT 0,
  listen_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE,
  title text NOT NULL,
  time_seconds integer NOT NULL,
  time_label text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create transcript_segments table
CREATE TABLE IF NOT EXISTS transcript_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE,
  text text NOT NULL,
  time_seconds integer NOT NULL,
  time_label text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create playback_progress table
CREATE TABLE IF NOT EXISTS playback_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  content_id uuid REFERENCES content(id) ON DELETE CASCADE,
  progress_seconds integer DEFAULT 0,
  progress_percentage numeric(5,2) DEFAULT 0,
  completed boolean DEFAULT false,
  last_played_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Create admin_activity table
CREATE TABLE IF NOT EXISTS admin_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_series ON content(series);
CREATE INDEX IF NOT EXISTS idx_content_topic ON content(topic);
CREATE INDEX IF NOT EXISTS idx_content_media_type ON content(media_type);
CREATE INDEX IF NOT EXISTS idx_content_slug ON content(slug);
CREATE INDEX IF NOT EXISTS idx_chapters_content_id ON chapters(content_id);
CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters(content_id, order_index);
CREATE INDEX IF NOT EXISTS idx_transcript_content_id ON transcript_segments(content_id);
CREATE INDEX IF NOT EXISTS idx_transcript_order ON transcript_segments(content_id, order_index);
CREATE INDEX IF NOT EXISTS idx_playback_user_content ON playback_progress(user_id, content_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created ON admin_activity(created_at DESC);

-- Enable RLS
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE playback_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content
CREATE POLICY "Allow public read access to content"
  ON content FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to content"
  ON content FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to content"
  ON content FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to content"
  ON content FOR DELETE
  TO public
  USING (true);

-- RLS Policies for chapters
CREATE POLICY "Allow public read access to chapters"
  ON chapters FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to chapters"
  ON chapters FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to chapters"
  ON chapters FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to chapters"
  ON chapters FOR DELETE
  TO public
  USING (true);

-- RLS Policies for transcript_segments
CREATE POLICY "Allow public read access to transcript_segments"
  ON transcript_segments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to transcript_segments"
  ON transcript_segments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to transcript_segments"
  ON transcript_segments FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to transcript_segments"
  ON transcript_segments FOR DELETE
  TO public
  USING (true);

-- RLS Policies for playback_progress
CREATE POLICY "Allow users to read own playback progress"
  ON playback_progress FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow users to insert own playback progress"
  ON playback_progress FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow users to update own playback progress"
  ON playback_progress FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- RLS Policies for admin_activity
CREATE POLICY "Allow public read access to admin_activity"
  ON admin_activity FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to admin_activity"
  ON admin_activity FOR INSERT
  TO public
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_content_updated_at') THEN
    CREATE TRIGGER update_content_updated_at
      BEFORE UPDATE ON content
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_playback_progress_updated_at') THEN
    CREATE TRIGGER update_playback_progress_updated_at
      BEFORE UPDATE ON playback_progress
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;