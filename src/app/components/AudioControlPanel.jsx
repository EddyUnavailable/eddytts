import { useAudioPlayer } from './AudioPlayerContext';

function AudioControlPanel() {
  const {
    playBase64,
    pause,
    resume,
    stop,
    setVolume,
    isPlaying,
    isLoading,
    error
  } = useAudioPlayer();

  return (
    <div>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button>
      <button onClick={stop}>Stop</button>
      <input type="range" min="0" max="1" step="0.01" onChange={(e) => setVolume(parseFloat(e.target.value))} />
      {isLoading && <p>Loading audio...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
