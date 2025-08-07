ALTER TABLE "users" ADD COLUMN "birth_date" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "city" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "telegram" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "signal" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "points" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "level" varchar(50) DEFAULT 'inmortal';