# Daily Phrases System Setup

This document explains how to set up and use the new Daily Phrases system in the admin panel.

## Overview

The Daily Phrases system allows admins to:
- Upload 20, 30, 40+ inspirational phrases
- Store them in the database using Drizzle ORM
- Display a different phrase to users each day
- Show phrases in the user profile section

## Database Setup

### 1. Run Database Migration

First, run the database migration to create the phrases table:

```bash
npm run db:migrate
```

Or manually run the migration script:

```bash
npx tsx src/lib/db/migrate.ts
```

### 2. Database Schema

The `phrases` table includes:
- `id`: Unique identifier
- `content`: The inspirational phrase text
- `author_id`: Clerk ID of the admin who created it
- `is_active`: Whether the phrase is active
- `created_at`: When the phrase was created
- `updated_at`: When the phrase was last updated

## Admin Panel Usage

### 1. Access Phrases Management

1. Go to the Admin Panel
2. Click on the "💭 Phrases" tab
3. You'll see the Phrases Management interface

### 2. Add New Phrases

1. In the "Add New Phrase" section, type your inspirational phrase
2. Click "Add Phrase" to save it
3. The phrase will be automatically set as active

### 3. Manage Existing Phrases

- **Edit**: Click the "Edit" button to modify phrase content
- **Activate/Deactivate**: Toggle phrase status with the respective buttons
- **Delete**: Remove phrases permanently (use with caution)

### 4. Bulk Upload

To add many phrases quickly:
1. Prepare your phrases in a text file
2. Copy and paste them one by one
3. Or use the edit feature to modify existing phrases

## User Experience

### 1. Daily Phrase Display

- Users see a different phrase each day in their profile
- The phrase changes automatically at midnight
- Same phrase is shown to all users on the same day
- Fallback to default phrase if no phrases are available

### 2. Phrase Selection Algorithm

- Uses day of year to select phrases
- Ensures consistent phrase per day across all users
- Rotates through all active phrases
- Handles cases where phrase count changes

## API Endpoints

### Admin Endpoints

- `GET /api/admin/phrases` - Fetch all phrases
- `POST /api/admin/phrases` - Create new phrase
- `PUT /api/admin/phrases/[id]` - Update phrase content
- `PATCH /api/admin/phrases/[id]` - Toggle phrase status
- `DELETE /api/admin/phrases/[id]` - Delete phrase

### User Endpoints

- `GET /api/user/daily-phrase` - Get today's phrase for user

## Example Phrases

Here are some example phrases you can add:

1. "Every day is a new beginning. Embrace the journey ahead."
2. "Your thoughts create your reality. Choose them wisely."
3. "The only way to do great work is to love what you do."
4. "Success is not final, failure is not fatal: it is the courage to continue that counts."
5. "The mind is everything. What you think you become."
6. "Peace comes from within. Do not seek it without."
7. "Happiness is not something ready-made. It comes from your own actions."
8. "The greatest glory in living lies not in never falling, but in rising every time we fall."
9. "Life is what happens when you're busy making other plans."
10. "The future belongs to those who believe in the beauty of their dreams."

## Troubleshooting

### Common Issues

1. **Phrases not showing**: Check if phrases are marked as active
2. **Same phrase every day**: Ensure you have multiple active phrases
3. **Migration errors**: Verify DATABASE_URL is correct
4. **Permission errors**: Ensure user has admin access

### Best Practices

1. **Keep phrases positive and inspiring**
2. **Maintain variety in phrase length and style**
3. **Regularly review and update phrases**
4. **Test the system with multiple phrases before going live**

## Security Notes

- Only authenticated admins can manage phrases
- User endpoints require valid authentication
- Phrase content is sanitized before storage
- No sensitive information should be stored in phrases

## Future Enhancements

Potential improvements for the phrases system:
- Phrase categories (motivation, wisdom, health, etc.)
- Scheduled phrase publishing
- User feedback on phrases
- Phrase analytics and popularity metrics
- Multi-language support
- Phrase sharing functionality
