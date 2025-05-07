"use client";
import React, { useState, useEffect, useMemo } from "react";
import styles from "../css/voiceListPreview.module.css";
import { useAudioPlayer } from "./AudioPlayerContext";

// Utility function to format voice names
const formatVoiceName = (name) => {
  const parts = name.split("-");
  const type = parts.slice(2, parts.length - 1).join("-");
  const region = parts[1];
  const person = parts[parts.length - 1];
  return `${person}-${type}-${region}`;
};

const VoiceListPreview = ({ voices = [], apiEndpoint = "/api/tts" }) => {
  const [loading, setLoading] = useState(false);
  const [currentVoice, setCurrentVoice] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeAudio, setActiveAudio] = useState(null); // ✅ Add state for activeAudio
  const { playBase64 } = useAudioPlayer();

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    setFavorites(saved ? JSON.parse(saved) : []);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Clean up activeAudio on unmount
  useEffect(() => {
    return () => {
      if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      }
    };
  }, [activeAudio]);

  // Memoize sorted voices
  const sortedVoices = useMemo(() => {
    return [...voices].sort((a, b) =>
      formatVoiceName(a.name).localeCompare(formatVoiceName(b.name))
    );
  }, [voices]);

  const handlePreview = async (voiceName) => {
    if (loading) return;
  
    console.log("Previewing voice:", voiceName);
  
    const selectedVoiceObj = voices.find((voice) => voice.name === voiceName);
    if (!selectedVoiceObj) {
      console.error("Voice not found:", voiceName);
      alert("Invalid voice selection.");
      return;
    }
  
    // Get the language code from the selected voice
    const languageCode = selectedVoiceObj.languageCodes[0];
  
    setLoading(true);
    setCurrentVoice(voiceName);
  
    try {
      const response = await fetch(`${apiEndpoint}/preview`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_TTS_API_KEY // Add the API key
        },
        body: JSON.stringify({ 
          voice: voiceName,
          languageCode: languageCode, // Add the language code
          text: "This is a voice preview." // Optional: use default from server
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          errorData || `Preview failed with status: ${response.status}`
        );
      }
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (!data.audioBase64) {
        throw new Error("No audio data returned from the API.");
      }
  
      playBase64(data.audioBase64);
    } catch (error) {
      console.error("Error generating preview:", error);
      alert(`Error generating preview: ${error.message}`);
    } finally {
      setLoading(false);
      setCurrentVoice(null);
    }
  };

  const toggleFavorite = (voiceName) => {
    setFavorites((prev) =>
      prev.includes(voiceName)
        ? prev.filter((v) => v !== voiceName)
        : [...prev, voiceName]
    );
  };

  return (
    <div>
      <h2>Voice Preview List</h2>
      <ul className={styles.voiceListContainer}>
        {sortedVoices.map((voice) => (
          <li
            key={voice.name}
            className={`${styles.voiceListItem} ${
              favorites.includes(voice.name) ? styles.voiceListItemFavorite : ""
            }`}
            onClick={() => handlePreview(voice.name)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handlePreview(voice.name);
              }
            }}
            aria-label={`Preview voice ${voice.name}`}
          >
            <span
              className={
                loading && currentVoice === voice.name
                  ? styles.voiceNameLoading
                  : styles.voiceName
              }
              style={{
                color:
                  voice.ssmlGender === "MALE"
                    ? "blue"
                    : voice.ssmlGender === "FEMALE"
                    ? "pink"
                    : "black",
              }}
            >
              {voice.name}
            </span>
            <button
              className={styles.favoriteButton}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(voice.name);
              }}
              aria-label={
                favorites.includes(voice.name)
                  ? `Remove ${voice.name} from favorites`
                  : `Add ${voice.name} to favorites`
              }
            >
              {favorites.includes(voice.name) ? "★ Remove" : "☆ Add"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoiceListPreview;