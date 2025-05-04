import React, { useState, useEffect } from 'react';
import Form from './Form';
import GeneratedAudio from './GeneratedAudio';
import Loader from './Loader';
import '../css/textToSpeech.css';

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
  const [audioSamples, setAudioSamples] = useState([]);
  const [playWithoutSaving, setPlayWithoutSaving] = useState(false); // Added state for "record without saving"
  const [useSSML, setUseSSML] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to format the voice name
  const formatVoiceName = (originalName) => {
    const parts = originalName.split('-');
    const type = parts.slice(2, parts.length - 1).join('-');
    const region = parts[1];
    const name = parts[parts.length - 1];

    return `${name}-${type}-${region}`;
  };

  // Fetch available voices on mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/voices`, { method: 'GET' });
        if (!response.ok) throw new Error('Failed to fetch voices');

        const data = await response.json();
        console.log('Fetched voices:', data);

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

  // Filter voices whenever the languageCode changes
  useEffect(() => {
    const filtered = voices.filter((voice) =>
      voice.languageCodes.includes(languageCode)
    );
    setFilteredVoices(filtered);
    if (filtered.length > 0) {
      setSelectedVoice(filtered[0]?.name || '');
    } else {
      setSelectedVoice('');
    }
  }, [languageCode, voices]);

  const handleVoiceChange = (voiceName) => {
    setSelectedVoice(voiceName);
  };

  const handleSubmit = async (requestBody) => {
    console.log('Submitting TTS request with:', {
      selectedVoice,
      languageCode,
      text,
      playWithoutSaving,
    });

    if (!selectedVoice) {
      return alert('Please select a voice!');
    }

    const selectedVoiceObj = voices.find((voice) => voice.name === selectedVoice);

    if (!selectedVoiceObj) {
      console.error('Voice not found in list:', selectedVoice);
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
          text,
          languageCode: correctLanguageCode,
          voice: selectedVoice,
          playWithoutSaving, // Include the "record without saving" option
        }),
      });

      if (!response.ok) {
        console.error('TTS API returned an error:', response.statusText);
        throw new Error('Failed to generate speech');
      }

      const data = await response.json();
      console.log('TTS API response:', data);

      if (playWithoutSaving) {
        if (!data.audioBase64) {
          throw new Error('Missing audioBase64 in API response');
        }

        const newSample = {
          id: Date.now(),
          base64: data.audioBase64,
          path: null,
        };

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

        setAudioSamples((prevSamples) => [...prevSamples, newSample]);
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
        setSelectedVoice={handleVoiceChange}
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
        setPlayWithoutSaving={setPlayWithoutSaving} // Pass the setter for "record without saving"
        useSSML={useSSML}
        setUseSSML={setUseSSML}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      <div>
        <label htmlFor="play-without-saving">
          <strong>Record without saving:</strong>
        </label>
        <input
          type="checkbox"
          id="play-without-saving"
          checked={playWithoutSaving}
          onChange={(e) => setPlayWithoutSaving(e.target.checked)}
        />
      </div>
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