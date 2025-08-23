import axios from 'axios';
import { VimeoVideo, VimeoResponse, VimeoUser } from '../app/types/vimeo';

const VIMEO_API_BASE = 'https://api.vimeo.com';

class VimeoService {
  private accessToken: string;

  constructor(accessToken?: string) {
    // Use the new OAuth token directly
    this.accessToken = accessToken || '205f2fd703f0398da52600104600a1b0';
    if (!this.accessToken) {
      console.error('Vimeo access token is missing. Please authenticate with Vimeo first');
      throw new Error('Vimeo access token is required');
    }
    console.log('Vimeo service initialized with access token:', this.accessToken.substring(0, 10) + '...');
  }

  private getHeaders() {
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.vimeo.*+json;version=3.4'
    };
    console.log('Request headers:', headers);
    return headers;
  }

  // Test basic API connectivity
  async testConnection(): Promise<any> {
    try {
      
      
      const headers = this.getHeaders();
      
      // Try different endpoints to isolate the issue
      const response = await axios.get(`${VIMEO_API_BASE}/me`, {
        headers
      });
      return response.data;
    } catch (error: any) {
      console.error('Connection test failed:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
        
        // Try alternative endpoint if /me fails
        if (error.response.status === 401) {
          console.log('Trying alternative endpoint /users/me...');
          try {
            const altResponse = await axios.get(`${VIMEO_API_BASE}/users/me`, {
              headers: this.getHeaders()
            });
            console.log('Alternative endpoint successful:', altResponse.status);
            return altResponse.data;
          } catch (altError: any) {
            console.error('Alternative endpoint also failed:', altError.response?.data);
            throw altError;
          }
        }
      }
      throw error;
    }
  }

  // Test public endpoint (no auth required)
  async testPublicEndpoint(): Promise<any> {
    try {
      console.log('Testing public Vimeo endpoint...');
      const response = await axios.get(`${VIMEO_API_BASE}/categories`, {
        headers: {
          'Accept': 'application/vnd.vimeo.*+json;version=3.4'
        }
      });
      console.log('Public endpoint successful:', response.status);
      return response.data;
    } catch (error: any) {
      console.error('Public endpoint test failed:', error);
      throw error;
    }
  }

  // Test what your current token can access
  async testTokenCapabilities(): Promise<any> {
    try {
      console.log('Testing token capabilities...');
      console.log('🔍 Diagnosing token type...');
      
      // Test public data (should work with any valid token)
      try {
        const publicResponse = await axios.get(`${VIMEO_API_BASE}/categories`, {
          headers: this.getHeaders()
        });
        console.log('✅ Token can access public data:', publicResponse.status);
      } catch (error: any) {
        console.log('❌ Token cannot access public data');
        if (error.response?.status === 401) {
          console.log('🚨 CRITICAL: Token is completely invalid or expired!');
        }
      }
      
      // Test user data (only works with user-generated tokens)
      try {
        const userResponse = await axios.get(`${VIMEO_API_BASE}/me`, {
          headers: this.getHeaders()
        });
        console.log('✅ Token can access user data:', userResponse.status);
        console.log('🎉 SUCCESS: You have a User-Generated Access Token!');
        return userResponse.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.log('❌ Token cannot access user data');
          console.log('🔍 This suggests you have a Client Credentials token');
          console.log('📋 SOLUTION: Generate a User-Generated Access Token instead');
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Token capability test failed:', error);
      throw error;
    }
  }

  // Get user info
  async getUserInfo(userId?: string): Promise<VimeoUser> {
    try {
      const endpoint = userId ? `/users/${userId}` : '/me';
      const response = await axios.get(`${VIMEO_API_BASE}${endpoint}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  // Get all videos from user account
  async getUserVideos(
    userId?: string,
    page: number = 1,
    perPage: number = 25,
    sort: string = 'date',
    direction: string = 'desc'
  ): Promise<VimeoResponse> {
    try {
      const endpoint = userId ? `/users/${userId}/videos` : '/me/videos';
      const params = {
        page,
        per_page: perPage,
        sort,
        direction,
        fields: 'uri,name,description,duration,created_time,modified_time,release_time,pictures,player_embed_url,link,embed,stats'
      };

      const response = await axios.get(`${VIMEO_API_BASE}${endpoint}`, {
        headers: this.getHeaders(),
        params
      });

      return response.data;
    } catch (error: any) {
      console.error('Error fetching videos:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      }
      throw error;
    }
  }

  // Get specific video details
  async getVideo(videoId: string): Promise<VimeoVideo> {
    try {
      const response = await axios.get(`${VIMEO_API_BASE}/videos/${videoId}`, {
        headers: this.getHeaders(),
        params: {
          fields: 'uri,name,description,duration,created_time,modified_time,release_time,pictures,player_embed_url,link,embed,stats'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  }

  // Search videos in user's account
  async searchUserVideos(
    query: string,
    userId?: string,
    page: number = 1,
    perPage: number = 25
  ): Promise<VimeoResponse> {
    try {
      const endpoint = userId ? `/users/${userId}/videos` : '/me/videos';
      const params = {
        query,
        page,
        per_page: perPage,
        fields: 'uri,name,description,duration,created_time,modified_time,release_time,pictures,player_embed_url,link,embed,stats'
      };

      const response = await axios.get(`${VIMEO_API_BASE}${endpoint}`, {
        headers: this.getHeaders(),
        params
      });

      return response.data;
    } catch (error) {
      console.error('Error searching videos:', error);
      throw error;
    }
  }
}

export default VimeoService;