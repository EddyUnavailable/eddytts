'use client';
import React, { useState, useEffect } from 'react';

const TextToSpeech = ({ apiEndpoint = '../api/tts' }) => {
  const [text, setText] = useState('');
  const [languageCode, setLanguageCode] = useState('en-US'); // Default to 'en-US'
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [gender, setGender] = useState('NEUTRAL');
  const [speakingRate, setSpeakingRate] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [volumeGainDb, setVolumeGainDb] = useState(0);
  const [effectsProfile, setEffectsProfile] = useState('');
  const [audioFormat, setAudioFormat] = useState('MP3'); // New: Audio Format
  const [sampleRate, setSampleRate] = useState(24000); // New: Sample Rate
  const [playWithoutSaving, setPlayWithoutSaving] = useState(false); // New: Play Without Saving
  const [useSSML, setUseSSML] = useState(false); // New: SSML Toggle
  const [audioPath, setAudioPath] = useState('');
  const [audioBase64, setAudioBase64] = useState('');
  const [previewAudio, setPreviewAudio] = useState(''); // New: Voice Preview
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch available voices on component mount
    const fetchVoices = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/voices`, { method: 'GET' });
        const data = await response.json();
        if (response.ok) {
          setVoices(data.voices);
          setSelectedVoice(data.voices[0]?.name || '');
        } else {
          alert('Error fetching voices: ' + data.error);
        }
      } catch (error) {
        alert('Error fetching voices: ' + error.message);
      }
    };

    fetchVoices();
  }, [apiEndpoint]);

  const handlePreview = async () => {
    if (!selectedVoice) return;
    setLoading(true);
    try {
      const response = await fetch(`${apiEndpoint}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voice: selectedVoice }),
      });
      const data = await response.json();
      if (response.ok) {
        setPreviewAudio(data.audioBase64);
      } else {
        alert('Error generating preview: ' + data.error);
      }
    } catch (error) {
      alert('Error generating preview: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requestBody = {
      text,
      languageCode,
      name: selectedVoice,
      gender,
      speakingRate: parseFloat(speakingRate),
      pitch: parseFloat(pitch),
      volumeGainDb: parseFloat(volumeGainDb),
      effectsProfile,
      format: audioFormat,
      sampleRateHertz: parseInt(sampleRate),
      playWithoutSaving,
      ssml: useSSML,
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (response.ok) {
        if (playWithoutSaving) {
          setAudioBase64(data.audioBase64);
        } else {
          setAudioPath(data.link);
        }
      } else {
        alert('Error: ' + (data.error || 'Unknown error occurred.'));
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Text-to-Speech</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>Text:</strong>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text here..."
              required
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Use SSML:</strong>
            <input
              type="checkbox"
              checked={useSSML}
              onChange={(e) => setUseSSML(e.target.checked)}
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Language Code:</strong>
            <select
              value={languageCode}
              onChange={(e) => setLanguageCode(e.target.value)}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="en-AU">English (AU)</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            <strong>Voice:</strong>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              required
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.languageCodes.join(', ')})
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={handlePreview} disabled={loading}>
            Preview Voice
          </button>
        </div>
        <div>
          <label>
            <strong>Gender:</strong>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="NEUTRAL">Neutral</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            <strong>Speaking Rate:</strong>
            <input
              type="number"
              step="0.1"
              value={speakingRate}
              onChange={(e) => setSpeakingRate(e.target.value)}
              placeholder="1.0 (default)"
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Pitch:</strong>
            <input
              type="number"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="0 (default)"
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Volume Gain (dB):</strong>
            <input
              type="number"
              step="0.1"
              value={volumeGainDb}
              onChange={(e) => setVolumeGainDb(e.target.value)}
              placeholder="0 (default)"
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Audio Format:</strong>
            <select
              value={audioFormat}
              onChange={(e) => setAudioFormat(e.target.value)}
            >
              <option value="MP3">MP3</option>
              <option value="WAV">WAV</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            <strong>Sample Rate (Hz):</strong>
            <input
              type="number"
              value={sampleRate}
              onChange={(e) => setSampleRate(e.target.value)}
              min="8000"
              max="48000"
              step="1000"
            />
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={playWithoutSaving}
              onChange={(e) => setPlayWithoutSaving(e.target.checked)}
            />
            Play Without Saving
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Convert to Speech'}
        </button>
      </form>

      {loading && <div>Loading...</div>}

      {previewAudio && (
        <div>
          <h2>Voice Preview:</h2>
          <audio controls>
            <source src={`data:audio/mpeg;base64,${previewAudio}`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {playWithoutSaving && audioBase64 && (
        <div>
          <h2>Generated Audio:</h2>
          <audio controls>
            <source src={`data:audio/mpeg;base64,${audioBase64}`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {!playWithoutSaving && audioPath && (
        <div>
          <h2>Generated MP3:</h2>
          <audio controls>
            <source src={audioPath} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <p>
            <a href={audioPath} target="_blank" rel="noopener noreferrer">
              Download MP3
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;