export interface VimeoVideo {
    uri: string;
    name: string;
    description: string;
    duration: number;
    created_time: string;
    modified_time: string;
    release_time: string;
    pictures: {
      base_link: string;
      sizes: Array<{
        width: number;
        height: number;
        link: string;
      }>;
    };
    files?: Array<{
      quality: string;
      type: string;
      width: number;
      height: number;
      link: string;
      size: number;
    }>;
    player_embed_url: string;
    link: string;
    embed: {
      html: string;
    };
    stats: {
      plays: number;
    };
  }
  
  export interface VimeoResponse {
    total: number;
    page: number;
    per_page: number;
    paging: {
      next: string | null;
      previous: string | null;
      first: string;
      last: string;
    };
    data: VimeoVideo[];
  }
  
  export interface VimeoUser {
    uri: string;
    name: string;
    link: string;
    location: string;
    bio: string;
    created_time: string;
    pictures: {
      base_link: string;
      sizes: Array<{
        width: number;
        height: number;
        link: string;
      }>;
    };
    metadata: {
      connections: {
        videos: {
          total: number;
          uri: string;
        };
      };
    };
  }