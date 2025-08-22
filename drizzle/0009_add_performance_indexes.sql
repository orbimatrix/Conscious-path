-- Add performance indexes for better API response times
-- Migration: 0009_add_performance_indexes

-- Users table indexes
CREATE INDEX IF NOT EXISTS "users_clerk_id_idx" ON "users" ("clerk_id");
CREATE INDEX IF NOT EXISTS "users_level_idx" ON "users" ("level");
CREATE INDEX IF NOT EXISTS "users_is_active_idx" ON "users" ("is_active");

-- User levels table indexes
CREATE INDEX IF NOT EXISTS "user_levels_user_id_idx" ON "user_levels" ("user_id");
CREATE INDEX IF NOT EXISTS "user_levels_level_idx" ON "user_levels" ("level");
CREATE INDEX IF NOT EXISTS "user_levels_is_active_idx" ON "user_levels" ("is_active");
CREATE INDEX IF NOT EXISTS "user_levels_user_active_idx" ON "user_levels" ("user_id", "is_active");

-- Analyze tables after adding indexes
ANALYZE "users";
ANALYZE "user_levels";
