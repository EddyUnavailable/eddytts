"use client";
import React, { useState } from "react";
import { useAudioPlayer } from "./AudioPlayerContext";

const AudioControlPanel = () => {
  const { pause, resume, stop, setVolume, isPlaying } = useAudioPlayer();
  const [volume, setVolumeState] = useState(1);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume);
  };

  return (
    <div style={{ 
      position: 'fixed', bottom: 60, left: 10, 
      backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', 
      borderRadius: '8px', zIndex: 1000 
    }}>
      <div>
        <button onClick={isPlaying ? pause : resume}>
          {isPlaying ? "Pause" : "Resume"}
        </button>
        <button onClick={stop} style={{ marginLeft: '10px' }}>
          Stop
        </button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label htmlFor="volume">Volume: </label>
        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default AudioControlPanel;
