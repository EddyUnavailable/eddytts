'use client';

import React, { useState, useRef } from 'react';
import { useVoices } from '../hooks/useVoices';
import { useFavorites } from '../hooks/useFavorites'; // ✅ Add this
import styles from '../css/textToSpeech.module.css';

const TextToSpeech = () => {
  const { voices, loading, error } = useVoices();
  const { favorites } = useFavorites(); // ✅ Access favorites list
  const [selectedVoice, setSelectedVoice] = useState('');
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef(null);

  const favoriteVoices = voices.filter((v) => favorites.includes(v.name)); // ✅ Filtered list

  const handlePlay = async () => {
    if (!selectedVoice || !text.trim()) {
      alert("Please select a voice and enter some text.");
      return;
    }

    setIsGenerating(true);
    try {
      const selectedVoiceObj = voices.find((v) => v.name === selectedVoice);
      const languageCode = Array.isArray(selectedVoiceObj?.languageCodes)
        ? selectedVoiceObj.languageCodes[0]
        : 'en-US';

      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voice: selectedVoice,
          languageCode,
          playWithoutSaving: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server returned error:', errorText);
        alert('Server error while generating speech.');
        return;
      }

      const data = await response.json();

      if (data.audioBase64) {
        const dataUri = `data:audio/mpeg;base64,${data.audioBase64}`;
        setAudioUrl(dataUri);
        audioRef.current?.load();
        audioRef.current?.play().catch((err) => console.error('Playback failed:', err));
      } else {
        alert('No audio returned.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate speech.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <p>Loading voices...</p>;
  if (error) return <p>Error loading voices: {error.message}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.voiceSelect}>
        {favoriteVoices.length === 0 ? (
          <p className={styles.noFavorites}>
            No favorites yet. Add voices to your favorites list to use them here.
          </p>
        ) : (
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className={styles.select}
          >
            <option value="" disabled>Select a voice</option>
            {favoriteVoices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.formattedName || voice.name} ({voice.languageCode})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className={styles.voiceText}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter plain text to convert to speech"
          className={styles.textarea}
        />
      </div>

      <div className={styles.voicebutton}>
        <button
          onClick={handlePlay}
          disabled={!selectedVoice || !text.trim() || isGenerating}
          className={styles.button150}
        >
          {isGenerating ? 'Processing...' : 'Submit'}
        </button>
      </div>

      <div className={styles.voicePlayer}>
        {audioUrl && (
          <div className={styles.audioControls}>
            <audio ref={audioRef} controls src={audioUrl}>
              Your browser does not support the audio element.
            </audio>
            <a href={audioUrl} download="tts-audio.mp3" className={styles.button150}>
              Download Audio
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToSpeech;
