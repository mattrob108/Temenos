-- Add trial_started_at column to profiles for 7-day Explorer trial tracking
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS trial_started_at timestamptz DEFAULT now();

-- Update plan column to support: 'explorer' (trial), 'initiate' ($12/mo), 'proficient' (all systems + custom)
-- Migrate existing 'free' plans to 'explorer'
UPDATE profiles SET plan = 'explorer' WHERE plan = 'free';
