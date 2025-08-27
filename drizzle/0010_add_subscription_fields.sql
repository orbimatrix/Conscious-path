-- Add points tracking fields to users table
ALTER TABLE users 
ADD COLUMN last_points_update TIMESTAMP,
ADD COLUMN last_updated TIMESTAMP DEFAULT NOW();
