"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAudioPlayer } from "./AudioPlayerContext";
import styles from '../css/audio.module.css';

const AudioControlPanel = ({ showProgress = true }) => {
  const { 
    pause, 
    resume, 
    stop, 
    resetAudio, // Access resetAudio function
    setVolume, 
    isPlaying, 
    currentAudio, 
    isLoading, 
    error,
    getCurrentTime,
    getDuration,
    seekTo
  } = useAudioPlayer();
  
  const [volume, setVolumeState] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressTimerRef = useRef(null);

  // Handle volume change from the slider
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume);
  };

  // Handle seeking when user moves the progress slider
  const handleProgressChange = (e) => {
    const newPosition = parseFloat(e.target.value);
    seekTo(newPosition);
  };

  // Format time in seconds to MM:SS format
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Update progress and duration periodically while playing
  useEffect(() => {
    if (isPlaying) {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      progressTimerRef.current = setInterval(() => {
        const currentTime = getCurrentTime();
        const totalDuration = getDuration();
        setProgress(currentTime);
        setDuration(totalDuration);
      }, 500); // Update every 500ms
    } else {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isPlaying, getCurrentTime, getDuration]);

  // Initial volume setup when audio changes
  useEffect(() => {
    if (currentAudio) {
      setVolume(volume);
    }
  }, [currentAudio, setVolume, volume]);

  const handleStop = () => {
    stop(); // Stop the audio
    resetAudio(); // Ensure the audio state is fully reset
  };

  return (
    <div className={styles.audioControlPanel}>
      {/* Player Controls */}
      <div className={styles.buttonControls}>
        <button 
          onClick={isPlaying ? pause : resume}
          disabled={!currentAudio || isLoading}
          className={styles.playPauseButton}
        >
          {isPlaying ? "Pause" : "Resume"}
        </button>
        <button 
          onClick={handleStop} // Call handleStop
          disabled={!currentAudio || isLoading}
          className={styles.stopButton}
        >
          Stop
        </button>
      </div>

      {/* Progress Bar */}
      {showProgress && currentAudio && (
        <div className={styles.progressContainer}>
          <span className={styles.timeDisplay}>{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={progress}
            onChange={handleProgressChange}
            className={styles.progressBar}
            disabled={isLoading || !currentAudio}
          />
          <span className={styles.timeDisplay}>{formatTime(duration)}</span>
        </div>
      )}

      {/* Volume Control */}
      <div className={styles.volumeControl}>
        <label htmlFor="volume">Volume: </label>
        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className={styles.volumeSlider}
        />
        <span className={styles.volumePercentage}>
          {(volume * 100).toFixed(0)}%
        </span>
      </div>

      {/* Status Indicators */}
      <div className={styles.statusContainer}>
        {isPlaying ? (
          <div className={styles.playingIndicator}>Now Playing</div>
        ) : (
          currentAudio && <div className={styles.pausedIndicator}>Paused</div>
        )}
        
        {isLoading && <div className={styles.loadingIndicator}>Loading...</div>}
        
        {error && (
          <div className={styles.errorMessage}>Error: {error}</div>
        )}
      </div>
    </div>
  );
};

export default AudioControlPanel;
