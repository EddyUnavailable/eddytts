const GeneratedAudio = ({ playWithoutSaving, audioBase64, audioPath }) => {
    if (playWithoutSaving && audioBase64) {
      return (
        <div>
          <h2>Generated Audio:</h2>
          <audio controls>
            <source src={`data:audio/mpeg;base64,${audioBase64}`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }
  
    if (!playWithoutSaving && audioPath) {
      return (
        <div>
          <h2>Generated MP3:</h2>
          <audio controls>
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
  
    return null;
  };
  
  export default GeneratedAudio;