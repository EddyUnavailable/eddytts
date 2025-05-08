"use client";
import React, { useState } from "react";
import { useAudioPlayer } from "./AudioPlayerContext";
import '../css/generatedAudio.module.css'; // Import the CSS file

const AudioControlPanel = () => {
  const { pause, resume, stop, setVolume, isPlaying } = useAudioPlayer();
  const [volume, setVolumeState] = useState(1);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume);
  };

  return (
    <div className="audioControlPanel">
      <div>
        <button onClick={isPlaying ? pause : resume}>
          {isPlaying ? "Pause" : "Resume"}
        </button>
        <button onClick={stop} className="stopButton">
          Stop
        </button>
      </div>
      <div className="volumeControl">
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
