'use client';
import React, { useState, useEffect } from 'react';
import Form from './Form';
import AudioPreview from './AudioPreview';
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
  const [audioSamples, setAudioSamples] = useState([]); // Array of audio samples
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
  const handleVoiceChange = (voiceName) => {
    setSelectedVoice(voiceName); // Update the selected voice in state
  };

  // Handle TTS submission
  const handleSubmit = async (requestBody) => {
    console.log('Submitting TTS request with:', { selectedVoice, languageCode, text }); // Debugging

    if (!selectedVoice) {
      return alert('Please select a voice!');
    }

    const selectedVoiceObj = voices.find((voice) => voice.name === selectedVoice);

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
          text, // Include the text for TTS
          languageCode: correctLanguageCode,
          voice: selectedVoice,
        }),
      });

      if (!response.ok) {
        console.error('TTS API returned an error:', response.statusText); // Debugging
        throw new Error('Failed to generate speech');
      }

      const data = await response.json();

      console.log('TTS API response:', data); // Debugging

      if (requestBody.playWithoutSaving) {
        if (!data.audioBase64) {
          throw new Error('Missing audioBase64 in API response');
        }

        const newSample = {
          id: Date.now(),
          base64: data.audioBase64,
          path: null,
        };

        // Add the new sample to the list of audio samples
        setAudioSamples((prevSamples) => [...prevSamples, newSample]);
      } else {
        if (!data.link) {
          throw new Error('Missing link in API response');
        }

        const newSample = {
          id: Date.now(),
          base64: null,
          path: data.link,
        };

        // Add the new sample to the list of audio samples
        setAudioSamples((prevSamples) => [...prevSamples, newSample]);
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
        handleSubmit={handleSubmit} // Correctly pass handleSubmit
        loading={loading}
      />
      {loading && <Loader />}
      <AudioPreview
        selectedVoice={selectedVoice}
        voices={voices}
        apiEndpoint={apiEndpoint}
      />
      <GeneratedAudio audioSamples={audioSamples} onDelete={() => {}} />
    </div>
  );
};

export default TextToSpeech;