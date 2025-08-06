ALTER TABLE "users" RENAME COLUMN "phone" TO "username";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "image_url";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "updated_at";