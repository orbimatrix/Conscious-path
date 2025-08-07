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
        console.log('Received update data:', body);
        const { 
            clerkId, 
            birthDate, 
            city, 
            telegram, 
            signal, 
            username, 
            points, 
            lastDailyClaim 
        } = body;

        if (!clerkId) {
            return NextResponse.json({ error: 'Clerk ID required' }, { status: 400 });
        }

        // Build update object with only provided fields
        const updateData: any = {};
        
        if (birthDate !== undefined) updateData.birthDate = birthDate;
        if (city !== undefined) updateData.city = city;
        if (telegram !== undefined) updateData.telegram = telegram;
        if (signal !== undefined) updateData.signal = signal;
        if (username !== undefined) updateData.username = username;
        if (points !== undefined) updateData.points = points;
        if (lastDailyClaim !== undefined) {
            // Ensure lastDailyClaim is properly formatted for the database
            updateData.lastDailyClaim = new Date(lastDailyClaim);
        }

        // Check if we have any data to update
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No values to set' }, { status: 400 });
        }

        console.log('Updating with data:', updateData);

        // Update user data
        const updatedUser = await db
            .update(users)
            .set(updateData)
            .where(eq(users.clerkId, clerkId))
            .returning();

        return NextResponse.json(updatedUser[0]);
    } catch (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
