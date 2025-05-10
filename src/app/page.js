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
        <div className={styles.leftTittle}>
          <button onClick={toggleComponent}>
            Switch to {currentComponent === 'TextToSpeech' ? 'SSML Editor' : 'Text-to-Speech'}
          </button>
        </div>
        <div className={styles.ttsWrapper}>
          <div className={styles.coltts}>
            {currentComponent === 'TextToSpeech' && <TextToSpeech favorites={favorites} />}
            {currentComponent === 'SSMLTextToSpeech' && <SSMLTextToSpeech favorites={favorites} />}
          </div>
          <div className={styles.ttshelp}>
            <h3>SSML Guide</h3>
            <ul>
              <li><code>&lt;speak&gt;...&lt;/speak&gt;</code>: Wrap your SSML</li>
              <li><code>&lt;break time="500ms"/&gt;</code>: Pause for 500ms</li>
              <li><code>&lt;emphasis level="strong"&gt;text&lt;/emphasis&gt;</code>: Emphasize words</li>
              <li><code>&lt;prosody pitch="+5%" rate="slow"&gt;text&lt;/prosody&gt;</code>: Change tone/speed</li>
              <li><code>&lt;say-as interpret-as="characters"&gt;HTML&lt;/say-as&gt;</code>: Spell out text</li>
            </ul>
            <p>Example:</p>
            <pre className={styles.codeBlock}>
            {`<speak>
Hello there! <break time="500ms"/>
<emphasis level="strong">Welcome</emphasis>
 to SSML.
</speak>`}
        </pre>
      

          </div>
        </div >

      </div>

      <div className={styles.middlePane}>
        <div className={styles.middleTitle}>
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
