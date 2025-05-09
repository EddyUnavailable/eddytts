import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const AudioPlayerContext = createContext();

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);

  const validateBase64 = (str) => {
    const regex = /^[A-Za-z0-9+/=]*$/;
    return (
      regex.test(str) &&
      (str.length % 4 === 0 || str.length % 4 === 2 || str.length % 4 === 3)
    );
  };

  const playBase64 = (base64) => {
    if (!base64) {
      setError('No audio data provided');
      return;
    }

    if (!validateBase64(base64)) {
      setError('Invalid Base64 audio data');
      return;
    }

    if (audioRef.current && currentAudio !== base64) {
      setIsLoading(true);
      setError(null);
      const audio = audioRef.current;
      audio.pause();
      audio.src = `data:audio/mpeg;base64,${base64}`;
      setCurrentAudio(base64);

      audio.oncanplay = () => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch(() => {
              setError('Playback failed');
              setIsLoading(false);
            });
        }
      };

      audio.onerror = () => {
        setError('Audio playback error');
        setIsLoading(false);
      };

      audio.load();
    }
  };

  const pause = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioRef.current && audioRef.current.paused && currentAudio) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            setError('Resume failed');
          });
      }
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setError(null);
    }
  };

  const setVolume = (volume) => {
    if (audioRef.current) {
      const vol = Math.min(1, Math.max(0, volume));
      audioRef.current.volume = vol;
    }
  };

  const getCurrentTime = () => {
    return audioRef.current ? audioRef.current.currentTime : 0;
  };

  const getDuration = () => {
    return audioRef.current ? audioRef.current.duration : 0;
  };

  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, audioRef.current.duration));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setError('Audio playback error');
      setIsPlaying(false);
      setIsLoading(false);
    };

    if (audio) {
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.pause();
        audio.src = '';
        setCurrentAudio(null);
        setIsPlaying(false);
      }
    };
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        playBase64,
        pause,
        resume,
        stop,
        setVolume,
        isPlaying,
        isLoading,
        error,
        currentAudio,
        getCurrentTime,
        getDuration,
        seekTo,
      }}
    >
      {children}
      <audio ref={audioRef} loop={false} />
    </AudioPlayerContext.Provider>
  );
}

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
