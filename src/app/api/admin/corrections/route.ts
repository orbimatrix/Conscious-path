import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { db } from '@/lib/db';
import { corrections, users } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const baseQuery = db
      .select({
        id: corrections.id,
        title: corrections.title,
        description: corrections.description,
        severity: corrections.severity,
        isResolved: corrections.isResolved,
        createdAt: corrections.createdAt,
        updatedAt: corrections.updatedAt,
        resolvedAt: corrections.resolvedAt,
        user: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
          username: users.username,
        },
        assignedBy: corrections.assignedBy,
      })
      .from(corrections)
      .innerJoin(users, eq(corrections.userId, users.id));

    const result = userId 
      ? await baseQuery.where(eq(corrections.userId, parseInt(userId))).orderBy(desc(corrections.createdAt))
      : await baseQuery.orderBy(desc(corrections.createdAt));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching corrections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch corrections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const { userId, title, description, severity, adminClerkId } = body;
    
    if (!userId || !title || !description || !adminClerkId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get the target user's clerkId from their database ID
    const targetUser = await db
      .select({ clerkId: users.clerkId })
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);
    
    if (targetUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const newCorrection = await db.insert(corrections).values({
      userId: parseInt(userId),
      clerkId: targetUser[0].clerkId, // Set to target user's clerkId
      title,
      description,
      severity: severity || 'medium',
      assignedBy: adminClerkId, // Admin's clerkId
    }).returning();
    
    return NextResponse.json(newCorrection[0]);
  } catch (error) {
    console.error('Error creating correction:', error);
    return NextResponse.json(
      { error: 'Failed to create correction' },
      { status: 500 }
    );
  }
}
