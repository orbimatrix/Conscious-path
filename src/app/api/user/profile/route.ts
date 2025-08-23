import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Optimized single query with only needed fields
    const userData = await db
      .select({
        clerkId: users.clerkId,
        fullName: users.fullName,
        username: users.username,
        email: users.email,
        level: users.level,
        points: users.points,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (userData.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: userData[0]
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { 
            clerkId, 
            birthDate, 
            city, 
            telegram, 
            signal, 
            username, 
            points, 
            lastDailyClaim 
        } = body;

        if (!clerkId) {
            return NextResponse.json({ error: 'Clerk ID required' }, { status: 400 });
        }

        // Build update object with only provided fields
        const updateData: Partial<{
            birthDate: string;
            city: string;
            telegram: string;
            signal: string;
            username: string;
            points: number;
            lastDailyClaim: Date;
        }> = {};
        
        if (birthDate !== undefined) updateData.birthDate = birthDate;
        if (city !== undefined) updateData.city = city;
        if (telegram !== undefined) updateData.telegram = telegram;
        if (signal !== undefined) updateData.signal = signal;
        if (username !== undefined) updateData.username = username;
        if (points !== undefined) updateData.points = points;
        if (lastDailyClaim !== undefined) {
            // Ensure lastDailyClaim is properly formatted for the database
            updateData.lastDailyClaim = new Date(lastDailyClaim);
        }

        // Check if we have any data to update
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No values to set' }, { status: 400 });
        }


        // Update user data
        const updatedUser = await db
            .update(users)
            .set(updateData)
            .where(eq(users.clerkId, clerkId))
            .returning();

        return NextResponse.json(updatedUser[0]);
    } catch (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
