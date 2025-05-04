"use client";
import React, { useState, useEffect } from "react";
import styles from "/home/eddy/workshop/eddytts/src/app/css/voiceListPreview.module.css";

const VoiceListPreview = ({ voices = [], apiEndpoint }) => {
  const [loading, setLoading] = useState(false);
  const [currentVoice, setCurrentVoice] = useState(null);
  const [activeAudio, setActiveAudio] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [sortedVoices, setSortedVoices] = useState([]);

  // Load favorites from local storage on mount
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Cleanup active audio on component unmount
  useEffect(() => {
    return () => {
      if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
        setActiveAudio(null);
      }
    };
  }, [activeAudio]);

  // Function to rearrange voice name
  const formatVoiceName = (originalName) => {
    const parts = originalName.split("-"); // Split the name by dashes
    const type = parts.slice(2, parts.length - 1).join("-"); // Extract the type (e.g., Chirp3-HD)
    const region = parts[1]; // Extract the region (e.g., US, UK, AU)
    const name = parts[parts.length - 1]; // Extract the actual name (e.g., Achernar)

    return `${name}-${type}-${region}`; // Rearrange the components
  };

  // Sort voices by name on component mount or when voices change
  useEffect(() => {
    const sorted = [...voices].sort((a, b) => {
      const nameA = formatVoiceName(a.name).toLowerCase();
      const nameB = formatVoiceName(b.name).toLowerCase();
      return nameA.localeCompare(nameB); // Compare alphabetically
    });
    setSortedVoices(sorted);
  }, [voices]);

  // Function to preview a voice
  const handlePreview = async (voiceName) => {
    if (loading) return;

    console.log("Previewing voice:", voiceName);

    const selectedVoiceObj = voices.find((voice) => voice.name === voiceName);

    if (!selectedVoiceObj) {
      console.error("Voice not found:", voiceName);
      return alert("Invalid voice selection.");
    }

    setLoading(true);
    setCurrentVoice(voiceName);

    try {
      const response = await fetch(`${apiEndpoint}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voice: voiceName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate preview");
      }

      const data = await response.json();

      if (!data.audioBase64) {
        throw new Error("Preview failed: No audio data received.");
      }

      if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      }

      const audio = new Audio(`data:audio/mpeg;base64,${data.audioBase64}`);
      audio.play();
      setActiveAudio(audio);
    } catch (error) {
      console.error("Error generating preview:", error);
      alert("Error generating preview: " + error.message);
    } finally {
      setLoading(false);
      setCurrentVoice(null);
    }
  };

  // Function to toggle favorite voices
  const toggleFavorite = (voiceName) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(voiceName)
        ? prevFavorites.filter((name) => name !== voiceName)
        : [...prevFavorites, voiceName]
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
            onClick={() => handlePreview(voice.name)} // Trigger preview on name click
          >
            {/* Display formatted voice name with gender-specific color */}
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
              {formatVoiceName(voice.name)}
            </span>

            {/* Favorite button */}
            <button
              className={styles.favoriteButton}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the preview
                toggleFavorite(voice.name);
              }}
            >
              {favorites.includes(voice.name)
                ? "★ Remove Favorite"
                : "☆ Add to Favorites"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoiceListPreview;