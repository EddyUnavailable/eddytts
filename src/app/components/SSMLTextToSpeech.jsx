"use client";
import React, { useState, useEffect } from "react";
import styles from "../css/voiceListPreview.module.css"; // adjust as needed

const VoiceListPreview = ({ voices = [], apiEndpoint = "/api/tts" }) => {
  const [loading, setLoading] = useState(false);
  const [currentVoice, setCurrentVoice] = useState(null);
  const [activeAudio, setActiveAudio] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [sortedVoices, setSortedVoices] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    setFavorites(saved ? JSON.parse(saved) : []);
  }, []);

  // Save favorites when changed
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      }
    };
  }, [activeAudio]);

  // Format and sort voices when prop updates
  useEffect(() => {
    const formatVoiceName = (originalName) => {
      const parts = originalName.split("-");
      const type = parts.slice(2, parts.length - 1).join("-");
      const region = parts[1];
      const name = parts[parts.length - 1];
      return `${name}-${type}-${region}`;
    };

    const sorted = [...voices].sort((a, b) =>
      formatVoiceName(a.name).localeCompare(formatVoiceName(b.name))
    );
    setSortedVoices(sorted);
  }, [voices]);

  const handlePreview = async (voiceName) => {
    if (loading) return;
    const selectedVoice = voices.find((v) => v.name === voiceName);
    if (!selectedVoice) return alert("Voice not found.");

    setLoading(true);
    setCurrentVoice(voiceName);

    try {
      const res = await fetch(`${apiEndpoint}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voice: voiceName }),
      });

      const { audioBase64 } = await res.json();
      if (!audioBase64) throw new Error("No audio returned.");

      if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      }

      const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
      audio.play();
      setActiveAudio(audio);
    } catch (err) {
      alert("Preview error: " + err.message);
      console.error(err);
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
              {voice.formattedName || voice.name}
            </span>
            <button
              className={styles.favoriteButton}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(voice.name);
              }}
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
