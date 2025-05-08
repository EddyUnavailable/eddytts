"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useVoices } from '../hooks/useVoices';
import styles from '../css/textToSpeech.module.css';

const SSMLTextToSpeech = () => {
  const { voices, loading, error } = useVoices();
  const [selectedVoice, setSelectedVoice] = useState("");
  const [ssmlText, setSsmlText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef(null);

  const handleVoiceChange = (e) => {
    setSelectedVoice(e.target.value);
  };

  const handleSSMLTextChange = (e) => {
    setSsmlText(e.target.value);
  };

  const handlePlay = async () => {
    if (!selectedVoice || !ssmlText.trim()) {
      alert("Please select a voice and enter SSML text.");
      return;
    }

    setIsGenerating(true);

    try {
      const selectedVoiceObj = voices.find((v) => v.name === selectedVoice);
      const languageCode = Array.isArray(selectedVoiceObj?.languageCodes)
        ? selectedVoiceObj.languageCodes[0]
        : 'en-US';

      // Wrap the SSML text in <speak> tags if it's not already wrapped
      const formattedSSML = `<speak>${ssmlText}</speak>`;

      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formattedSSML,  // Send SSML to the backend
          voice: selectedVoice,
          languageCode,
          playWithoutSaving: true,
          ssml: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server returned error:", errorText);
        alert("Server error while generating speech.");
        setIsGenerating(false);
        return;
      }

      const data = await response.json();

      if (data.audioBase64) {
        const dataUri = `data:audio/mpeg;base64,${data.audioBase64}`;
        setAudioUrl(dataUri);

        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.onloadeddata = () => {
            audioRef.current.play().catch((err) => {
              console.error("Playback failed:", err);
            });
          };
        }
      } else {
        alert("No audio returned from server.");
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
    <div className={styles.content}>
      <div className={styles.controls}>
        <label htmlFor="voiceSelect" className={styles.label}>
          Choose a voice:
        </label>
        <select
          id="voiceSelect"
          className={styles.selectVoice}
          value={selectedVoice}
          onChange={handleVoiceChange}
          aria-label="Select a voice"
        >
          <option value="" disabled>Select a voice</option>
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name} style={{ color: voice.color }}>
              {voice.formattedName || voice.name} ({voice.languageCode})
            </option>
          ))}
        </select>
      </div>

      <div className={styles.textInput}>
        <label htmlFor="ssmlInput" className={styles.label}>
          Enter SSML text:
        </label>
        <textarea
          id="ssmlInput"
          value={ssmlText}
          onChange={handleSSMLTextChange}
          placeholder="Enter SSML to convert to speech"
          aria-label="SSML text to convert to speech"
          className={styles.textarea}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button
          onClick={handlePlay}
          disabled={!selectedVoice || !ssmlText.trim() || isGenerating}
          className={styles.playButton}
        >
          {isGenerating ? 'Processing...' : 'Play'}
        </button>
      </div>

      {audioUrl && (
        <div className={styles.audioControls}>
          <audio ref={audioRef} controls src={audioUrl} className={styles.audioPlayer}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default SSMLTextToSpeech;
