'use client';
import AudioPlayer from '@/components/AudioPlayer';
import { useState, useEffect } from 'react';

interface AudioFile {
  name: string;
  url: string;
  size: number;
}

export default function AudiosPage() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAudios = async () => {
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
          url: `http://162.254.35.178:3003${f.url}` // full URL
        }));
        setAudioFiles(filesWithUrl);
      }
    } catch (err) {
      console.error("Error fetching audios:", err);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchAudios();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAudios, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading audios...</div>;

  return (
    <div className="audios-container">
      <h1>Audio Library</h1>
      <div className="audio-list">
        {audioFiles.map((audio) => (
          <AudioPlayer key={audio.name} audio={audio} />
        ))}
      </div>
    </div>
  );
}