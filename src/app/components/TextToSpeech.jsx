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
        setVoices(data.voices || []);
        setSelectedVoice(data.voices[0]?.name || '');
      } catch (error) {
        alert('Error fetching voices: ' + error.message);
      }
    };

    fetchVoices();
  }, [apiEndpoint]);

  const handlePreview = async () => {
    if (!selectedVoice) return alert('Please select a voice!');
    setLoading(true);

    try {
      const response = await fetch(`${apiEndpoint}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voice: selectedVoice }),
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
    setLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
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
        voices={voices}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
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