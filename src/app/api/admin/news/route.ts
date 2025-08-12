import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin';
import { db } from '@/lib/db';
import { news } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Public endpoint - no authentication required for reading news
    // Fetch all news ordered by creation date (newest first)
    const allNews = await db
      .select()
      .from(news)
      .orderBy(desc(news.createdAt));

    return NextResponse.json({ news: allNews });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, targetUserId } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Create news item using Drizzle with proper validation
    const [createdNews] = await db
      .insert(news)
      .values({
        title: title.trim(),
        content: content.trim(),
        authorId: adminUser.id,
        targetUserId: targetUserId || null,
      })
      .returning();

    if (!createdNews) {
      return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
    }

    return NextResponse.json({ news: createdNews }, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
