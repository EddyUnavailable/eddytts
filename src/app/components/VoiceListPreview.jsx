'use client';
import React, { useState, useEffect, useMemo } from "react";
import styles from "../css/voiceListPreview.module.css";
import { useAudioPlayer } from "./AudioPlayerContext";

const VoiceListPreview = ({ voices, favorites, toggleFavorite, apiEndpoint = "/api/tts" }) => {
  const [loading, setLoading] = useState(false);
  const [currentVoice, setCurrentVoice] = useState(null);
  const [activeAudio, setActiveAudio] = useState(null);
  const { playBase64 } = useAudioPlayer();

  useEffect(() => {
    return () => {
      if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      }
    };
  }, [activeAudio]);

  const sortedVoices = useMemo(() => {
    if (!voices) return [];
    return [...voices].sort((a, b) =>
      a.formattedName.localeCompare(b.formattedName)
    );
  }, [voices]);

  const handlePreview = async (voiceName) => {
    if (loading) return;

    const selectedVoiceObj = voices.find((voice) => voice.name === voiceName);
    if (!selectedVoiceObj) {
      console.error("Selected voice not found:", voiceName);
      return;
    }

    const languageCode = selectedVoiceObj.languageCodes[0];

    console.log("Starting preview for:", voiceName); // Debugging line
    setLoading(true);
    setCurrentVoice(voiceName);

    try {
      const response = await fetch(`${apiEndpoint}/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_TTS_API_KEY,
        },
        body: JSON.stringify({
          voice: voiceName,
          languageCode,
          text: "This is a voice preview.",
        }),
      });

      const data = await response.json();
      console.log("Preview data received:", data); // Debugging line
      if (data.audioBase64) {
        playBase64(data.audioBase64);
      } else {
        console.error("No audio data received");
      }
    } catch (error) {
      console.error("Preview error:", error);
    } finally {
      setLoading(false);
      setCurrentVoice(null);
    }
  };

  return (
    <div>
      <h2>Voice Preview List</h2>
      <ul className={styles.voiceListContainer}>
        {sortedVoices.map((voice) => (
          <li key={voice.name} className={styles.voiceListItem}>
            <span
              style={{ color: voice.color, cursor: "pointer" }}
              onClick={() => handlePreview(voice.name)}
            >
              {voice.formattedName}
            </span>
            <button onClick={() => toggleFavorite(voice.name)}>
              {favorites.includes(voice.name) ? "★ Remove" : "☆ Add"}
            </button>
            {currentVoice === voice.name && loading && (
              <span>Loading preview...</span> // Show loading text when previewing
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoiceListPreview;
