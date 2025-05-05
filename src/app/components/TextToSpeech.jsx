import React, { useState, useEffect } from 'react';
import Form from './Form';
import GeneratedAudio from './GeneratedAudio';
import Loader from './Loader';
import '../css/textToSpeech.css';

const TextToSpeech = ({ voices = [], apiEndpoint = '/api/tts' }) => {
  const [text, setText] = useState('');
  const [languageCode, setLanguageCode] = useState('en-US');
  const [filteredVoices, setFilteredVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speakingRate, setSpeakingRate] = useState(1.05);
  const [pitch, setPitch] = useState(0);
  const [volumeGainDb, setVolumeGainDb] = useState(0);
  const [playWithoutSaving, setPlayWithoutSaving] = useState(false); // Ensure this is defined
  const [saveToFile, setSaveToFile] = useState(false); // Add this state
  const [audioSamples, setAudioSamples] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter voices by languageCode
  useEffect(() => {
    const filtered = voices.filter((voice) => voice.languageCodes.includes(languageCode));
    setFilteredVoices(filtered);
    setSelectedVoice(filtered[0]?.name || ''); // Default to the first voice if available
  }, [languageCode, voices]);
  console.log('playWithoutSaving:', playWithoutSaving);
  console.log('setPlayWithoutSaving:', setPlayWithoutSaving);

  // Handle form submission
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
          text,
          languageCode: correctLanguageCode,
          voice: selectedVoice,
          playWithoutSaving,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to generate speech');
      }

      const data = await response.json();
      console.log('TTS API response:', data);

      let newSample;

      if (playWithoutSaving) {
        if (!data.audioBase64) {
          throw new Error('Missing audioBase64 in API response for playWithoutSaving mode.');
        }
        newSample = {
          id: Date.now(),
          base64: data.audioBase64, // Base64 audio for direct playback
          path: null,
        };
      } else {
        if (!data.link && !data.webContentLink) {
          throw new Error('Missing link in API response for saved audio.');
        }
        newSample = {
          id: Date.now(),
          base64: null,
          path: data.link || data.webContentLink, // Use webContentLink as fallback
        };
      }

      setAudioSamples((prevSamples) => [...prevSamples, newSample]);
    } catch (error) {
      console.error('Error generating speech:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle deletion of audio samples
  const handleDelete = (id) => {
    setAudioSamples((prevSamples) => prevSamples.filter((sample) => sample.id !== id));
  };

  return (
    <div className="container">
      <h1 className="title">Text-to-Speech</h1>
      <Form
        text={text}
        setText={setText}
        languageCode={languageCode}
        setLanguageCode={setLanguageCode}
        voices={filteredVoices}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        speakingRate={speakingRate}
        setSpeakingRate={setSpeakingRate}
        pitch={pitch}
        setPitch={setPitch}
        volumeGainDb={volumeGainDb}
        setVolumeGainDb={setVolumeGainDb}
        playWithoutSaving={playWithoutSaving} // Pass playWithoutSaving
        setPlayWithoutSaving={setPlayWithoutSaving} // Pass setPlayWithoutSaving
        handleSubmit={handleSubmit}
        loading={loading}
      />
      {loading && <Loader className="loader" />}
      <GeneratedAudio
        className="audioSamples"
        audioSamples={audioSamples}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TextToSpeech;