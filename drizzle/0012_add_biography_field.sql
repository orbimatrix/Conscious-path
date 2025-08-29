-- Add biography field to users table
ALTER TABLE "users" ADD COLUMN "biography" TEXT;

-- Add comment to explain the field
COMMENT ON COLUMN "users"."biography" IS 'User biography/about me information - only visible to admins';
