import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        console.log('userId', userId);  
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const clerkId = searchParams.get('clerkId');

        if (!clerkId) {
            return NextResponse.json({ error: 'Clerk ID required' }, { status: 400 });
        }

        let userData = await db
            .select()
            .from(users)
            .where(eq(users.clerkId, clerkId))
            .limit(1);

        // If user doesn't exist, create a new record
        if (userData.length === 0) {
            console.log('Creating new user record for clerkId:', clerkId);
            const newUser = await db
                .insert(users)
                .values({
                    clerkId: clerkId,
                    points: 0,
                    level: 'inmortal',
                    isActive: true,
                })
                .returning();
            
            userData = newUser;
        }

        return NextResponse.json(userData[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { clerkId, birthDate, city, telegram, signal, username } = body;

        if (!clerkId) {
            return NextResponse.json({ error: 'Clerk ID required' }, { status: 400 });
        }

        // Update user data
        const updatedUser = await db
            .update(users)
            .set({
                birthDate,
                city,
                telegram,
                signal,
                username,
            })
            .where(eq(users.clerkId, clerkId))
            .returning();

        return NextResponse.json(updatedUser[0]);
    } catch (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
