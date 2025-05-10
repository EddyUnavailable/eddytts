'use client';

import React, { useState, useRef } from 'react';
import { useVoices } from '../hooks/useVoices';
import styles from '../css/textToSpeech.module.css';

const SSMLTextToSpeech = ({ favorites }) => {
  const { voices, loading, error } = useVoices();
  const [selectedVoice, setSelectedVoice] = useState('');
  const [ssmlText, setSsmlText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef(null);

  const favoriteVoices = voices.filter((v) => favorites.includes(v.name));

  const handlePlay = async () => {
    if (!selectedVoice || !ssmlText.trim()) {
      alert("Please select a voice and enter SSML.");
      return;
    }

    setIsGenerating(true);

    try {
      const selectedVoiceObj = voices.find((v) => v.name === selectedVoice);
      const languageCode = Array.isArray(selectedVoiceObj?.languageCodes)
        ? selectedVoiceObj.languageCodes[0]
        : 'en-US';

      const formattedSSML = ssmlText.trim().startsWith('<speak>') && ssmlText.trim().endsWith('</speak>')
        ? ssmlText.trim()
        : `<speak>${ssmlText.trim()}</speak>`;

      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formattedSSML,
          voice: selectedVoice,
          languageCode,
          playWithoutSaving: true,
          ssml: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorData = JSON.parse(errorText);

        if (errorData.error?.includes("This voice currently does not support SSML")) {
          alert("This voice does not support SSML. Please try with text-only input.");
        } else {
          alert("Server error while generating speech.");
        }

        console.error("Server returned error:", errorText);
        return;
      }

      const data = await response.json();

      if (data.audioBase64) {
        const dataUri = `data:audio/mpeg;base64,${data.audioBase64}`;
        setAudioUrl(dataUri);
        audioRef.current?.load();
        audioRef.current?.play().catch((err) => console.error("Playback failed:", err));
      } else {
        alert("No audio returned.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate speech.");
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
          <p className={styles.noFavorites}>No favorites yet. Add voices to your favorites list to use them here.</p>
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
          value={ssmlText}
          onChange={(e) => setSsmlText(e.target.value)}
          placeholder="Enter SSML here (e.g. <speak>Hi!</speak>)"
          className={styles.textarea}
        />
      </div>

      <div className={styles.voicebutton}>
        <button
          onClick={handlePlay}
          disabled={!selectedVoice || !ssmlText.trim() || isGenerating}
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

export default SSMLTextToSpeech;
