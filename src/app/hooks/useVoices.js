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

  // Initialize favorites from localStorage when the component mounts (only runs on client side)
  useEffect(() => {
  if (typeof window !== "undefined") {
    const savedFavorites = localStorage.getItem('favorites');
    try {
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
        console.log("Loaded favorites from localStorage:", savedFavorites); // Debug log
      }
    } catch (error) {
      console.error("Error parsing favorites from localStorage:", error);
      localStorage.removeItem('favorites'); // In case there's malformed data
    }
  }
}, []);

useEffect(() => {
  if (typeof window !== "undefined") {
    if (favorites.length > 0) {
      console.log("Saving favorites to localStorage:", favorites); // Debug log
      try {
        localStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error);
      }
    }
  }
}, [favorites]);// Store favorites whenever they change

  // Function to toggle the favorite state
  const toggleFavorite = (voiceName) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(voiceName)
        ? prevFavorites.filter((name) => name !== voiceName) // Remove from favorites
        : [...prevFavorites, voiceName]; // Add to favorites

      return newFavorites; // This triggers the effect to update localStorage
    });
  };

  return { voices, favorites, toggleFavorite, loading, error };
}
