import { NextRequest, NextResponse } from 'next/server';
import VimeoService from '../../../../lib/vimeo';

export async function GET(request: NextRequest) {
  try {
    const vimeoService = new VimeoService();
    const { searchParams } = new URL(request.url);
    
    const page = Number(searchParams.get('page')) || 1;
    const per_page = Number(searchParams.get('per_page')) || 25;
    const sort = searchParams.get('sort') || 'date';
    const direction = searchParams.get('direction') || 'desc';
    const search = searchParams.get('search');

    let result;
    if (search) {
      result = await vimeoService.searchUserVideos(
        search,
        undefined,
        page,
        per_page
      );
    } else {
      result = await vimeoService.getUserVideos(
        undefined,
        page,
        per_page,
        sort,
        direction
      );
    }

    return NextResponse.json({
      success: true,
      videos: result.data || [],
      total: result.total || 0,
      page: result.page || page,
      per_page: result.per_page || per_page
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch videos',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}