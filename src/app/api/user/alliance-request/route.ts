import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update the user's alliance_requested status to true
    const result = await db
      .update(users)
      .set({ allianceRequested: true })
      .where(eq(users.clerkId, userId))
      .returning({ id: users.id, allianceRequested: users.allianceRequested });

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      allianceRequested: result[0].allianceRequested 
    });

  } catch (error) {
    console.error('Error updating alliance request:', error);
    return NextResponse.json(
      { error: 'Failed to update alliance request' },
      { status: 500 }
    );
  }
}
