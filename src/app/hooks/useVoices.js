// app/hooks/useVoices.js
import { useEffect, useState } from "react";

export function useVoices(apiEndpoint = "/api/tts/voices") {
  const [voices, setVoices] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const nameKey = {
    Chirp3: 'C3',
    Zubenelgenubi: 'Zub',
    Polyglot: 'PG',
    Studio: 'ST',
    // Add more mappings as needed
  };

  function formatVoiceName(name) {
    let cleaned = name.replace(/^en-/, '');
    Object.keys(nameKey).forEach((longName) => {
      cleaned = cleaned.replace(longName, nameKey[longName]);
    });
    return cleaned;
  }

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch voices. Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.voices || !Array.isArray(data.voices)) {
          throw new Error("Invalid response format: 'voices' is missing or not an array.");
        }

        const formattedVoices = data.voices.map((voice) => {
          if (!voice.name || !voice.languageCodes || !voice.ssmlGender) return null;
          return {
            ...voice,
            formattedName: formatVoiceName(voice.name),
            color:
              voice.ssmlGender === "MALE"
                ? "blue"
                : voice.ssmlGender === "FEMALE"
                ? "pink"
                : "black",
          };
        }).filter(Boolean);

        setVoices(formattedVoices);
      } catch (err) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchVoices();
  }, [apiEndpoint]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (voiceName) => {
    setFavorites(prev =>
      prev.includes(voiceName)
        ? prev.filter(name => name !== voiceName)
        : [...prev, voiceName]
    );
  };

  return { voices, favorites, toggleFavorite, loading, error };
}
