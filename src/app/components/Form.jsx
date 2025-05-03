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
      speakingRate: parseFloat(speakingRate),
      pitch: parseFloat(pitch),
      volumeGainDb: parseFloat(volumeGainDb),
      format: audioFormat,
      sampleRateHertz: parseInt(sampleRate, 10),
      playWithoutSaving,
      ssml: useSSML,
    });
  };

  return (
    <form onSubmit={submitForm}>
      <div>
        <label>
          <strong>Text:</strong>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text here..."
            required
          />
        </label>
      </div>
      <div>
        <label>
          <strong>Use SSML:</strong>
          <input
            type="checkbox"
            checked={useSSML}
            onChange={(e) => setUseSSML(e.target.checked)}
          />
        </label>
      </div>
      <div>
        <label>
          <strong>Language Code:</strong>
          <select
            value={languageCode}
            onChange={(e) => setLanguageCode(e.target.value)}
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="en-AU">English (AU)</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          <strong>Voice:</strong>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            required
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.languageCodes.join(', ')})
              </option>
            ))}
          </select>
          <button type="button" onClick={handlePreview} disabled={loading}>
            Preview Voice
          </button>
        </label>
      </div>
      {/* Additional form fields for gender, speaking rate, pitch, etc. */}
      <button type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Convert to Speech'}
      </button>
    </form>
  );
};

export default Form;