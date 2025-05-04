'use client';
import React, { useState, useEffect } from 'react';

const VoiceListPreview = ({ voices = [], apiEndpoint }) => {
  const [loading, setLoading] = useState(false);
  const [currentVoice, setCurrentVoice] = useState(null);
  const [activeAudio, setActiveAudio] = useState(null); // Store the currently playing audio

  // Cleanup active audio on component unmount
  useEffect(() => {
    return () => {
      if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
        setActiveAudio(null);
      }
    };
  }, [activeAudio]);

  // Function to preview a voice (without SSML)
  const handlePreview = async (voiceName) => {
    if (loading) return;

    console.log('Previewing voice:', voiceName);

    const selectedVoiceObj = voices.find((voice) => voice.name === voiceName);

    if (!selectedVoiceObj) {
      console.error('Voice not found:', voiceName);
      return alert('Invalid voice selection.');
    }

    const languageCode = selectedVoiceObj.languageCodes[0]; // Use the first language code

    setLoading(true);
    setCurrentVoice(voiceName);

    try {
      const response = await fetch(`${apiEndpoint}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voice: voiceName,
          languageCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const data = await response.json();

      if (!data.audioBase64) {
        throw new Error('Preview failed: No audio data received.');
      }

      // Stop and reset the currently playing audio, if any
      if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      }

      // Create a new audio element and play it
      const audio = new Audio(`data:audio/mpeg;base64,${data.audioBase64}`);
      audio.play();

      // Set the new audio as the active audio
      setActiveAudio(audio);
    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Error generating preview: ' + error.message);
    } finally {
      setLoading(false);
      setCurrentVoice(null);
    }
  };

  // Function to test SSML support
  const handlePreviewWithSSML = async (voiceName) => {
    if (loading) return;
  
    console.log('Testing SSML support for voice:', voiceName);
  
    const selectedVoiceObj = voices.find((voice) => voice.name === voiceName);
  
    if (!selectedVoiceObj) {
      console.error('Voice not found:', voiceName);
      return alert('Invalid voice selection.');
    }
  
    const languageCode = selectedVoiceObj.languageCodes[0]; // Use the first language code
  
    const ssmlText = `
      <speak>
        <prosody pitch="high" rate="slow">Hello, this is a test with SSML.</prosody>
      </speak>
    `;
  
    setLoading(true);
    setCurrentVoice(voiceName);
  
    try {
      const response = await fetch(`${apiEndpoint}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voice: voiceName,
          languageCode,
          text: ssmlText,
          ssml: true, // Inform the API that SSML is being used
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate preview with SSML');
      }
  
      const data = await response.json();
  
      if (!data.audioBase64) {
        throw new Error('No audio data received for SSML test.');
      }
  
      // Log the response for debugging
      console.log('SSML Response:', data);
  
      // Play the generated SSML audio
      const audio = new Audio(`data:audio/mpeg;base64,${data.audioBase64}`);
      audio.play();
    } catch (error) {
      console.error('Error testing SSML:', error);
      alert('Error testing SSML: ' + error.message);
    } finally {
      setLoading(false);
      setCurrentVoice(null);
    }
  };

  return (
    <div>
      <h2>Voice Preview List</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {voices.map((voice) => (
          <li key={voice.name} style={{ marginBottom: '10px' }}>
            <span>{voice.name}</span>
            <button
              style={{ marginLeft: '10px' }}
              onClick={() => handlePreview(voice.name)}
              disabled={loading && currentVoice === voice.name}
            >
              {loading && currentVoice === voice.name ? 'Loading...' : 'Preview'}
            </button>
            <button
              style={{ marginLeft: '10px' }}
              onClick={() => handlePreviewWithSSML(voice.name)}
              disabled={loading && currentVoice === voice.name}
            >
              {loading && currentVoice === voice.name ? 'Testing SSML...' : 'Test SSML'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoiceListPreview;