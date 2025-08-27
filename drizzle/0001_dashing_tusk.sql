ALTER TABLE "users" ADD COLUMN "last_points_update" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_updated" timestamp DEFAULT now();--> statement-breakpoint
CREATE INDEX "messages_sender_id_idx" ON "messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "messages_receiver_id_idx" ON "messages" USING btree ("receiver_id");--> statement-breakpoint
CREATE INDEX "messages_message_type_idx" ON "messages" USING btree ("message_type");--> statement-breakpoint
CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "messages_sender_receiver_idx" ON "messages" USING btree ("sender_id","receiver_id");--> statement-breakpoint
CREATE INDEX "user_levels_user_id_idx" ON "user_levels" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_levels_level_idx" ON "user_levels" USING btree ("level");--> statement-breakpoint
CREATE INDEX "user_levels_is_active_idx" ON "user_levels" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "user_levels_user_active_idx" ON "user_levels" USING btree ("user_id","is_active");--> statement-breakpoint
CREATE INDEX "users_clerk_id_idx" ON "users" USING btree ("clerk_id");--> statement-breakpoint
CREATE INDEX "users_level_idx" ON "users" USING btree ("level");--> statement-breakpoint
CREATE INDEX "users_is_active_idx" ON "users" USING btree ("is_active");