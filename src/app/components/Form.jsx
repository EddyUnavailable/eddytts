import React from "react";

const Form = ({
  text,
  setText,
  languageCode,
  setLanguageCode,
  voices = [], // Default to an empty array if voices are undefined
  selectedVoice,
  setSelectedVoice,
  speakingRate,
  setSpeakingRate,
  pitch,
  setPitch,
  volumeGainDb,
  setVolumeGainDb,
  handleSubmit,
  loading,
}) => {
  const submitForm = (e) => {
    e.preventDefault();
    handleSubmit({
      text,
      languageCode,
      name: selectedVoice,
      speakingRate: parseFloat(speakingRate) || 1.0, // Fallback to default
      pitch: parseFloat(pitch) || 0, // Fallback to default
      volumeGainDb: parseFloat(volumeGainDb) || 0, // Fallback to default
    });
  };

  // Function to format the voice name
  const formatVoiceName = (originalName) => {
    const parts = originalName.split("-"); // Split the name by dashes
    const type = parts.slice(2, parts.length - 1).join("-"); // Extract the type (e.g., Chirp3-HD)
    const region = parts[1]; // Extract the region (e.g., US, UK, AU)
    const name = parts[parts.length - 1]; // Extract the actual name (e.g., Achernar)

    return `${name}-${type}-${region}`; // Rearrange to desired format
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
              <option
                key={voice.name}
                value={voice.name}
                style={{ color: voice.color }} // Apply gender-specific color
              >
                {voice.formattedName} ({voice.languageCodes.join(", ")})
              </option>
            ))
          ) : (
            <option value="" disabled>
              No voices available
            </option>
          )}
        </select>
      </div>

      {/* Additional Fields (Speaking Rate, Pitch, Volume Gain) */}
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
        {loading ? "Generating..." : "Convert to Speech"}
      </button>
    </form>
  );
};

export default Form;