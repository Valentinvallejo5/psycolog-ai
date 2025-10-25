-- Drop old numeric columns and recreate as TEXT
ALTER TABLE slider_preferences 
  DROP COLUMN tone,
  DROP COLUMN mood,
  DROP COLUMN interaction;

-- Add new TEXT columns
ALTER TABLE slider_preferences 
  ADD COLUMN tone TEXT NOT NULL DEFAULT 'friendly',
  ADD COLUMN mood TEXT NOT NULL DEFAULT 'neutral',
  ADD COLUMN interaction TEXT NOT NULL DEFAULT 'advise';