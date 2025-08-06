import { db } from './index';
import { users, userSubscriptions } from './schema';
import { eq } from 'drizzle-orm';

export async function getUserByClerkId(clerkId: string) {
  const result = await db.select().from(users).where(eq(users.clerkId, clerkId));
  return result[0] || null;
}

export async function createUserSubscription(clerkId: string, planType: 'carisma' | 'karma') {
  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error('User not found');
  }

  return await db.insert(userSubscriptions).values({
    clerkId,
    planType,
    status: 'active',
    startDate: new Date(),
  });
}

export async function getUserSubscription(clerkId: string) {
  const result = await db.select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.clerkId, clerkId))
    .orderBy(userSubscriptions.createdAt);
  
  return result[0] || null;
} 