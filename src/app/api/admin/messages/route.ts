import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin';
import { db } from '@/lib/db';
import { messages, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const adminUser = await getAdminUser();
    console.log('Admin check result:', adminUser ? 'Success' : 'Failed');
    
    if (!adminUser) {
      console.log('Admin authentication failed - user not found or not admin');
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    console.log('Admin authenticated successfully:', adminUser.id);

    const body = await request.json();
    const { content, messageType, receiverId, visibilityLevel } = body;

    if (!content || !messageType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Processing message:', { messageType, receiverId, visibilityLevel, contentLength: content.length });

    let targetUsers: string[] = [];

    if (messageType === 'direct' && receiverId) {
      // Single user message
      targetUsers = [receiverId];
      console.log('Direct message to user:', receiverId);
    } else if (messageType === 'group' && visibilityLevel) {
      // Group message by level
      const usersWithLevel = await db
        .select({ clerkId: users.clerkId })
        .from(users)
        .where(eq(users.level, visibilityLevel));
      
      targetUsers = usersWithLevel.map(u => u.clerkId);
      console.log(`Group message to level ${visibilityLevel}, ${targetUsers.length} users`);
    } else if (messageType === 'announcement') {
      // General announcement to all users
      const allUsers = await db
        .select({ clerkId: users.clerkId })
        .from(users);
      
      targetUsers = allUsers.map(u => u.clerkId);
      console.log(`Announcement to all users, ${targetUsers.length} users`);
    }

    if (targetUsers.length === 0) {
      return NextResponse.json({ error: 'No target users found' }, { status: 400 });
    }

    // Create messages for all target users
    const messageData = targetUsers.map(clerkId => ({
      senderId: 'admin', // Use 'admin' as string identifier
      receiverId: clerkId,
      content,
      messageType,
      visibilityLevel: messageType === 'group' ? visibilityLevel : null,
      isRead: false,
    }));

    const createdMessages = await db.insert(messages).values(messageData).returning();
    console.log(`Successfully created ${createdMessages.length} messages`);

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
