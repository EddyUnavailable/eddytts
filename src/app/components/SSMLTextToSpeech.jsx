import React, { useState, useEffect } from 'react';
import Form from './Form'; // Reuse your existing Form component or create a separate SSML form
import GeneratedAudio from './GeneratedAudio';
import Loader from './Loader';
import '../css/textToSpeech.css';

const SSMLTextToSpeech = ({ voices = [], apiEndpoint = '/api/ssml' }) => {
  const [ssml, setSSML] = useState('');
  const [languageCode, setLanguageCode] = useState('en-US');
  const [filteredVoices, setFilteredVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speakingRate, setSpeakingRate] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [volumeGainDb, setVolumeGainDb] = useState(0);
  const [audioSamples, setAudioSamples] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const filtered = voices.filter((voice) => voice.languageCodes.includes(languageCode));
    setFilteredVoices(filtered);
    setSelectedVoice(filtered[0]?.name || '');
  }, [languageCode, voices]);

  const handleSubmit = async (requestBody) => {
    if (!selectedVoice) return alert('Please select a voice!');
    const selectedVoiceObj = voices.find((v) => v.name === selectedVoice);
    if (!selectedVoiceObj) return alert('Invalid voice selection.');
    const correctLanguageCode = selectedVoiceObj.languageCodes[0];

    setLoading(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...requestBody,
          ssml,
          languageCode: correctLanguageCode,
          voice: selectedVoice,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate speech');
      const data = await response.json();

      const newSample = {
        id: Date.now(),
        base64: data.audioBase64 || null,
        path: data.link || null,
      };

      setAudioSamples((prev) => [...prev, newSample]);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setAudioSamples((prev) => prev.filter((sample) => sample.id !== id));
  };

  const handleResetSSML = () => {
    setSSML('');
  };

  return (
    <div className="container">
      <h1 className="title">SSML Text-to-Speech</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit({}); }}>
        <div>
          <label htmlFor="ssml-input">
            <strong>SSML:</strong>
          </label>
          <textarea
            id="ssml-input"
            value={ssml}
            onChange={(e) => setSSML(e.target.value)}
            placeholder="<speak>Hello world</speak>"
            required
          />
          <button type="button" onClick={handleResetSSML}>
            Reset SSML
          </button>
        </div>

        <div>
          <label htmlFor="language-code">
            <strong>Language Code:</strong>
          </label>
          <select
            id="language-code"
            value={languageCode}
            onChange={(e) => setLanguageCode(e.target.value)}
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="en-AU">English (AU)</option>
          </select>
        </div>

        <div>
          <label htmlFor="voice-select">
            <strong>Voice:</strong>
          </label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            {filteredVoices.map((voice) => (
              <option key={voice.name} value={voice.name} style={{ color: voice.color }}>
                {voice.formattedName} ({voice.languageCodes.join(', ')})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>
            <strong>Speaking Rate:</strong>
          </label>
          <input
            type="number"
            min="0.25"
            max="4.0"
            step="0.1"
            value={speakingRate}
            onChange={(e) => setSpeakingRate(e.target.value)}
          />
        </div>
        <div>
          <label>
            <strong>Pitch:</strong>
          </label>
          <input
            type="number"
            min="-20.0"
            max="20.0"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
          />
        </div>
        <div>
          <label>
            <strong>Volume Gain (dB):</strong>
          </label>
          <input
            type="number"
            min="-96.0"
            max="16.0"
            step="0.1"
            value={volumeGainDb}
            onChange={(e) => setVolumeGainDb(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Convert SSML to Speech'}
        </button>
      </form>

      {loading && <Loader className="loader" />}
      <GeneratedAudio audioSamples={audioSamples} onDelete={handleDelete} />
    </div>
  );
};

export default SSMLTextToSpeech;
