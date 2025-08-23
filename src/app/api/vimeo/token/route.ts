import { NextRequest, NextResponse } from 'next/server';

const VIMEO_CLIENT_ID = process.env.VIMEO_CLIENT_ID;
const VIMEO_CLIENT_SECRET = process.env.VIMEO_CLIENT_SECRET;
const VIMEO_REDIRECT_URI = process.env.VIMEO_REDIRECT_URI || 'http://localhost:3000/api/auth/vimeo/callback';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    if (!VIMEO_CLIENT_ID || !VIMEO_CLIENT_SECRET) {
      return NextResponse.json({ error: 'Vimeo app credentials not configured' }, { status: 500 });
    }

    console.log('🔍 Debug Info:');
    console.log('Client ID:', VIMEO_CLIENT_ID);
    console.log('Redirect URI:', VIMEO_REDIRECT_URI);
    console.log('Code received:', code.substring(0, 10) + '...');

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.vimeo.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${VIMEO_CLIENT_ID}:${VIMEO_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.vimeo.*+json;version=3.4'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: VIMEO_REDIRECT_URI
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange failed:', errorData);
      return NextResponse.json({ 
        error: 'Failed to exchange code for token',
        details: errorData
      }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();
    
    return NextResponse.json({
      success: true,
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      scope: tokenData.scope,
      user: tokenData.user
    });

  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json({ error: 'Token exchange failed' }, { status: 500 });
  }
}
