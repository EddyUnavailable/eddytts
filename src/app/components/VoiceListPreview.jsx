"use client";
import React, { useState } from "react";
import { useAudioPlayer } from "./AudioPlayerContext";
import styles from "../css/voiceListPreview.module.css";

const VoiceListPreview = ({ voices = [], favorites = [], toggleFavorite }) => {
  const [loadingVoice, setLoadingVoice] = useState(null);
  const [error, setError] = useState(null);
  const { playBase64, stop } = useAudioPlayer();

  const handlePreview = async (voiceName) => {
  if (loadingVoice) return;

  const selectedVoice = voices.find((v) => v.name === voiceName);
  if (!selectedVoice) {
    setError("Voice not found.");
    return;
  }

  setLoadingVoice(voiceName);
  setError(null);
  stop(); // Stop previous audio

  try {
    // Wait 1 second before continuing (give time to clear audio)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // console.log(`Requesting preview for voice: ${voiceName}`);

    const response = await fetch(`/api/tts/preview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voice: voiceName,
        languageCode: selectedVoice.languageCodes[0],
        text: "This is a voice preview.",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch audio preview. Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.audioBase64) {
      // console.log("Base64 audio data received:", data.audioBase64);
      await playBase64(data.audioBase64);
    } else {
      throw new Error("No audio data received");
    }

  } catch (err) {
    console.error("Preview failed:", err);
    setError("Failed to preview voice");
  } finally {
    setLoadingVoice(null);
  }
};

  return (
    <div>
      <div className={styles.vlpWrapper}>
        <div className={styles.vlpTitle}>
          <h2 className={styles.vlpTitleText}>Voice Preview List</h2>
        </div>
        <div className={styles.voiceError}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
        <ul className={styles.voiceListContainer}>
          {voices.map((voice) => (
            <li key={voice.name} className={styles.voiceListItem}>
              <span
                className={styles.voiceName}
                style={{ color: voice.color }}
                onClick={() => handlePreview(voice.name)}
              >
                {voice.formattedName}
              </span>

              <button className={styles.butFav} onClick={() => toggleFavorite(voice.name)}>
                {favorites.includes(voice.name) ? "★ Remove" : "☆ Add"}
              </button>

              {loadingVoice === voice.name && <span className={styles.loadingText}>Loading...</span>}
            </li>
          ))}
        </ul>
        {!voices.length && <p>No voices available.</p>}
      
      </div>
    </div>
  );
};

export default VoiceListPreview;
