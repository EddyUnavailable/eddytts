'use client';

import React, { useState, useEffect } from 'react';
import styles from './css/layout.module.css';
import VoiceListPreview from './components/VoiceListPreview';
import { useVoices } from './hooks/useVoices';
import AudioControlPanel from './components/AudioControlPanel';
import TextToSpeech from './components/TextToSpeech';
import SSMLTextToSpeech from './components/SSMLTextToSpeech';
import { useFavorites } from './hooks/useFavorites';

const STORAGE_KEY = 'ttsSelectedComponent';

export default function HomePage() {
  const { voices, loading, error } = useVoices();
  const { favorites, toggleFavorite } = useFavorites();

  const [currentComponent, setCurrentComponent] = useState('TextToSpeech');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'TextToSpeech' || saved === 'SSMLTextToSpeech') {
      setCurrentComponent(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentComponent);
  }, [currentComponent]);

  const toggleComponent = () => {
    setCurrentComponent(prev =>
      prev === 'TextToSpeech' ? 'SSMLTextToSpeech' : 'TextToSpeech'
    );
  };

  return (
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
          <h4 className={styles.title}>Favourites</h4>
        </div>
        <ul className={styles.favoritesContainer}>
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
        <AudioControlPanel showProgress={true} />
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
  );
}
