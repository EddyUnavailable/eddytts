import React from 'react';

const Form = ({
  text,
  setText,
  languageCode,
  setLanguageCode,
  voices,
  selectedVoice,
  setSelectedVoice,
  gender,
  setGender,
  speakingRate,
  setSpeakingRate,
  pitch,
  setPitch,
  volumeGainDb,
  setVolumeGainDb,
  audioFormat,
  setAudioFormat,
  sampleRate,
  setSampleRate,
  playWithoutSaving,
  setPlayWithoutSaving,
  useSSML,
  setUseSSML,
  handleSubmit,
  loading,
  handlePreview,
}) => {
  const submitForm = (e) => {
    e.preventDefault();
    handleSubmit({
      text,
      languageCode,
      name: selectedVoice,
      gender,
      speakingRate: parseFloat(speakingRate) || 1.0, // Fallback to default
      pitch: parseFloat(pitch) || 0, // Fallback to default
      volumeGainDb: parseFloat(volumeGainDb) || 0, // Fallback to default
      format: audioFormat,
      sampleRateHertz: parseInt(sampleRate, 10) || 24000, // Fallback to default
      playWithoutSaving,
      ssml: useSSML,
    });
  };

  return (
    <form onSubmit={submitForm}>
      {/* Text Input */}
      <div>
        <label htmlFor="text-input">
          <strong>Text:</strong>
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
          required
          aria-describedby="text-input-desc"
        />
        <small id="text-input-desc">Enter the text to convert to speech.</small>
      </div>

      {/* Play Without Saving */}
      <div>
        <label htmlFor="play-without-saving">
          <strong>Play Without Saving:</strong>
        </label>
        <input
          id="play-without-saving"
          type="checkbox"
          checked={playWithoutSaving}
          onChange={(e) => setPlayWithoutSaving(e.target.checked)}
          aria-describedby="play-without-saving-desc"
        />
        <small id="play-without-saving-desc">Option to listen to the generated audio without saving it.</small>
      </div>

      {/* Use SSML */}
      <div>
        <label htmlFor="use-ssml">
          <strong>Use SSML:</strong>
        </label>
        <input
          id="use-ssml"
          type="checkbox"
          checked={useSSML}
          onChange={(e) => setUseSSML(e.target.checked)}
        />
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
          {voices.length > 0 ? (
            voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.languageCodes.join(', ')})
              </option>
            ))
          ) : (
            <option value="" disabled>
              No voices available
            </option>
          )}
        </select>
        <button
          type="button"
          onClick={handlePreview}
          disabled={loading || !selectedVoice}
          aria-label="Preview Selected Voice"
        >
          {loading ? 'Previewing...' : 'Preview Voice'}
        </button>
      </div>

      {/* Additional Fields (Gender, Speaking Rate, Pitch, etc.) */}
      <div>
        <label htmlFor="speaking-rate">
          <strong>Speaking Rate:</strong>
        </label>
        <input
          id="speaking-rate"
          type="number"
          min="0.25"
          max="4.0"
          step="0.1"
          value={speakingRate}
          onChange={(e) => setSpeakingRate(e.target.value)}
          aria-label="Set Speaking Rate"
        />
      </div>
      <div>
        <label htmlFor="pitch">
          <strong>Pitch:</strong>
        </label>
        <input
          id="pitch"
          type="number"
          min="-20.0"
          max="20.0"
          step="0.1"
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          aria-label="Set Pitch"
        />
      </div>
      <div>
        <label htmlFor="volume-gain">
          <strong>Volume Gain (dB):</strong>
        </label>
        <input
          id="volume-gain"
          type="number"
          min="-96.0"
          max="16.0"
          step="0.1"
          value={volumeGainDb}
          onChange={(e) => setVolumeGainDb(e.target.value)}
          aria-label="Set Volume Gain"
        />
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={loading} aria-label="Submit Form">
        {loading ? 'Generating...' : 'Convert to Speech'}
      </button>
    </form>
  );
};

export default Form;