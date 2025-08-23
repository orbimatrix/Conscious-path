import { NextResponse } from 'next/server';
import VimeoService from '../../../../lib/vimeo';

export async function GET() {
  try {
    const vimeoService = new VimeoService();
    const userInfo = await vimeoService.getUserInfo();
    
    return NextResponse.json(userInfo);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch user info',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}