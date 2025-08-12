import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin';
import { db } from '@/lib/db';
import { messages, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, messageType, receiverId, visibilityLevel } = body;

    if (!content || !messageType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let targetUsers: string[] = [];

    if (messageType === 'direct' && receiverId) {
      // Single user message
      targetUsers = [receiverId];
    } else if (messageType === 'group' && visibilityLevel) {
      // Group message by level
      const usersWithLevel = await db
        .select({ clerkId: users.clerkId })
        .from(users)
        .where(eq(users.level, visibilityLevel));
      
      targetUsers = usersWithLevel.map(u => u.clerkId);
    } else if (messageType === 'announcement') {
      // General announcement to all users
      const allUsers = await db
        .select({ clerkId: users.clerkId })
        .from(users);
      
      targetUsers = allUsers.map(u => u.clerkId);
    }

    if (targetUsers.length === 0) {
      return NextResponse.json({ error: 'No target users found' }, { status: 400 });
    }

    // Create messages for all target users
    const messageData = targetUsers.map(clerkId => ({
      senderId: adminUser.id,
      receiverId: clerkId,
      content,
      messageType,
      visibilityLevel: messageType === 'group' ? visibilityLevel : null,
    }));

    const createdMessages = await db.insert(messages).values(messageData).returning();

    return NextResponse.json({ 
      success: true, 
      messages: createdMessages,
      recipients: targetUsers.length 
    });
  } catch (error) {
    console.error('Error sending messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
