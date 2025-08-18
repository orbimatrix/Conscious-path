import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { messages, users } from '@/lib/db/schema';
import { eq, and, or, desc, lt } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Note: Message cleanup is handled by admin cleanup endpoint for better performance

    // Get user data to access level
    const userData = await db
      .select({ level: users.level })
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (userData.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userLevel = userData[0].level || 'inmortal';

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Single optimized query for better performance
    const userMessages = await db
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
          // Messages received by user
          eq(messages.receiverId, userId),
          // Messages sent by user to admin
          and(
            eq(messages.senderId, userId),
            eq(messages.receiverId, 'admin')
          ),
          // Group messages for user's level
          and(
            eq(messages.messageType, 'group'),
            eq(messages.visibilityLevel, userLevel)
          ),
          // General announcements
          eq(messages.messageType, 'announcement')
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);

    // Transform messages to include admin sender info when needed
    const transformedMessages = userMessages.map(msg => {
      if (msg.senderId === 'admin') {
        return {
          ...msg,
          sender: {
            clerkId: 'admin',
            fullName: 'Admin',
            username: 'admin',
            email: 'admin@conscious.com',
          }
        };
      }
      return msg;
    });

    // Get unread count (only for received messages, not sent ones)
    const unreadCount = await db
      .select({ count: messages.id })
      .from(messages)
      .where(
        and(
          or(
            eq(messages.receiverId, userId),
            and(
              eq(messages.messageType, 'group'),
              eq(messages.visibilityLevel, userLevel)
            ),
            eq(messages.messageType, 'announcement')
          ),
          eq(messages.isRead, false)
        )
      );

    return NextResponse.json({
      messages: transformedMessages,
      unreadCount: unreadCount.length,
      pagination: {
        page,
        limit,
        hasMore: userMessages.length === limit
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, replyToId } = body;

    if (!content) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Create reply message
    const newMessage = await db.insert(messages).values({
      senderId: userId,
      receiverId: 'admin', // This will be handled by admin system
      content,
      messageType: 'direct',
      isRead: false,
    }).returning();

    return NextResponse.json({ 
      success: true, 
      message: newMessage[0] 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { messageId } = body;

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    // Mark message as read
    await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, messageId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
