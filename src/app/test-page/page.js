'use client';
import React, { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testVoicePreview = async () => {
    setLoading(true);
    setResult('');
  
    try {
      const response = await fetch('/api/tts/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voice: 'en-US-Studio-O',
          languageCode: 'en-US'
        }),
      });
  
      const data = await response.json();
      console.log('API Response:', data);
  
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to generate preview');
      }
  
      if (!data.audioBase64) {
        setResult('❌ No audioBase64 returned. Please check the API response.');
      } else {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audioBase64}`);
        audio.onerror = () => setResult('❌ Failed to play the audio.');
        audio.play();
        setResult('✅ Audio preview played successfully.');
      }
    } catch (err) {
      console.error('❌ Error:', err.message);
      setResult(`❌ Error: ${err.message}. Please ensure the API is working correctly.`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test Audio Preview</h1>
      <button onClick={testVoicePreview} disabled={loading}>
        {loading ? 'Testing...' : 'Test Voice Preview'}
      </button>
      <p>{result}</p>
    </div>
  );
}