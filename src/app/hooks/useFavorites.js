import { useReducer, useEffect, useRef, useState } from "react";

function favoritesReducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return action.payload;
    case "TOGGLE":
      return state.includes(action.payload)
        ? state.filter((name) => name !== action.payload)
        : [...state, action.payload];
    default:
      return state;
  }
}

export function useFavorites() {
  const [favorites, dispatch] = useReducer(favoritesReducer, []);
  const [hydrated, setHydrated] = useState(false); // <- Ensures load completes first

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites");
      console.log("[Favorites] Loaded from localStorage:", saved);
      if (saved) {
        try {
          dispatch({ type: "LOAD", payload: JSON.parse(saved) });
        } catch (err) {
          console.error("Failed to parse favorites:", err);
        }
      }
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && hydrated) {
      console.log("[Favorites] Saving to localStorage:", favorites);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, hydrated]);

  const toggleFavorite = (voiceName) => {
    dispatch({ type: "TOGGLE", payload: voiceName });
  };

  return { favorites, toggleFavorite };
}
