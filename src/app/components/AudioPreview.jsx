import React, { useState } from 'react';

const AudioPreview = ({ selectedVoice, voices, apiEndpoint }) => {
  const [previewAudio, setPreviewAudio] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePreview = async () => {
    console.log('Previewing voice:', selectedVoice); // Debugging
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

      if (!data.audioBase64) {
        console.error('Preview API did not return audioBase64:', data); // Debugging
        return alert('Preview failed: No audio data received.');
      }

      console.log('Preview audioBase64 received:', data.audioBase64); // Debugging

      setPreviewAudio(data.audioBase64);
    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Error generating preview: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Audio Preview</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        previewAudio && (
          <audio controls aria-label="Voice preview">
            <source src={`data:audio/mpeg;base64,${previewAudio}`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )
      )}
      <button onClick={handlePreview} disabled={loading}>
        Preview Voice
      </button>
    </div>
  );
};

export default AudioPreview;