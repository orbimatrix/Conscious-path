import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { phrases } from '@/lib/db/schema';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all phrases ordered by creation date
    const allPhrases = await db
      .select()
      .from(phrases)
      .orderBy(phrases.createdAt);

    return NextResponse.json({ phrases: allPhrases });
  } catch (error) {
    console.error('Error fetching phrases:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Insert new phrase
    const [newPhrase] = await db
      .insert(phrases)
      .values({
        content: content.trim(),
        authorId: userId,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ phrase: newPhrase }, { status: 201 });
  } catch (error) {
    console.error('Error creating phrase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
