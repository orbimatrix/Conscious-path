-- Migration: Add phrases table
-- This table stores daily inspirational phrases that admins can manage

CREATE TABLE IF NOT EXISTS "phrases" (
  "id" serial PRIMARY KEY,
  "content" text NOT NULL,
  "author_id" varchar(255) NOT NULL,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Add index for better performance when querying active phrases
CREATE INDEX IF NOT EXISTS "phrases_is_active_idx" ON "phrases" ("is_active");

-- Add index for ordering by creation date
CREATE INDEX IF NOT EXISTS "phrases_created_at_idx" ON "phrases" ("created_at");
