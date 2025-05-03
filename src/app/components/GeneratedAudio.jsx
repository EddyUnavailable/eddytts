import React from 'react';

const GeneratedAudio = ({ playWithoutSaving, audioBase64, audioPath }) => {
  // Render base64 audio if "playWithoutSaving" is true and audioBase64 is provided
  if (playWithoutSaving && audioBase64) {
    return (
      <div>
        <h2>Generated Audio:</h2>
        <audio controls aria-label="Generated audio preview">
          <source src={`data:audio/mpeg;base64,${audioBase64}`} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  // Render audio from a downloadable path if "playWithoutSaving" is false and audioPath is provided
  if (!playWithoutSaving && audioPath) {
    return (
      <div>
        <h2>Generated MP3:</h2>
        <audio controls aria-label="Generated MP3 preview">
          <source src={audioPath} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <p>
          <a href={audioPath} target="_blank" rel="noopener noreferrer">
            Download MP3
          </a>
        </p>
      </div>
    );
  }

  // Fallback message if no audio is available
  return (
    <div>
      <h2>No Audio Available</h2>
      <p>Please generate audio to preview or download it here.</p>
    </div>
  );
};

export default GeneratedAudio;