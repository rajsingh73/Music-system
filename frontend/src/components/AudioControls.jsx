import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const AudioControls = ({ track }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const setupAudio = async () => {
      if (track && track.trackId) {
        try {
          console.log('Setting up audio for track:', track.title || track.trackId);

          let audioSrc = '';

          // For tracks with direct previewUrl (from our local collection)
          if (track.previewUrl) {
            console.log('Using direct preview URL from track object');
            audioSrc = track.previewUrl;
          } else {
            // For API tracks, fetch from our backend
            const token = localStorage.getItem('token');
            if (!token) {
              console.error('No token found for streaming');
              return;
            }
            const config = {
              headers: {
                'x-auth-token': token,
              },
            };

            console.log('Fetching stream URL for track:', track.trackId);
            const res = await axios.get(`http://localhost:5000/api/stream/${track.trackId}`, config);

            if (res.data.previewUrl) {
              console.log('Got preview URL from API:', res.data.previewUrl);
              audioSrc = res.data.previewUrl;
            } else {
              console.error('No preview URL found in response');
              return;
            }
          }

          // Set up audio element
          audioRef.current.src = audioSrc;
          audioRef.current.volume = volume;
          audioRef.current.load();

          // Add event listeners for better UX
          audioRef.current.addEventListener('loadeddata', () => {
            console.log('Audio loaded successfully');
          });

          audioRef.current.addEventListener('error', (e) => {
            console.error('Audio loading error:', e);
          });

          setIsPlaying(false); // Don't auto-play, wait for user interaction

        } catch (error) {
          console.error('Error setting up audio:', error);
          setIsPlaying(false);
        }
      } else {
        setIsPlaying(false);
      }
    };
    setupAudio();
  }, [track, volume]);

  const togglePlayPause = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
          console.log('Audio paused');
        } else {
          console.log('Attempting to play audio...');
          // Ensure we have user interaction before playing
          const playPromise = audioRef.current.play();

          if (playPromise !== undefined) {
            playPromise.then(() => {
              setIsPlaying(true);
              console.log('Audio started playing successfully');
            }).catch(error => {
              console.error("Audio play failed:", error);
              setIsPlaying(false);
              alert('Audio failed to play. This might be due to browser security policies. Try clicking the play button again.');
            });
          }
        }
      } catch (error) {
        console.error("Error toggling audio:", error);
        setIsPlaying(false);
        alert('Unable to play audio. Please try again.');
      }
    } else {
      console.error('Audio element not available');
      alert('Audio player not ready. Please try selecting the track again.');
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  if (!track) return null; // Don't render if no track is selected

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#282828] p-4 shadow-2xl flex items-center justify-between z-50 border-t border-gray-700">
      <audio
        ref={audioRef}
        preload="metadata"
        controls={false}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      /> {/* Hidden audio element */}
      <div className="flex items-center space-x-4 flex-grow-0">
        {track.albumArt && (
          <img src={track.albumArt} alt="Album Art" className="w-14 h-14 rounded-md object-cover shadow-md" />
        )}
        <div>
          <h3 className="text-lg font-bold text-white truncate w-40 sm:w-60">{track.title}</h3>
          <p className="text-[#B3B3B3] text-sm truncate w-40 sm:w-60">{track.artist}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 flex-grow justify-center">
        <button
          onClick={togglePlayPause}
          className="bg-[#1DB954] hover:bg-green-600 text-white font-bold p-3 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-110"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7.5 8h1v4h-1V8zm4 0h1v4h-1V8z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.53 7.116A.75.75 0 0110 7h.47a.75.75 0 01.465.733l.169 3.05a.75.75 0 01-1.498.077l-.116-2.1L9 11.233a.75.75 0 01-1.498-.077l.169-3.05a.75.75 0 01.465-.733z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 sm:w-32 lg:w-48 xl:w-64 accent-[#1DB954]"
        />
      </div>

      <div className="flex items-center space-x-4 flex-grow-0">
        {/* Placeholder for duration/progress if needed */}
        <p className="text-[#B3B3B3] text-sm">{track.collectionName}</p>
      </div>
    </div>
  );
};

export default AudioControls;

