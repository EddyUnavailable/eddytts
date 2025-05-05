import React, { useState, useEffect } from 'react';
import Form from './Form';
import GeneratedAudio from './GeneratedAudio';
import Loader from './Loader';
import '../css/textToSpeech.css';

const SSMLTextToSpeech = ({ apiEndpoint = '/api/tts' }) => {
  const [ssmlText, setSsmlText] = useState('');
  const [languageCode, setLanguageCode] = useState('en-US');
  const [voices, setVoices] = useState([]);
  const [filteredVoices, setFilteredVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speakingRate, setSpeakingRate] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [volumeGainDb, setVolumeGainDb] = useState(0);
  const [audioSamples, setAudioSamples] = useState([]);
  const [playWithoutSaving, setPlayWithoutSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatVoiceName = (originalName) => {
    const parts = originalName.split('-');
    const type = parts.slice(2, parts.length - 1).join('-');
    const region = parts[1];
    const name = parts[parts.length - 1];
    return `${name}-${type}-${region}`;
  };

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/voices`);
        if (!response.ok) throw new Error('Failed to fetch voices');

        const data = await response.json();
        const formattedVoices = data.voices.map((voice) => ({
          ...voice,
          formattedName: formatVoiceName(voice.name),
          color:
            voice.ssmlGender === 'MALE'
              ? 'blue'
              : voice.ssmlGender === 'FEMALE'
              ? 'pink'
              : 'black',
        }));

        setVoices(formattedVoices || []);
      } catch (error) {
        console.error('Error fetching voices:', error);
        alert('Error fetching voices: ' + error.message);
      }
    };

    fetchVoices();
  }, [apiEndpoint]);

  useEffect(() => {
    const filtered = voices.filter((voice) =>
      voice.languageCodes.includes(languageCode)
    );
    setFilteredVoices(filtered);
    setSelectedVoice(filtered[0]?.name || '');
  }, [languageCode, voices]);

  const formatSSML = (text) => {
    if (!text.startsWith('<speak>')) text = `<speak>${text}`;
    if (!text.endsWith('</speak>')) text += '</speak>';
    return text;
  };

  const handleSubmit = async () => {
    if (!selectedVoice) {
      return alert('Please select a voice!');
    }

    const selectedVoiceObj = voices.find((voice) => voice.name === selectedVoice);
    if (!selectedVoiceObj) {
      return alert('Invalid voice selection.');
    }

    const correctLanguageCode = selectedVoiceObj.languageCodes[0];
    setLoading(true);

    try {
      const payload = {
        text: formatSSML(ssmlText),
        ssml: true,
        voice: selectedVoice,
        languageCode: correctLanguageCode,
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate,
          pitch,
          volumeGainDb,
          sampleRateHertz: 24000,
        },
        playWithoutSaving,
      };

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to generate audio.');
      }

      const data = await response.json();
      const newSample = playWithoutSaving
        ? { id: Date.now(), base64: data.audioBase64 || null, path: null }
        : { id: Date.now(), base64: null, path: data.link || null };

      setAudioSamples((prev) => [...prev, newSample]);
    } catch (error) {
      console.error('Error generating speech:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSsmlText('');
  };

  const handleDelete = (id) => {
    setAudioSamples((prev) => prev.filter((sample) => sample.id !== id));
  };

  return (
    <div className="container">
      <h1 className="title">SSML Text-to-Speech</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* SSML Input */}
        <div>
          <label htmlFor="ssml-input"><strong>SSML Input:</strong></label>
          <textarea
            id="ssml-input"
            value={ssmlText}
            onChange={(e) => setSsmlText(e.target.value)}
            placeholder="<speak>Enter SSML here</speak>"
            required
          />
        </div>

        {/* Language Selection */}
        <div>
          <label htmlFor="language-code"><strong>Language Code:</strong></label>
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

        {/* Voice Selection */}
        <div>
          <label htmlFor="voice-select"><strong>Voice:</strong></label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            required
          >
            {filteredVoices.length > 0 ? (
              filteredVoices.map((voice) => (
                <option key={voice.name} value={voice.name} style={{ color: voice.color }}>
                  {voice.formattedName} ({voice.languageCodes.join(', ')})
                </option>
              ))
            ) : (
              <option value="" disabled>No voices available</option>
            )}
          </select>
        </div>

        {/* Record Without Saving */}
        <div>
          <label htmlFor="play-without-saving"><strong>Play Without Saving:</strong></label>
          <input
            type="checkbox"
            id="play-without-saving"
            checked={playWithoutSaving}
            onChange={(e) => setPlayWithoutSaving(e.target.checked)}
          />
        </div>

        {/* Buttons */}
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Speech'}
          </button>
          <button type="button" onClick={handleReset} style={{ marginLeft: '1rem' }}>
            Reset
          </button>
        </div>
      </form>

      {loading && <Loader className="loader" />}
      <GeneratedAudio
        className="audioSamples"
        audioSamples={audioSamples}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default SSMLTextToSpeech;