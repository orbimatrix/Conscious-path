import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import {  inArray } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userIds = searchParams.get('userIds');
    
    if (!userIds) {
      return NextResponse.json(
        { error: 'User IDs are required' },
        { status: 400 }
      );
    }

    const userIdArray = userIds.split(',');
    
    const userInfo = await db.select({
      clerkId: users.clerkId,
      fullName: users.fullName,
      username: users.username,
      email: users.email
    })
    .from(users)
    .where(inArray(users.clerkId, userIdArray));

    return NextResponse.json({ users: userInfo });
  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user info' },
      { status: 500 }
    );
  }
}
