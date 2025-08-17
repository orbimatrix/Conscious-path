import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fix: Await params for Next.js 15
    const { id: userId } = await params;

    // Fix: Call clerkClient() first to get the client instance
    const clerk = await clerkClient();
    
    try {
      const clerkUser = await clerk.users.getUser(userId);
      
      // Extract timezone data from unsafeMetadata
      const timezoneData = {
        timezone: clerkUser.unsafeMetadata?.timezone || null,
        timezoneOffset: clerkUser.unsafeMetadata?.timezoneOffset || null,
        timezoneUpdatedAt: clerkUser.unsafeMetadata?.timezoneUpdatedAt || null,
        previousTimezone: clerkUser.unsafeMetadata?.previousTimezone || null,
        timezoneHistory: clerkUser.unsafeMetadata?.timezoneHistory || []
      };

      return NextResponse.json({ timezoneData });
    } catch (clerkError: unknown) {
      if (clerkError && typeof clerkError === 'object' && 'status' in clerkError && clerkError.status === 404) {
        return NextResponse.json({ error: 'User not found in Clerk' }, { status: 404 });
      }
      throw clerkError;
    }
  } catch (error) {
    console.error('Error fetching user timezone data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
