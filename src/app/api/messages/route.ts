import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { eq, and, or, desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, receiverId, content, messageType, visibilityLevel } = body;

    if (!senderId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For direct messages, receiverId is required
    if (messageType === 'direct' && !receiverId) {
      return NextResponse.json(
        { error: 'Receiver ID is required for direct messages' },
        { status: 400 }
      );
    }

    // For group messages, visibilityLevel is required
    if (messageType === 'group' && !visibilityLevel) {
      return NextResponse.json(
        { error: 'Visibility level is required for group messages' },
        { status: 400 }
      );
    }

    // For announcements, receiverId can be null (broadcast to all)
    // For admin messages, we need to handle the 'admin' receiverId specially
    let finalReceiverId = receiverId;
    if (messageType === 'announcement') {
      finalReceiverId = 'all';
    } else if (messageType === 'direct' && receiverId === 'admin') {
      // When sending to 'admin', we need to determine the actual admin ID
      // For now, we'll store it as 'admin' and handle retrieval logic
      finalReceiverId = 'admin';
    }

    try {
      const newMessage = await db.insert(messages).values({
        senderId,
        receiverId: finalReceiverId,
        content,
        messageType: messageType || 'direct',
        visibilityLevel: messageType === 'group' ? visibilityLevel : undefined,
      }).returning();

      return NextResponse.json({ message: newMessage[0] });
    } catch (dbError) {
      // Handle database-specific errors
      if (dbError instanceof Error && dbError.message.includes('Max client connections reached')) {
        return NextResponse.json(
          { error: 'Database temporarily unavailable. Please try again in a moment.' },
          { status: 503 }
        );
      }
      throw dbError; // Re-throw other errors
    }
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get('room');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    let query;
    
    try {
      if (roomName.startsWith('direct-')) {
        // Direct message room: direct-{userId}-admin
        const parts = roomName.split('-');
        if (parts.length >= 3) {
          const userId = parts[1];
          const isAdminRoom = parts[2] === 'admin';
          
          if (isAdminRoom) {
            // For admin-user chat, get ALL messages involving this user
            // This will get messages where:
            // - User is sender OR receiver
            // - Admin is sender OR receiver (when admin = 'admin')
            query = db.select()
              .from(messages)
              .where(
                and(
                  eq(messages.messageType, 'direct'),
                  or(
                    eq(messages.senderId, userId),
                    eq(messages.receiverId, userId),
                    eq(messages.senderId, 'admin'),
                    eq(messages.receiverId, 'admin')
                  )
                )
              )
              .orderBy(desc(messages.createdAt))
              .limit(limit)
              .offset(offset);
          } else {
            // For user-user chat
            const userId2 = parts[2];
            query = db.select()
              .from(messages)
              .where(
                and(
                  eq(messages.messageType, 'direct'),
                  or(
                    and(eq(messages.senderId, userId), eq(messages.receiverId, userId2)),
                    and(eq(messages.senderId, userId2), eq(messages.receiverId, userId))
                  )
                )
              )
              .orderBy(desc(messages.createdAt))
              .limit(limit)
              .offset(offset);
          }
        }
      } else if (roomName.startsWith('group-')) {
        // Group message room: group-{level}
        const level = roomName.replace('group-', '');
        
        query = db.select()
          .from(messages)
          .where(
            and(
              eq(messages.messageType, 'group'),
              eq(messages.visibilityLevel, level)
            )
          )
          .orderBy(desc(messages.createdAt))
          .limit(limit)
          .offset(offset);
      } else if (roomName === 'announcements') {
        // Announcements room
        query = db.select()
          .from(messages)
          .where(eq(messages.messageType, 'announcement'))
          .orderBy(desc(messages.createdAt))
          .limit(limit)
          .offset(offset);
      } else if (roomName === 'admin-inbox') {
        // Admin inbox - show all direct messages where admin is sender or receiver
        // We need to get the actual admin Clerk ID from the request context
        // For now, let's get all direct messages and filter on the client side
        query = db.select()
          .from(messages)
          .where(eq(messages.messageType, 'direct'))
          .orderBy(desc(messages.createdAt))
          .limit(limit)
          .offset(offset);
      } else if (roomName.startsWith('admin-direct-')) {
        // Admin direct messages: admin-direct-{adminId}
        const adminId = roomName.replace('admin-direct-', '');
        query = db.select()
          .from(messages)
          .where(
            and(
              eq(messages.messageType, 'direct'),
              or(
                eq(messages.senderId, adminId),
                eq(messages.receiverId, adminId)
              )
            )
          )
          .orderBy(desc(messages.createdAt))
          .limit(limit)
          .offset(offset);
      } else {
        return NextResponse.json(
          { error: 'Invalid room name format' },
          { status: 400 }
        );
      }

      if (!query) {
        return NextResponse.json(
          { error: 'Invalid room name format' },
          { status: 400 }
        );
      }

      const result = await query;
      const messagesList = result.reverse(); // Reverse to get chronological order

      return NextResponse.json({ messages: messagesList });
    } catch (dbError) {
      // Handle database-specific errors
      if (dbError instanceof Error && dbError.message.includes('Max client connections reached')) {
        return NextResponse.json(
          { error: 'Database temporarily unavailable. Please try again in a moment.' },
          { status: 503 }
        );
      }
      throw dbError; // Re-throw other errors
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
