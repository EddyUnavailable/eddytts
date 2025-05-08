'use client';
import React, { useState } from 'react';
import styles from './css/main.module.css';
import VoiceListPreview from './components/VoiceListPreview';
import { AudioPlayerProvider } from './components/AudioPlayerContext';
import { useVoices } from './hooks/useVoices';
import AudioControlPanel from './components/GeneratedAudio';
import TextToSpeech from './components/TextToSpeech';
import { useFavorites } from './hooks/useFavorites';

export default function HomePage() {
  const { voices, loading, error } = useVoices();  // Voices fetched from API
  const { favorites, toggleFavorite } = useFavorites();  // Favorites and toggle functionality

  const [currentComponent, setCurrentComponent] = useState('VoiceList');

  const toggleComponent = () => {
    setCurrentComponent((prev) =>
      prev === 'TextToSpeech' ? 'VoiceList' : 'TextToSpeech'
    );
  };

  return (
    <AudioPlayerProvider>
      <div className={styles.container}>
        <div className={styles.leftPane}>
          <div className={styles.col}>Text-to-Speech apps temporarily disabled</div>
          <div className={styles.col}>
            <button onClick={toggleComponent}>
              Switch to {currentComponent === 'TextToSpeech' ? 'VoiceList' : 'TextToSpeech'}
            </button>
          </div>
          <TextToSpeech />
        </div>

        <div className={styles.middlePane}>
          <div className={styles.col}>
            <h4>Favourites</h4>
          </div>
          <ul>
            {favorites.length > 0 ? (
              favorites.map((voiceName) => {
                // Find the voice with the matching voiceName and use the formattedName
                const voice = voices.find((v) => v.name === voiceName);
                return (
                  <li key={voiceName}>
                    {voice ? voice.formattedName : voiceName}
                    <button onClick={() => toggleFavorite(voiceName)}>❌</button>
                  </li>
                );
              })
            ) : (
              <li>No favorites yet</li>
            )}
          </ul>
        </div>

        <div className={styles.rightPane}>
          <AudioControlPanel /> {/* Now above VoiceListPreview */}
          {loading && <p>Loading voices...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && (
            <VoiceListPreview
              voices={voices}
              favorites={favorites}
              toggleFavorite={toggleFavorite} // Pass toggleFavorite function
            />
          )}
        </div>
      </div>
    </AudioPlayerProvider>
  );
}
