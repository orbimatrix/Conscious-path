CREATE TABLE IF NOT EXISTS "corrections" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"severity" varchar(50) DEFAULT 'medium',
	"is_resolved" boolean DEFAULT false,
	"assigned_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"resolved_at" timestamp
);

ALTER TABLE "corrections" ADD CONSTRAINT "corrections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
