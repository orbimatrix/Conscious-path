import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { messages, users } from '@/lib/db/schema';
import { eq, or, and, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: adminId } = await auth();
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId: targetUserId } = await params;

    // Get conversation between admin and user (both directions)
    const conversation = await db
      .select({
        id: messages.id,
        content: messages.content,
        messageType: messages.messageType,
        visibilityLevel: messages.visibilityLevel,
        isRead: messages.isRead,
        createdAt: messages.createdAt,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        sender: {
          clerkId: users.clerkId,
          fullName: users.fullName,
          username: users.username,
          email: users.email,
        }
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.clerkId))
      .where(
        or(
          // Messages from admin to user
          and(
            eq(messages.senderId, 'admin'),
            eq(messages.receiverId, targetUserId)
          ),
          // Messages from user to admin
          and(
            eq(messages.senderId, targetUserId),
            eq(messages.receiverId, 'admin')
          )
        )
      )
      .orderBy(desc(messages.createdAt));

    return NextResponse.json({
      messages: conversation,
      success: true
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
