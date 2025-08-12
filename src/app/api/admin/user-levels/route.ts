import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin';
import { db } from '@/lib/db';
import { userLevels } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all user levels
    const allUserLevels = await db.select().from(userLevels).orderBy(userLevels.assignedAt);

    return NextResponse.json({ userLevels: allUserLevels });
  } catch (error) {
    console.error('Error fetching user levels:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, level, expiresAt } = body;

    if (!userId || !level) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create user level
    const createdUserLevel = await db.insert(userLevels).values({
      userId,
      level,
      assignedBy: adminUser.id,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    }).returning();

    return NextResponse.json({ userLevel: createdUserLevel[0] });
  } catch (error) {
    console.error('Error creating user level:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
