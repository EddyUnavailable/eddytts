import React from 'react';

const GeneratedAudio = ({ playWithoutSaving, audioBase64, audioPath }) => {
  return (
    <div>
      {playWithoutSaving && audioBase64 ? (
        <>
          <h2>Generated Audio:</h2>
          <audio controls aria-label="Generated audio preview">
            <source src={`data:audio/mpeg;base64,${audioBase64}`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </>
      ) : !playWithoutSaving && audioPath ? (
        <>
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
        </>
      ) : (
        <>
          <h2>No Audio Available</h2>
          <p>Please generate audio to preview or download it here.</p>
        </>
      )}
    </div>
  );
};

export default GeneratedAudio;