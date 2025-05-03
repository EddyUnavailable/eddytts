'use client';
import React, { useState, useEffect } from 'react';
import Form from './Form';
import VoicePreview from './VoicePreview';
import GeneratedAudio from './GeneratedAudio';
import Loader from './Loader';

const TextToSpeech = ({ apiEndpoint = '/api/tts' }) => {
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

        // Filter out premium voices
        const filtered = data.voices.filter(
          (voice) => !voice.name.includes('Chirp') && !voice.name.includes('Wavenet')
        );

        setVoices(filtered || []);
      } catch (error) {
        console.error('Error fetching voices:', error);
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
    } else {
      setSelectedVoice('');
    }
  }, [languageCode, voices]);

  // Handle voice selection change
  const handleVoiceChange = async (voiceName) => {
    console.log('Changing voice to:', voiceName); // Debugging
    setPreviewAudio(''); // Clear previous preview audio
    setSelectedVoice(voiceName); // Update state for selected voice

    // Wait 1 second before triggering the preview
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Trigger the preview after ensuring the state is updated
    handlePreview(voiceName);
  };

  const handlePreview = async (previewVoice = selectedVoice) => {
    // Ensure previewVoice is a string
    const voiceToPreview = typeof previewVoice === 'string' ? previewVoice.trim() : selectedVoice.trim();
  
    console.log('Previewing voice:', voiceToPreview); // Debugging
    if (!voiceToPreview) {
      return alert('Please select a voice!');
    }
  
    const selectedVoiceObj = voices.find(
      (voice) => voice.name.trim() === voiceToPreview
    );
  
    if (!selectedVoiceObj) {
      console.error('Voice not found in list:', voiceToPreview); // Debugging
      return alert('Invalid voice selection.');
    }
  
    console.log('Selected voice object:', selectedVoiceObj); // Debugging
    const correctLanguageCode = selectedVoiceObj.languageCodes[0];
  
    setLoading(true);
  
    try {
      const response = await fetch(`${apiEndpoint}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voice: voiceToPreview,
          languageCode: correctLanguageCode,
        }),
      });
  
      if (!response.ok) throw new Error('Failed to generate preview');
  
      const data = await response.json();
      setPreviewAudio(data.audioBase64 || '');
    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Error generating preview: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (requestBody) => {
    if (!selectedVoice) {
      return alert('Please select a voice!');
    }

    const selectedVoiceObj = voices.find(
      (voice) => voice.name.trim() === selectedVoice.trim()
    );

    if (!selectedVoiceObj) {
      console.error('Voice not found in list:', selectedVoice); // Debugging
      return alert('Invalid voice selection.');
    }

    const correctLanguageCode = selectedVoiceObj.languageCodes[0];

    setLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...requestBody,
          languageCode: correctLanguageCode,
          voice: selectedVoice,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate speech');

      const data = await response.json();

      if (requestBody.playWithoutSaving) {
        setAudioBase64(data.audioBase64 || '');
      } else {
        setAudioPath(data.link || '');
      }
    } catch (error) {
      console.error('Error generating speech:', error);
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