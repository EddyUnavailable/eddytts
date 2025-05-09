"use client";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import styles from '../css/audioControlPanel.module.css';

const AudioPlayerContext = createContext();

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);

  const validateBase64 = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch {
      return false;
    }
  };

  const playBase64 = (base64) => {
    if (!validateBase64(base64)) {
      setError("Invalid Base64 audio data");
      return;
    }

    if (audioRef.current) {
      setIsLoading(true);
      setError(null);
      const audio = audioRef.current;

      audio.pause();
      audio.src = `data:audio/mpeg;base64,${base64}`;
      setCurrentAudio(base64);
      audio.load();

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            setError("Audio playback failed");
            console.error("Playback error:", err);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  };

  const pause = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioRef.current && audioRef.current.paused) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            setError("Resume failed");
            console.error("Resume error:", err);
          });
      }
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const setVolume = (volume) => {
    if (audioRef.current) {
      const vol = Math.min(1, Math.max(0, volume)); // Clamp between 0 and 1
      audioRef.current.volume = vol;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => setIsPlaying(false);
    const handleError = () => setError("Audio playback error");

    if (audio) {
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      }
    };
  }, []);

  return (
    <AudioPlayerContext.Provider value={{
      playBase64,
      pause,
      resume,
      stop,
      setVolume,
      isPlaying,
      isLoading,
      error,
      currentAudio,
    }}>
      {children}
      {/* Only render audio player when there is an audio to play */}
      {currentAudio && (
        <div className={styles.audioPlayerContainer}>
          <audio ref={audioRef} controls>
            <source src={`data:audio/mpeg;base64,${currentAudio}`} type="audio/mpeg" />
          </audio>
        </div>
      )}
    </AudioPlayerContext.Provider>
  );
}

export const useAudioPlayer = () => useContext(AudioPlayerContext);
