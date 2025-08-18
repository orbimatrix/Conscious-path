import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin';
import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { lt, and, or, eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clean up messages older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // First, get count of messages to be deleted
    const messagesToDelete = await db
      .select({ id: messages.id })
      .from(messages)
      .where(lt(messages.createdAt, sevenDaysAgo));

    if (messagesToDelete.length === 0) {
      return NextResponse.json({
        success: true,
        deletedCount: 0,
        message: 'No old messages to clean up'
      });
    }

    // Delete old messages in batches for better performance
    const batchSize = 100;
    let totalDeleted = 0;

    for (let i = 0; i < messagesToDelete.length; i += batchSize) {
      const batch = messagesToDelete.slice(i, i + batchSize);
      const batchIds = batch.map(msg => msg.id);
      
      const result = await db
        .delete(messages)
        .where(
          and(
            lt(messages.createdAt, sevenDaysAgo),
            or(...batchIds.map(id => eq(messages.id, id)))
          )
        );
      
      totalDeleted += batchIds.length;
    }

    return NextResponse.json({
      success: true,
      deletedCount: totalDeleted,
      message: `Successfully cleaned up ${totalDeleted} old messages`
    });
  } catch (error) {
    console.error('Error cleaning up messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET endpoint to check how many messages would be deleted
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check how many messages are older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const oldMessages = await db
      .select({ id: messages.id })
      .from(messages)
      .where(lt(messages.createdAt, sevenDaysAgo));

    return NextResponse.json({
      success: true,
      count: oldMessages.length,
      message: `${oldMessages.length} messages are older than 7 days`
    });
  } catch (error) {
    console.error('Error checking old messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
