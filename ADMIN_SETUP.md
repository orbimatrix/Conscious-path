# Admin Panel Setup Guide

## Overview
The admin panel provides comprehensive user management capabilities for administrators. It includes user management, messaging, news publishing, payment history, and user level management.

## Features

### A) User Profile Management
- View all user profiles
- Edit user information (name, email, city, etc.)
- Change user status (active/inactive)
- Modify user points

### B) Messaging System
- Send direct messages to individual users
- Send group messages to users by level
- Send general announcements to all users

### C) News Management
- Publish news for specific users
- Publish general news for all users
- Manage and delete news items

### D) Payment History
- View complete payment history
- Filter by user and payment status
- Payment analytics and summaries

### E) User Level Management
- Assign multiple levels to users
- Set expiration dates for levels
- Manage user access to different content tiers

## Setup Instructions

### 1. Database Migration
The admin panel requires new database tables. Run the migration:
```bash
npm run db:migrate
```

### 2. Admin Role Assignment
To access the admin panel, a user must have admin role in Clerk:

#### Option A: Via Clerk Dashboard
1. Go to your Clerk Dashboard
2. Navigate to Users
3. Select the user you want to make admin
4. Go to Public Metadata
5. Add: `role: "admin"` or `isAdmin: true`

#### Option B: Via Clerk API
```javascript
await clerkClient.users.updateUser(userId, {
  publicMetadata: {
    role: 'admin'
  }
});
```

### 3. Access Admin Panel
Once the role is assigned, the admin can:
- Navigate to `/admin` in the application
- See "Admin Panel" link in the header navigation
- Access all admin functionality

## Security Features

- **Role-based Access Control**: Only users with admin role can access
- **Server-side Validation**: All API endpoints verify admin status
- **Automatic Redirects**: Non-admin users are redirected away from admin routes

## API Endpoints

All admin API endpoints are protected and require admin authentication:

- `GET /api/admin/users` - Fetch all users
- `PUT /api/admin/users/[id]` - Update user information
- `PUT /api/admin/users/[id]/points` - Update user points
- `POST /api/admin/messages` - Send messages
- `GET /api/admin/news` - Fetch news
- `POST /api/admin/news` - Create news
- `DELETE /api/admin/news/[id]` - Delete news
- `GET /api/admin/payments` - Fetch payment history
- `GET /api/admin/user-levels` - Fetch user levels
- `POST /api/admin/user-levels` - Assign user level
- `DELETE /api/admin/user-levels/[id]` - Remove user level

## Usage Examples

### Assign Admin Role to User
```javascript
// In Clerk Dashboard or via API
{
  "publicMetadata": {
    "role": "admin"
  }
}
```

### Send Group Message
```javascript
// Admin can send message to all users with "karma" level
{
  "content": "New karma content available!",
  "messageType": "group",
  "visibilityLevel": "karma"
}
```

### Assign User Level
```javascript
// Admin can assign multiple levels to a user
{
  "userId": 123,
  "level": "carisma",
  "expiresAt": "2024-12-31"
}
```

## Troubleshooting

### Admin Panel Not Visible
- Verify user has admin role in Clerk metadata
- Check browser console for errors
- Ensure database migration was successful

### API Errors
- Verify admin authentication is working
- Check database connection
- Review server logs for detailed error messages

## Support
For technical issues with the admin panel, check:
1. Database connection and migrations
2. Clerk authentication setup
3. User role assignments
4. API endpoint responses
