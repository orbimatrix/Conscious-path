# Socket.IO Real-Time Messaging Setup

This project now includes real-time messaging using Socket.IO, providing instant communication like WhatsApp.

## Features

- **Real-time messaging**: Messages are delivered instantly via WebSocket
- **Database persistence**: Messages are stored in the database after delivery
- **Typing indicators**: Shows when someone is typing
- **Read receipts**: Tracks message read status
- **Group messaging**: Send messages to users by level
- **Announcements**: Broadcast messages to all users
- **Connection status**: Visual indicators for connection state

## Setup

1. **Install dependencies** (already included):
   ```bash
   npm install socket.io socket.io-client
   ```

2. **Environment variables**:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   
   This will start the custom server with Socket.IO integration.

## How It Works

### Message Flow
1. **User types message** → Typing indicator sent
2. **Message sent** → Delivered instantly via Socket.IO
3. **Message stored** → Saved to database for persistence
4. **Read receipt** → Sent when message is viewed

### Socket Events

#### Client to Server
- `authenticate`: User authentication
- `send_message`: Direct message
- `send_group_message`: Group message
- `send_announcement`: General announcement
- `typing_start/stop`: Typing indicators
- `mark_read`: Mark message as read
- `join_level`: Join level-specific room

#### Server to Client
- `new_message`: New direct message received
- `new_group_message`: New group message received
- `new_announcement`: New announcement received
- `message_sent`: Message sent confirmation
- `user_typing`: Someone is typing
- `message_read`: Message read confirmation

## Components Updated

### AdminPanel.tsx
- Real-time messaging system for admins
- Group and announcement capabilities
- Connection status indicators

### MessagesSection.tsx
- Connection status in messages section
- Real-time message updates

### MessageModal.tsx
- Real-time messaging for users
- Typing indicators
- Instant message delivery

## Usage Examples

### Send Direct Message
```typescript
const { sendMessage } = useSocket(userId);

sendMessage({
  content: "Hello!",
  receiverId: "target_user_id",
  messageType: "direct"
});
```

### Send Group Message
```typescript
const { sendGroupMessage } = useSocket(userId);

sendGroupMessage({
  content: "Group announcement",
  level: "karma",
  messageType: "group"
});
```

### Send Announcement
```typescript
const { sendAnnouncement } = useSocket(userId);

sendAnnouncement({
  content: "Important announcement",
  messageType: "announcement"
});
```

## Production Deployment

For production, ensure:
1. Set `NEXT_PUBLIC_APP_URL` to your production domain
2. Use `npm run build && npm start` for production
3. Configure your hosting provider to use the custom server

## Troubleshooting

- **Connection issues**: Check `NEXT_PUBLIC_APP_URL` environment variable
- **Messages not sending**: Verify Socket.IO connection status
- **Database errors**: Check database connection and schema

## Performance Benefits

- **Instant delivery**: No polling or refresh needed
- **Reduced server load**: WebSocket connections vs HTTP requests
- **Better UX**: Real-time typing indicators and read receipts
- **Scalable**: Efficient for multiple concurrent users
