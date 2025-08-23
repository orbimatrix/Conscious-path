import {  NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { userLevels, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  try {
    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Single optimized query: Get user and their levels in one database call
    const userWithLevels = await db
      .select({
        // User data
        userId: users.id,
        clerkId: users.clerkId,
        level: users.level,
        // User levels data
        userLevelId: userLevels.id,
        userLevelLevel: userLevels.level,
        userLevelIsActive: userLevels.isActive,
        userLevelAssignedBy: userLevels.assignedBy,
        userLevelAssignedAt: userLevels.assignedAt,
        userLevelExpiresAt: userLevels.expiresAt,
      })
      .from(users)
      .leftJoin(userLevels, and(
        eq(users.id, userLevels.userId),
        eq(userLevels.isActive, true)
      ))
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (userWithLevels.length === 0) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const userData = userWithLevels[0];
    
    // Process the results efficiently
    const userLevelsData = [];
    
    // Add explicit user levels if they exist
    if (userData.userLevelId) {
      userLevelsData.push({
        id: userData.userLevelId,
        userId: userData.userId,
        level: userData.userLevelLevel,
        isActive: userData.userLevelIsActive,
        assignedBy: userData.userLevelAssignedBy,
        assignedAt: userData.userLevelAssignedAt,
        expiresAt: userData.userLevelExpiresAt,
      });
    }
    
    // If no specific levels assigned, provide default Inmortal level
    if (userLevelsData.length === 0) {
      const defaultLevel = {
        id: 0,
        userId: userData.userId,
        level: userData.level || 'inmortal',
        isActive: true,
        assignedBy: 'system',
        assignedAt: new Date(),
        expiresAt: null
      };
      userLevelsData.push(defaultLevel);
    }

    return NextResponse.json({ 
      userLevels: userLevelsData,
      message: 'User levels retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching user levels:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
