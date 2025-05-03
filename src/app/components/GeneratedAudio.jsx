import React from 'react';

const GeneratedAudio = ({ audioSamples, onDelete }) => {
  if (audioSamples.length === 0) {
    return (
      <div>
        <h2>No Audio Available</h2>
        <p>Please generate audio to preview or download it here.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Generated Audio Samples:</h2>
      {audioSamples.map((sample) => (
        <div key={sample.id} style={{ marginBottom: '16px' }}>
          {sample.base64 ? (
            <audio controls aria-label="Generated audio preview">
              <source src={`data:audio/mpeg;base64,${sample.base64}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <div>
              <audio controls aria-label="Generated MP3 preview">
                <source src={sample.path} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <p>
                <a href={sample.path} target="_blank" rel="noopener noreferrer">
                  Download MP3
                </a>
              </p>
            </div>
          )}
          <button onClick={() => onDelete(sample.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default GeneratedAudio;