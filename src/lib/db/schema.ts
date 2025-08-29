import { pgTable, serial, text, varchar, timestamp, boolean, integer, jsonb, index } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  birthDate: text('birth_date'),
  city: varchar('city', { length: 100 }),
  telegram: varchar('telegram', { length: 100 }),
  signal: varchar('signal', { length: 100 }),
  isActive: boolean('is_active').default(true),
  points: integer('points').default(0),
  level: varchar('level', { length: 50 }).default('inmortal'), // inmortal, carisma, benec, karma, renacer
  fullName: text('full_name'),
  email: varchar('email', { length: 255 }),
  username: varchar('username', { length: 256 }),
  lastDailyClaim: timestamp('last_daily_claim'),
  allianceRequested: boolean('alliance_requested').default(false), // New field for Alianza tracking
  biography: text('biography'), // User biography/about me information
  
  // Points system fields
  lastPointsUpdate: timestamp('last_points_update'),
  lastUpdated: timestamp('last_updated').defaultNow(),

  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  // Performance indexes
  clerkIdIdx: index('users_clerk_id_idx').on(table.clerkId),
  levelIdx: index('users_level_idx').on(table.level),
  isActiveIdx: index('users_is_active_idx').on(table.isActive),
}));

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

// New tables for admin functionality
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  senderId: varchar('sender_id', { length: 255 }).notNull(), // Clerk ID of sender
  receiverId: varchar('receiver_id', { length: 255 }).notNull(), // Clerk ID of receiver
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  messageType: varchar('message_type', { length: 50 }).default('direct'), // 'direct' | 'group' | 'announcement'
  visibilityLevel: varchar('visibility_level', { length: 50 }), // For group messages
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  // Add indexes for better query performance
  senderIdIdx: index('messages_sender_id_idx').on(table.senderId),
  receiverIdIdx: index('messages_receiver_id_idx').on(table.receiverId),
  messageTypeIdx: index('messages_message_type_idx').on(table.messageType),
  createdAtIdx: index('messages_created_at_idx').on(table.createdAt),
  compositeIdx: index('messages_sender_receiver_idx').on(table.senderId, table.receiverId),
}));

export const news = pgTable('news', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: varchar('author_id', { length: 255 }).notNull(), // Clerk ID of admin author
  targetUserId: varchar('target_user_id', { length: 255 }), // Specific user or null for general
  isPublished: boolean('is_published').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const paymentHistory = pgTable('payment_history', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  clerkId: varchar('clerk_id', { length: 255 }).notNull(),
  amount: integer('amount').notNull(), // Amount in cents
  currency: varchar('currency', { length: 3 }).default('USD'),
  status: varchar('status', { length: 50 }).notNull(), // 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: varchar('payment_method', { length: 100 }),
  transactionId: varchar('transaction_id', { length: 255 }),
  description: text('description'),
  metadata: jsonb('metadata'), // Additional payment data
  createdAt: timestamp('created_at').defaultNow(),
});

export const userLevels = pgTable('user_levels', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  level: varchar('level', { length: 50 }).notNull(), // inmortal, carisma, benec, karma, renacer
  isActive: boolean('is_active').default(true),
  assignedBy: varchar('assigned_by', { length: 255 }).notNull(), // Clerk ID of admin
  assignedAt: timestamp('assigned_at').defaultNow(),
  expiresAt: timestamp('expires_at'), // Optional expiration
}, (table) => ({
  // Performance indexes
  userIdIdx: index('user_levels_user_id_idx').on(table.userId),
  levelIdx: index('user_levels_level_idx').on(table.level),
  isActiveIdx: index('user_levels_is_active_idx').on(table.isActive),
  // Composite index for the most common query pattern
  userActiveIdx: index('user_levels_user_active_idx').on(table.userId, table.isActive),
}));

export const phrases = pgTable('phrases', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  authorId: varchar('author_id', { length: 255 }).notNull(), // Clerk ID of admin author
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const corrections = pgTable('corrections', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  clerkId: varchar('clerk_id', { length: 255 }).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  severity: varchar('severity', { length: 50 }).default('medium'), // 'low' | 'medium' | 'high' | 'critical'
  isResolved: boolean('is_resolved').default(false),
  assignedBy: varchar('assigned_by', { length: 255 }).notNull(), // Clerk ID of admin
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  resolvedAt: timestamp('resolved_at'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type NewUserSubscription = typeof userSubscriptions.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type News = typeof news.$inferSelect;
export type NewNews = typeof news.$inferInsert;
export type PaymentHistory = typeof paymentHistory.$inferSelect;
export type NewPaymentHistory = typeof paymentHistory.$inferInsert;
export type UserLevel = typeof userLevels.$inferSelect;
export type NewUserLevel = typeof userLevels.$inferInsert;
export type Phrase = typeof phrases.$inferSelect;
export type NewPhrase = typeof phrases.$inferInsert;
export type Correction = typeof corrections.$inferSelect;
export type NewCorrection = typeof corrections.$inferInsert; 