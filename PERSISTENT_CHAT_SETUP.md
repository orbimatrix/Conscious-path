# Persistent Chat System Setup

This document explains how the new persistent chat system works, combining real-time functionality with database persistence.

## Overview

The system now stores all messages in the database while maintaining real-time chat functionality. This means:
- Messages are persisted and can be retrieved when users reload the page
- Real-time updates still work for instant messaging
- Both users and admins can see conversation history
- Messages are stored with proper metadata (sender, receiver, type, etc.)

## Components Updated

### 1. Database Schema
The existing `messages` table is used with the following structure:
- `id`: Primary key
- `sender_id`: Clerk ID of the message sender
- `receiver_id`: Clerk ID of the message receiver (or 'all' for announcements)
- `content`: Message text content
- `message_type`: 'direct', 'group', or 'announcement'
- `visibility_level`: For group messages (e.g., 'inmortal', 'karma')
- `created_at`: Timestamp
- `is_read`: Read status (for future use)

### 2. New API Endpoints

#### `/api/messages` (POST)
- Creates new messages in the database
- Handles different message types (direct, group, announcement)
- Validates required fields based on message type

#### `/api/messages` (GET)
- Retrieves messages for a specific room
- Supports pagination with limit/offset
- Handles different room types:
  - `direct-{userId}-admin`: Direct messages between user and admin
  - `group-{level}`: Group messages for a specific level
  - `announcements`: General announcements

#### `/api/user/info` (GET)
- Fetches user information for display names
- Used to show proper user names instead of Clerk IDs

### 3. New Hook: `usePersistentChat`

Replaces the old `useRealtimeChat` hook with:
- Database persistence for all messages
- Real-time updates via Supabase
- Automatic loading of previous messages
- User name resolution for better display

### 4. Updated Components

#### `RealtimeChat`
- Now requires `senderId` parameter
- Shows loading state while fetching previous messages
- Integrates with persistent chat hook

#### `MessagesSection`
- Uses persistent chat hook for all message types
- Maintains real-time functionality
- Loads conversation history automatically

#### `MessageModal`
- Updated to use persistent chat hook
- Sends messages via database + real-time
- Better error handling and user feedback

#### `MessagingSystem` (Admin)
- Admin interface now uses persistent chat
- All admin messages are stored in database
- Maintains real-time functionality

## How It Works

### Message Flow

1. **User sends message**:
   - Message is immediately added to local state (optimistic update)
   - Message is sent to database via API
   - Message is broadcast via Supabase real-time
   - If database save fails, message is removed from local state

2. **Message reception**:
   - Real-time messages are received via Supabase
   - Duplicate detection prevents message duplication
   - Messages are merged with existing conversation

3. **Page load**:
   - Previous messages are loaded from database
   - User names are resolved for better display
   - Real-time connection is established
   - New messages arrive in real-time

### Room Types

- **Direct Messages**: `direct-{userId}-admin`
  - Private conversations between user and admin
  - Messages stored with `message_type: 'direct'`

- **Group Messages**: `group-{level}`
  - Level-specific group chats (e.g., `group-karma`)
  - Messages stored with `message_type: 'group'` and `visibility_level: '{level}'`

- **Announcements**: `announcements`
  - General announcements visible to all users
  - Messages stored with `message_type: 'announcement'` and `receiver_id: 'all'`

## Benefits

1. **Persistence**: Messages survive page reloads and server restarts
2. **Real-time**: Instant messaging still works as before
3. **History**: Users can see full conversation history
4. **Scalability**: Database storage allows for better message management
5. **User Experience**: Better loading states and error handling

## Migration Notes

- Existing real-time functionality is preserved
- No breaking changes to the UI
- Messages are automatically loaded from database
- Backward compatibility maintained

## Future Enhancements

- Message read receipts
- Message search functionality
- File/image message support
- Message editing/deletion
- Message threading
- Push notifications
