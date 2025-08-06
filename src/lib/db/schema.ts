import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  fullName: text('full_name'),
  email: varchar('email', { length: 255 }),
  username: varchar('username', { length: 256 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userSubscriptions = pgTable('user_subscriptions', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  clerkId: varchar('clerk_id', { length: 255 }).notNull(),
  planType: varchar('plan_type', { length: 50 }).notNull(), // 'carisma' | 'karma'
  status: varchar('status', { length: 50 }).default('active'),
  startDate: timestamp('start_date').defaultNow(),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type NewUserSubscription = typeof userSubscriptions.$inferInsert; 