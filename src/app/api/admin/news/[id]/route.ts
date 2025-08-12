import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin';
import { db } from '@/lib/db';
import { news } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newsId = parseInt(params.id);
    if (isNaN(newsId)) {
      return NextResponse.json({ error: 'Invalid news ID' }, { status: 400 });
    }

    // Delete news item
    const deletedNews = await db
      .delete(news)
      .where(eq(news.id, newsId))
      .returning();

    if (deletedNews.length === 0) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, news: deletedNews[0] });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
