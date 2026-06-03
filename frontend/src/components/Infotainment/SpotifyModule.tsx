import { useState, useEffect } from 'react';
import type { MediaState } from '../../types/vehicle.types';
import './SpotifyModule.css';

interface SpotifyModuleProps {
  platform: 'spotify' | 'youtube';
}

export default function SpotifyModule({ platform }: SpotifyModuleProps) {
  const [mediaState, setMediaState] = useState<MediaState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMediaStatus();
    // Set platform
    if (mediaState && mediaState.platform !== platform) {
      setPlatform(platform);
    }
  }, [platform]);

  const fetchMediaStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/media/status');
      const data = await response.json();
      if (data.success) {
        setMediaState(data.state);
      }
    } catch (error) {
      console.error('Error fetching media status:', error);
    } finally {
      setLoading(false);
    }
  };

  const setPlatform = async (newPlatform: 'spotify' | 'youtube') => {
    try {
      const response = await fetch('http://localhost:5000/api/media/platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: '5YJ3E1EA1KF000001', platform: newPlatform })
      });
      const data = await response.json();
      if (data.success) {
        setMediaState(data.state);
      }
    } catch (error) {
      console.error('Error setting platform:', error);
    }
  };

  const playMedia = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/media/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: '5YJ3E1EA1KF000001' })
      });
      const data = await response.json();
      if (data.success) {
        setMediaState(data.state);
      }
    } catch (error) {
      console.error('Error playing media:', error);
    }
  };

  const pauseMedia = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/media/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: '5YJ3E1EA1KF000001' })
      });
      const data = await response.json();
      if (data.success) {
        setMediaState(data.state);
      }
    } catch (error) {
      console.error('Error pausing media:', error);
    }
  };

  const nextTrack = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/media/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: '5YJ3E1EA1KF000001' })
      });
      const data = await response.json();
      if (data.success) {
        setMediaState(data.state);
      }
    } catch (error) {
      console.error('Error skipping track:', error);
    }
  };

  const previousTrack = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/media/previous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: '5YJ3E1EA1KF000001' })
      });
      const data = await response.json();
      if (data.success) {
        setMediaState(data.state);
      }
    } catch (error) {
      console.error('Error going to previous track:', error);
    }
  };

  const volumeUp = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/media/volume/up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: '5YJ3E1EA1KF000001', amount: 5 })
      });
      const data = await response.json();
      if (data.success) {
        setMediaState(data.state);
      }
    } catch (error) {
      console.error('Error increasing volume:', error);
    }
  };

  const volumeDown = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/media/volume/down', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: '5YJ3E1EA1KF000001', amount: 5 })
      });
      const data = await response.json();
      if (data.success) {
        setMediaState(data.state);
      }
    } catch (error) {
      console.error('Error decreasing volume:', error);
    }
  };

  if (loading || !mediaState) {
    return <div className="media-loading">Loading...</div>;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="spotify-module">
      <div className="media-header">
        <span className="platform-icon">{platform === 'spotify' ? '🎵' : '▶️'}</span>
        <h2>{platform === 'spotify' ? 'Spotify' : 'YouTube Music'}</h2>
        <span className={`status-badge ${mediaState.is_playing ? 'playing' : 'paused'}`}>
          {mediaState.status}
        </span>
      </div>

      <div className="album-art">
        <div className="album-placeholder">
          {platform === 'spotify' ? '🎵' : '▶️'}
        </div>
      </div>

      <div className="track-info">
        <h3 className="track-title">{mediaState.current_song}</h3>
        <p className="track-artist">{mediaState.artist}</p>
        <p className="track-album">{mediaState.album}</p>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(mediaState.position / mediaState.duration) * 100}%` }}></div>
      </div>
      <div className="time-display">
        <span>{formatTime(mediaState.position)}</span>
        <span>{formatTime(mediaState.duration)}</span>
      </div>

      <div className="media-controls">
        <button className="control-button" onClick={previousTrack}>⏮️</button>
        <button className="control-button play-button" onClick={mediaState.is_playing ? pauseMedia : playMedia}>
          {mediaState.is_playing ? '⏸️' : '▶️'}
        </button>
        <button className="control-button" onClick={nextTrack}>⏭️</button>
      </div>

      <div className="volume-control">
        <span className="volume-icon">🔊</span>
        <div className="volume-bar">
          <div className="volume-fill" style={{ width: `${mediaState.volume}%` }}></div>
        </div>
        <span className="volume-text">{mediaState.volume}%</span>
        <div className="volume-buttons">
          <button className="volume-btn" onClick={volumeDown}>−</button>
          <button className="volume-btn" onClick={volumeUp}>+</button>
        </div>
      </div>

      <div className="media-footer">
        <div className="info-row">
          <span className="info-label">Platform:</span>
          <span className="info-value">{platform}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Connection:</span>
          <span className="info-value status-connected">Connected</span>
        </div>
      </div>
    </div>
  );
}
