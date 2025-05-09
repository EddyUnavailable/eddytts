'use client';
import React, { useState, useRef } from 'react';
import { useVoices } from '../hooks/useVoices';
import styles from '../css/textToSpeech.module.css'; // Importing the new CSS module

const SSMLTextToSpeech = () => {
  const { voices, loading, error } = useVoices();
  const [selectedVoice, setSelectedVoice] = useState('');
  const [ssmlText, setSsmlText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef(null);

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
        console.error("Server returned error:", errorText);
        alert("Server error while generating speech.");
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
      {/* Left half: SSML textarea and controls */}
      <div className={styles.leftColumn}>
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className={styles.select}
        >
          <option value="" disabled>Select a voice</option>
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.formattedName || voice.name} ({voice.languageCode})
            </option>
          ))}
        </select>

        <textarea
          value={ssmlText}
          onChange={(e) => setSsmlText(e.target.value)}
          placeholder="Enter SSML here (e.g. <speak>Hi!</speak>)"
          className={styles.textarea}
        />

        <button
          onClick={handlePlay}
          disabled={!selectedVoice || !ssmlText.trim() || isGenerating}
          className={styles.button}
        >
          {isGenerating ? 'Processing...' : 'Play'}
        </button>

        {audioUrl && (
          <audio ref={audioRef} controls src={audioUrl} />
        )}
      </div>

      {/* Right half: SSML usage info */}
      <div className={styles.rightColumn}>
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
  <emphasis level="strong">Welcome</emphasis> to SSML.
</speak>`}
        </pre>
      </div>
    </div>
  );
};

export default SSMLTextToSpeech;
