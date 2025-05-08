import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (voiceName) => {
    setFavorites((prev) =>
      prev.includes(voiceName)
        ? prev.filter((name) => name !== voiceName)
        : [...prev, voiceName]
    );
  };

  return { favorites, toggleFavorite };
}
