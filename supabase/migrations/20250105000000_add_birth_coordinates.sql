-- Add latitude/longitude columns for birth location (needed by astrology APIs)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS birth_lat double precision,
  ADD COLUMN IF NOT EXISTS birth_lng double precision;
