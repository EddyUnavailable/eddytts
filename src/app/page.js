'use client';
import React, { useState } from 'react';
import styles from './css/main.module.css';
import VoiceListPreview from './components/VoiceListPreview';
import { AudioPlayerProvider } from './components/AudioPlayerContext';
import { useVoices } from './hooks/useVoices';
import AudioControlPanel from "./components/GeneratedAudio";

export default function HomePage() {
  const [currentComponent, setCurrentComponent] = useState('VoiceList');
  const { voices, loading, error, favorites, toggleFavorite } = useVoices();

  const toggleComponent = () => {
    setCurrentComponent((prev) =>
      prev === 'TextToSpeech' ? 'VoiceList' : 'TextToSpeech'
    );
  };

  return (
    <AudioPlayerProvider>
      <div className={styles.container}>
        
        <div className={styles.leftPane}>
          <div className={styles.col}>Text-to-Speech apps temporarily disabled </div>
            <button onClick={toggleComponent}>
              Switch to {currentComponent === 'TextToSpeech' ? 'VoiceList' : 'TextToSpeech'}
            </button>
        </div>
        <div className={styles.middlePane}>
          <div className={styles.col}>
            <h4>Favourites</h4>
          </div>
          <ul>
            {favorites.length > 0 ? (
              favorites.map((voiceName) => (
                <li key={voiceName}>
                  {voiceName}
                  <button onClick={() => toggleFavorite(voiceName)}>❌</button>
                </li>
              ))
            ) : (
              <li>No favorites yet</li>
            )}
          </ul>
        </div>   
        
        <div className={styles.rightPane}>
          <AudioControlPanel /> {/* Now above VoiceListPreview */}

          {loading && <p>Loading voices...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && <VoiceListPreview voices={voices} />}
        </div>
      </div>
    </AudioPlayerProvider>
  );
}
