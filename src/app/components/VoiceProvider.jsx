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
        if (!response.ok) throw new Error("Failed to fetch voices");

        const data = await response.json();

        const formattedVoices = data.voices.map((voice) => ({
          ...voice,
          formattedName: formatVoiceName(voice.name),
          color:
            voice.ssmlGender === "MALE"
              ? "blue"
              : voice.ssmlGender === "FEMALE"
              ? "pink"
              : "black", // Apply gender-specific color
        }));

        setVoices(formattedVoices);
      } catch (err) {
        console.error("Error fetching voices:", err);
        setError(err.message);
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