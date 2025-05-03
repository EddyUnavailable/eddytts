'use client';
import React, { useState, useEffect } from 'react';
import Form from './Form';
import VoicePreview from './VoicePreview';
import GeneratedAudio from './GeneratedAudio';
import Loader from './Loader';

const TextToSpeech = ({ apiEndpoint = '../api/tts' }) => {
  const [text, setText] = useState('');
  const [languageCode, setLanguageCode] = useState('en-US');
  const [voices, setVoices] = useState([]);
  const [filteredVoices, setFilteredVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [gender, setGender] = useState('NEUTRAL');
  const [speakingRate, setSpeakingRate] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [volumeGainDb, setVolumeGainDb] = useState(0);
  const [audioFormat, setAudioFormat] = useState('MP3');
  const [sampleRate, setSampleRate] = useState(24000);
  const [playWithoutSaving, setPlayWithoutSaving] = useState(false);
  const [useSSML, setUseSSML] = useState(false);
  const [audioPath, setAudioPath] = useState('');
  const [audioBase64, setAudioBase64] = useState('');
  const [previewAudio, setPreviewAudio] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch available voices on mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/voices`, { method: 'GET' });
        if (!response.ok) throw new Error('Failed to fetch voices');

        const data = await response.json();

        // Filter out premium voices (e.g., Chirp and Wavenet)
        const filtered = data.voices.filter(
          (voice) => !voice.name.includes('Chirp') && !voice.name.includes('Wavenet')
        );

        setVoices(filtered || []);
      } catch (error) {
        alert('Error fetching voices: ' + error.message);
      }
    };

    fetchVoices();
  }, [apiEndpoint]);

  // Filter voices whenever the languageCode changes
  useEffect(() => {
    const filtered = voices.filter((voice) =>
      voice.languageCodes.includes(languageCode)
    );
    setFilteredVoices(filtered);
    if (filtered.length > 0) {
      setSelectedVoice(filtered[0]?.name || ''); // Automatically select the first matching voice
    }
  }, [languageCode, voices]);

  // Handle voice selection change
  const handleVoiceChange = (voiceName) => {
    setSelectedVoice(voiceName); // Update the selected voice in state
  };

  const handlePreview = async () => {
    if (!selectedVoice) {
      return alert('Please select a voice!');
    }

    // Find the selected voice object
    const selectedVoiceObj = voices.find((voice) => voice.name === selectedVoice);

    if (!selectedVoiceObj) {
      return alert('Invalid voice selection.');
    }

    // Use the correct languageCode for the selected voice
    const correctLanguageCode = selectedVoiceObj.languageCodes[0];

    setLoading(true);

    try {
      const response = await fetch(`${apiEndpoint}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voice: selectedVoice,
          languageCode: correctLanguageCode,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate preview');

      const data = await response.json();
      setPreviewAudio(data.audioBase64 || '');
    } catch (error) {
      alert('Error generating preview: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (requestBody) => {
    if (!selectedVoice) {
      return alert('Please select a voice!');
    }

    // Find the selected voice object
    const selectedVoiceObj = voices.find((voice) => voice.name === selectedVoice);

    if (!selectedVoiceObj) {
      return alert('Invalid voice selection.');
    }

    // Use the correct languageCode for the selected voice
    const correctLanguageCode = selectedVoiceObj.languageCodes[0];

    setLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...requestBody, languageCode: correctLanguageCode, voice: selectedVoice }),
      });

      if (!response.ok) throw new Error('Failed to generate speech');

      const data = await response.json();

      if (requestBody.playWithoutSaving) {
        setAudioBase64(data.audioBase64 || '');
      } else {
        setAudioPath(data.link || '');
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
      <Form
        text={text}
        setText={setText}
        languageCode={languageCode}
        setLanguageCode={setLanguageCode}
        voices={filteredVoices} // Use filtered voices here
        selectedVoice={selectedVoice}
        setSelectedVoice={handleVoiceChange} // Pass the handler for changing voices
        gender={gender}
        setGender={setGender}
        speakingRate={speakingRate}
        setSpeakingRate={setSpeakingRate}
        pitch={pitch}
        setPitch={setPitch}
        volumeGainDb={volumeGainDb}
        setVolumeGainDb={setVolumeGainDb}
        audioFormat={audioFormat}
        setAudioFormat={setAudioFormat}
        sampleRate={sampleRate}
        setSampleRate={setSampleRate}
        playWithoutSaving={playWithoutSaving}
        setPlayWithoutSaving={setPlayWithoutSaving}
        useSSML={useSSML}
        setUseSSML={setUseSSML}
        handleSubmit={handleSubmit}
        loading={loading}
        handlePreview={handlePreview}
      />
      {loading && <Loader />}
      <VoicePreview previewAudio={previewAudio} />
      <GeneratedAudio
        playWithoutSaving={playWithoutSaving}
        audioBase64={audioBase64}
        audioPath={audioPath}
      />
    </div>
  );
};

export default TextToSpeech;