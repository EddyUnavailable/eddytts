// app/hooks/useVoices.js
import { useEffect, useState } from "react";

// Custom hook to fetch and format voice data
export function useVoices(apiEndpoint = "/api/tts/voices") {
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatVoiceName = (originalName) => {
    const parts = originalName.split("-");
    const type = parts.slice(2, parts.length - 1).join("-");
    const region = parts[1];
    const name = parts[parts.length - 1];
    return `${name}-${type}-${region}`;
  };

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

  return { voices, loading, error };
}
