'use client';
import React, { useState } from 'react';
import styles from './css/layout.module.css';
import VoiceListPreview from './components/VoiceListPreview';
import { AudioPlayerProvider } from './components/AudioPlayerContext';
import { useVoices } from './hooks/useVoices';
import AudioControlPanel from "./components/GeneratedAudio";

export default function HomePage() {
  const [currentComponent, setCurrentComponent] = useState('VoiceList');
  const { voices, loading, error } = useVoices();

  const toggleComponent = () => {
    setCurrentComponent((prev) =>
      prev === 'TextToSpeech' ? 'VoiceList' : 'TextToSpeech'
    );
  };

  return (
    <AudioPlayerProvider>
      <div className={styles.container}>
        {/* Left Pane: Component switcher (TextToSpeech/SSMLTextToSpeech) - temporarily disabled */}
        <div className={styles.leftPane}>
          <h2>Text-to-Speech apps temporarily disabled</h2>
          <button onClick={toggleComponent}>
            Switch to {currentComponent === 'TextToSpeech' ? 'VoiceList' : 'TextToSpeech'}
          </button>
        </div>
        <AudioControlPanel />
        {/* Right Pane: VoiceListPreview */}
        <div className={styles.rightPane}>
          {loading && <p>Loading voices...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && <VoiceListPreview voices={voices} />}
        </div>
      </div>
    </AudioPlayerProvider>
  );
}
