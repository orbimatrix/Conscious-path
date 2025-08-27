import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface SubscriptionTier {
  tier: string;
  level: string;
  points: number;
  description: string;
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  karma_monthly: {
    tier: 'karma_monthly',
    level: 'karma',
    points: 150,
    description: 'Karma Monthly Subscription ($150/month)'
  },
  karma_yearly: {
    tier: 'karma_yearly',
    level: 'karma',
    points: 1500,
    description: 'Karma Yearly Subscription ($1500/year)'
  },
  carisma_monthly: {
    tier: 'carisma_monthly',
    level: 'carisma',
    points: 15,
    description: 'Carisma Monthly Subscription ($15/month)'
  },
  carisma_yearly: {
    tier: 'carisma_yearly',
    level: 'carisma',
    points: 150,
    description: 'Carisma Yearly Subscription ($150/year)'
  }
};

/**
 * Update user level based on subscription tier
 */
export async function updateUserLevel(userId: number, subscriptionTier: string): Promise<void> {
  try {
    const tier = SUBSCRIPTION_TIERS[subscriptionTier];
    if (!tier) {
      console.error(`Unknown subscription tier: ${subscriptionTier}`);
      return;
    }

    // Update user level
    await db.update(users)
      .set({
        level: tier.level,
        lastUpdated: new Date(),
      })
      .where(eq(users.id, userId));

    console.log(`Updated user ${userId} level to ${tier.level} (${tier.description})`);
  } catch (error) {
    console.error('Error updating user level:', error);
    throw error;
  }
}

/**
 * Add points to user account
 */
export async function addUserPoints(userId: number, pointsToAdd: number): Promise<void> {
  try {
    // Get current user points
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    const currentPoints = user.points || 0;
    const newPoints = currentPoints + pointsToAdd;

    // Update user points
    await db.update(users)
      .set({
        points: newPoints,
        lastPointsUpdate: new Date(),
        lastUpdated: new Date(),
      })
      .where(eq(users.id, userId));

    console.log(`Added ${pointsToAdd} points to user ${userId}. Total: ${newPoints}`);
  } catch (error) {
    console.error('Error adding user points:', error);
    throw error;
  }
}

/**
 * Calculate points from dollar amount ($1 = 1 point)
 */
export function calculatePointsFromAmount(amountInCents: number): number {
  return Math.floor(amountInCents / 100);
}

/**
 * Get level color for UI display
 */
export function getLevelColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'karma':
      return 'text-purple-600 bg-purple-100';
    case 'carisma':
      return 'text-blue-600 bg-blue-100';
    case 'benec':
      return 'text-green-600 bg-green-100';
    case 'renacer':
      return 'text-orange-600 bg-orange-100';
    case 'inmortal':
    default:
      return 'text-gray-600 bg-gray-100';
  }
}
