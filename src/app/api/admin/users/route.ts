import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { clerkClient } from '@clerk/nextjs/server';
import { eq, or, ilike, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin (you'll need to implement this check)
    // const isAdmin = await checkIfAdmin(userId);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const { searchParams } = new URL(request.url);
    const allianceFilter = searchParams.get('alliance');
    const searchTerm = searchParams.get('search');

    // Build all conditions at once
    const conditions = [];
    
    if (allianceFilter === 'requested') {
      conditions.push(eq(users.allianceRequested, true));
    } else if (allianceFilter === 'not-requested') {
      conditions.push(eq(users.allianceRequested, false));
    }

    if (searchTerm) {
      conditions.push(
        or(
          ilike(users.fullName, `%${searchTerm}%`),
          ilike(users.email, `%${searchTerm}%`),
          ilike(users.username, `%${searchTerm}%`)
        )
      );
    }

    // Execute query with all conditions
    const allUsers = conditions.length > 0 
      ? await db.select().from(users).where(and(...conditions))
      : await db.select().from(users);

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
