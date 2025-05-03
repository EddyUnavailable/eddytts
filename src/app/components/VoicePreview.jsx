const VoicePreview = ({ previewAudio }) => {
    if (!previewAudio) return null;
  
    return (
      <div>
        <h2>Voice Preview:</h2>
        <audio controls>
          <source src={`data:audio/mpeg;base64,${previewAudio}`} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  };
  
  export default VoicePreview;