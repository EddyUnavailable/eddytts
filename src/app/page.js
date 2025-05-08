'use client';
import React, { useState, useEffect } from 'react';
import styles from './css/main.module.css';
import VoiceListPreview from './components/VoiceListPreview';
import { AudioPlayerProvider } from './components/AudioPlayerContext';
import { useVoices } from './hooks/useVoices';
import AudioControlPanel from './components/GeneratedAudio';
import TextToSpeech from './components/TextToSpeech';
import SSMLTextToSpeech from './components/SSMLTextToSpeech';
import { useFavorites } from './hooks/useFavorites';

const STORAGE_KEY = 'ttsSelectedComponent';

export default function HomePage() {
  const { voices, loading, error } = useVoices();
  const { favorites, toggleFavorite } = useFavorites();

  const [currentComponent, setCurrentComponent] = useState('TextToSpeech');

  // Load component state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'TextToSpeech' || saved === 'SSMLTextToSpeech') {
      setCurrentComponent(saved);
    }
  }, []);

  // Save component state to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentComponent);
  }, [currentComponent]);

  const toggleComponent = () => {
    setCurrentComponent((prev) =>
      prev === 'TextToSpeech' ? 'SSMLTextToSpeech' : 'TextToSpeech'
    );
  };

  return (
    <AudioPlayerProvider>
      <div className={styles.container}>
        <div className={styles.leftPane}>
          <div className={styles.col}>
            <button onClick={toggleComponent}>
              Switch to {currentComponent === 'TextToSpeech' ? 'SSML Editor' : 'Text-to-Speech'}
            </button>
          </div>

          <div className={styles.col}>
            {currentComponent === 'TextToSpeech' && <TextToSpeech />}
            {currentComponent === 'SSMLTextToSpeech' && <SSMLTextToSpeech />}
          </div>
        </div>

        <div className={styles.middlePane}>
          <div className={styles.col}>
            <h4>Favourites</h4>
          </div>
          <ul>
            {favorites.length > 0 ? (
              favorites.map((voiceName) => {
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
          <AudioControlPanel />
          {loading && <p>Loading voices...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && (
            <VoiceListPreview
              voices={voices}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
        </div>
      </div>
    </AudioPlayerProvider>
  );
}
