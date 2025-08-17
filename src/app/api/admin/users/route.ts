import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  try {
    // Verify admin access
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all users
    const allUsers = await db.select().from(users);

    const clerk = await clerkClient();
    const usersWithProfiles = await Promise.all(
      allUsers.map(async (user) => {
        try {
          // Get Clerk user by email
          const clerkUsers = await clerk.users.getUserList({
            emailAddress: [user.email || ''],
            limit: 1
          });
          
          const clerkUser = clerkUsers.data[0];
          return {
            ...user,
            clerkProfile: clerkUser ? {
              imageUrl: clerkUser.imageUrl,
              firstName: clerkUser.firstName,
              lastName: clerkUser.lastName
            } : null
          };
        } catch (error) {
          console.error(`Error fetching Clerk profile for user ${user.id}:`, error);
          return {
            ...user,
            clerkProfile: null
          };
        }
      })
    );


    return NextResponse.json({ users: usersWithProfiles });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
