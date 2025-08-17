import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { corrections, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // First get the user's database ID from their clerk ID
    const userRecord = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (userRecord.length === 0) {
      return NextResponse.json([]);
    }

    const userDbId = userRecord[0].id;

    const userCorrections = await db
      .select({
        id: corrections.id,
        title: corrections.title,
        description: corrections.description,
        severity: corrections.severity,
        isResolved: corrections.isResolved,
        createdAt: corrections.createdAt,
        updatedAt: corrections.updatedAt,
        resolvedAt: corrections.resolvedAt,
      })
      .from(corrections)
      .innerJoin(users, eq(corrections.userId, users.id))
      .where(eq(users.clerkId, userId))
      .orderBy(desc(corrections.createdAt));
    
    return NextResponse.json(userCorrections, {
      headers: {
        'Cache-Control': 'private, max-age=30' // Cache for 30 seconds
      }
    });
  } catch (error) {
    console.error('Error fetching user corrections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch corrections' },
      { status: 500 }
    );
  }
}
