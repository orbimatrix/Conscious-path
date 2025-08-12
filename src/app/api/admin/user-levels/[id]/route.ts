import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin';
import { db } from '@/lib/db';
import { userLevels } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const levelId = parseInt(id);
    if (isNaN(levelId)) {
      return NextResponse.json({ error: 'Invalid level ID' }, { status: 400 });
    }

    // Delete user level
    const deletedUserLevel = await db
      .delete(userLevels)
      .where(eq(userLevels.id, levelId))
      .returning();

    if (deletedUserLevel.length === 0) {
      return NextResponse.json({ error: 'User level not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, userLevel: deletedUserLevel[0] });
  } catch (error) {
    console.error('Error deleting user level:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
