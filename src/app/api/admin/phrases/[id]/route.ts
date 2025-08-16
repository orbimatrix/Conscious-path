import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { phrases } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const phraseId = parseInt(id);
    if (isNaN(phraseId)) {
      return NextResponse.json({ error: 'Invalid phrase ID' }, { status: 400 });
    }

    const { content } = await request.json();

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Update phrase
    const [updatedPhrase] = await db
      .update(phrases)
      .set({
        content: content.trim(),
        updatedAt: new Date(),
      })
      .where(eq(phrases.id, phraseId))
      .returning();

    if (!updatedPhrase) {
      return NextResponse.json({ error: 'Phrase not found' }, { status: 404 });
    }

    return NextResponse.json({ phrase: updatedPhrase });
  } catch (error) {
    console.error('Error updating phrase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const phraseId = parseInt(id);
    if (isNaN(phraseId)) {
      return NextResponse.json({ error: 'Invalid phrase ID' }, { status: 400 });
    }

    const { isActive } = await request.json();

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive must be a boolean' },
        { status: 400 }
      );
    }

    // Update phrase status
    const [updatedPhrase] = await db
      .update(phrases)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(phrases.id, phraseId))
      .returning();

    if (!updatedPhrase) {
      return NextResponse.json({ error: 'Phrase not found' }, { status: 404 });
    }

    return NextResponse.json({ phrase: updatedPhrase });
  } catch (error) {
    console.error('Error updating phrase status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const phraseId = parseInt(id);
    if (isNaN(phraseId)) {
      return NextResponse.json({ error: 'Invalid phrase ID' }, { status: 400 });
    }

    // Delete phrase
    const [deletedPhrase] = await db
      .delete(phrases)
      .where(eq(phrases.id, phraseId))
      .returning();

    if (!deletedPhrase) {
      return NextResponse.json({ error: 'Phrase not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Phrase deleted successfully' });
  } catch (error) {
    console.error('Error deleting phrase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
