import React, { useState, useEffect } from "react";

const VoiceProvider = ({ apiEndpoint = "/api/tts/voices", children }) => {
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to format the voice name
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
        const response = await fetch(apiEndpoint, { method: "GET" });
        if (!response.ok) throw new Error(`Failed to fetch voices. Status: ${response.status}`);

        const data = await response.json();

        // Validate and format voices data
        if (!data.voices || !Array.isArray(data.voices)) {
          throw new Error("Invalid response format: 'voices' is missing or not an array.");
        }

        const formattedVoices = data.voices.map((voice) => {
          if (!voice.name || !voice.languageCodes || !voice.ssmlGender) {
            console.warn("Skipping invalid voice data:", voice);
            return null; // Skip invalid voice objects
          }

          return {
            ...voice,
            formattedName: formatVoiceName(voice.name),
            color:
              voice.ssmlGender === "MALE"
                ? "blue"
                : voice.ssmlGender === "FEMALE"
                ? "pink"
                : "black", // Apply gender-specific color
          };
        }).filter(Boolean); // Remove null entries

        setVoices(formattedVoices);
      } catch (err) {
        console.error("Error fetching voices:", err);
        setError(err.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchVoices();
  }, [apiEndpoint]);

  if (loading) return <div>Loading voices...</div>;
  if (error) return <div>Error: {error}</div>;

  // Render children and pass formatted voices as a prop
  return React.cloneElement(children, { voices });
};

export default VoiceProvider;