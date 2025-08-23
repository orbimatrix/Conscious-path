import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { phrases } from '@/lib/db/schema';
import { and, eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get today's date for consistent daily phrase selection
    const today = new Date();
    
    // Get the number of active phrases
    const activePhrasesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(phrases)
      .where(eq(phrases.isActive, true));

    const totalActivePhrases = activePhrasesResult[0]?.count || 0;

    if (totalActivePhrases === 0) {
      return NextResponse.json({ 
        phrase: "Every day is a new beginning. Embrace the journey ahead.",
        isDefault: true 
      });
    }

    // Use the day of year to select a phrase (ensures same phrase for same day)
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    
    // Select phrase based on day of year modulo total phrases
    const phraseIndex = dayOfYear % totalActivePhrases;
    
    // Get the phrase at the calculated index
    const dailyPhrase = await db
      .select()
      .from(phrases)
      .where(and(
        eq(phrases.isActive, true)
      ))
      .orderBy(phrases.createdAt)
      .limit(1)
      .offset(phraseIndex);

    if (dailyPhrase.length === 0) {
      return NextResponse.json({ 
        phrase: "Every day is a new beginning. Embrace the journey ahead.",
        isDefault: true 
      });
    }

    return NextResponse.json({ 
      phrase: dailyPhrase[0].content,
      isDefault: false,
      phraseId: dailyPhrase[0].id
    });
  } catch (error) {
    console.error('Error fetching daily phrase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
