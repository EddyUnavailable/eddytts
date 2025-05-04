import React, { useState, useEffect } from 'react';
import Form from './Form';
import GeneratedAudio from './GeneratedAudio';
import Loader from './Loader';
import '../css/textToSpeech.css';

const SSMLTextToSpeech = ({ apiEndpoint = '/api/tts' }) => {
  const [ssmlText, setSsmlText] = useState(''); // Input for SSML text
  const [languageCode, setLanguageCode] = useState('en-US');
  const [voices, setVoices] = useState([]);
  const [filteredVoices, setFilteredVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speakingRate, setSpeakingRate] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [volumeGainDb, setVolumeGainDb] = useState(0);
  const [audioSamples, setAudioSamples] = useState([]);
  const [playWithoutSaving, setPlayWithoutSaving] = useState(false); // New state for "Record Without Saving"
  const [loading, setLoading] = useState(false);

  // Function to format the voice name
  const formatVoiceName = (originalName) => {
    const parts = originalName.split('-'); // Split the name by dashes
    const type = parts.slice(2, parts.length - 1).join('-'); // Extract the type (e.g., Chirp3-HD)
    const region = parts[1]; // Extract the region (e.g., US, UK, AU)
    const name = parts[parts.length - 1]; // Extract the actual name (e.g., Achernar)

    return `${name}-${type}-${region}`; // Rearrange to desired format
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
              : 'black', // Apply gender-specific color
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

  const handleSubmit = async () => {
    console.log('Submitting SSML TTS request with:', {
      selectedVoice,
      languageCode,
      ssmlText,
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
          ssml: ssmlText, // SSML input for the TTS API
          languageCode: correctLanguageCode,
          voice: selectedVoice,
          playWithoutSaving, // Include the "Record Without Saving" option
        }),
      });
  
      console.log('API Response Status:', response.status);
      console.log('API Response Text:', await response.text());
  
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Invalid request. Please check your input.');
        } else if (response.status === 401) {
          throw new Error('Unauthorized. Please check your API key.');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Unexpected error: ${response.statusText}`);
        }
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
      <h1 className="title">SSML Text-to-Speech</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        console.log('handleSubmit called');
        {/* SSML Input Field */}
        <div>
          <label htmlFor="ssml-input">
            <strong>SSML Input:</strong>
          </label>
          <textarea
            id="ssml-input"
            value={ssmlText}
            onChange={(e) => setSsmlText(e.target.value)}
            placeholder="<speak>Enter SSML here</speak>"
            required
            aria-describedby="ssml-input-desc"
          />
          <small id="ssml-input-desc">
            Enter valid SSML markup to define the speech synthesis behavior.
          </small>
        </div>

        {/* Language Code Selection */}
        <div>
          <label htmlFor="language-code">
            <strong>Language Code:</strong>
          </label>
          <select
            id="language-code"
            value={languageCode}
            onChange={(e) => setLanguageCode(e.target.value)}
            aria-label="Select Language Code"
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="en-AU">English (AU)</option>
          </select>
        </div>

        {/* Voice Selection */}
        <div>
          <label htmlFor="voice-select">
            <strong>Voice:</strong>
          </label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            aria-label="Select Voice"
            required
          >
            {filteredVoices.length > 0 ? (
              filteredVoices.map((voice) => (
                <option key={voice.name} value={voice.name} style={{ color: voice.color }}>
                  {voice.formattedName} ({voice.languageCodes.join(', ')})
                </option>
              ))
            ) : (
              <option value="" disabled>
                No voices available
              </option>
            )}
          </select>
        </div>

        {/* Record Without Saving Option */}
        <div>
          <label htmlFor="play-without-saving">
            <strong>Record Without Saving:</strong>
          </label>
          <input
            type="checkbox"
            id="play-without-saving"
            checked={playWithoutSaving}
            onChange={(e) => setPlayWithoutSaving(e.target.checked)}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading} aria-label="Submit Form">
          {loading ? 'Generating...' : 'Generate Speech'}
        </button>
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