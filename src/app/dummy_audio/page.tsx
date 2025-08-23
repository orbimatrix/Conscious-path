'use client';
import AudioPlayer from '@/components/AudioPlayer';
import { useState, useEffect, useCallback } from 'react';
import { VimeoVideo } from '../types/vimeo';

interface AudioFile {
  name: string;
  url: string;
  size: number;
}

export default function AudiosPage() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [videos, setVideos] = useState<VimeoVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VimeoVideo | null>(null);

  const fetchAudios = useCallback(async () => {
    setLoading(true);
    try {
      const username = "admin";
      const password = "6cG59n4C4rNw7LAdHy";
  
      const res = await fetch("https://audio.sendaconsciente.com/list-audios", {
        headers: {
          "Authorization": "Basic " + btoa(`${username}:${password}`),
        },
      });
  
      const data = await res.json();
  
      if (data.success) {
        const filesWithUrl = data.files.map((f: any) => ({
          ...f,
          url: `https://audio.sendaconsciente.com${f.url}` // full URL
        }));
        setAudioFiles(filesWithUrl);
      }
    } catch (err) {
      console.error("Error fetching audios:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/vimeo/videos');
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.videos || []);
      } else {
        setError(data.error || 'Failed to fetch videos');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  }, []);
  
  

  useEffect(() => {
    fetchAudios();
    fetchVideos();
    
    // Removed auto-refresh to prevent interruptions during video playback
    // If you need auto-refresh, consider making it much less frequent (e.g., every 5 minutes)
  }, [fetchAudios, fetchVideos]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  if (loading) return <div>Loading audios...</div>;

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Videos</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchVideos}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Videos Found</h3>
          <p className="text-gray-600">You don&apos;t have any videos in your Vimeo account yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="audios-container">
      <h1>Audio Library</h1>
      <div className="audio-list">
        {audioFiles.map((audio) => (
          <AudioPlayer key={audio.name} audio={audio} />
        ))}
      </div>

      <div className="space-y-8">
      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.uri}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedVideo(video)}
          >
            {/* Video Thumbnail */}
            <div className="relative">
              <img
                src={video.pictures?.sizes?.[3]?.link || video.pictures?.sizes?.[0]?.link || '/placeholder-video.jpg'}
                alt={video.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-video.jpg';
                }}
              />
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                {video.name}
              </h3>
              {video.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {video.description}
                </p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{formatDate(video.created_time)}</span>
                {video.stats?.plays && (
                  <span>{video.stats.plays} plays</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedVideo.name}</h2>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Video Player */}
              <div className="mb-6">
                <iframe
                  src={`https://player.vimeo.com/video/${selectedVideo.uri.split('/').pop()}?h=auto&autoplay=0`}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>

              {/* Video Details */}
              <div className="space-y-4">
                {selectedVideo.description && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedVideo.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Created:</span>
                    <span className="ml-2 text-gray-600">
                      {formatDate(selectedVideo.created_time)}
                    </span>
                  </div>
                  {/* {selectedVideo.duration && (
                    <div>
                      <span className="font-medium text-gray-700">Duration:</span>
                      <span className="ml-2 text-gray-600">
                        {formatDuration(selectedVideo.duration)}
                      </span>
                    </div>
                  )} */}
                  {selectedVideo.stats?.plays && (
                    <div>
                      <span className="font-medium text-gray-700">Plays:</span>
                      <span className="ml-2 text-gray-600">{selectedVideo.stats.plays}</span>
                    </div>
                  )}
                  {(selectedVideo.stats as any)?.likes && (
                    <div>
                      <span className="font-medium text-gray-700">Likes:</span>
                      <span className="ml-2 text-gray-600">{(selectedVideo.stats as any).likes}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <a
                    href={selectedVideo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    View on Vimeo
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    
  );
}