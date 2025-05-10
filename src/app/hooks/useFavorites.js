import { useReducer, useEffect, useRef } from "react";

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
  const loaded = useRef(false);

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
      loaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && loaded.current) {
      console.log("[Favorites] Saving to localStorage:", favorites);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const toggleFavorite = (voiceName) => {
    dispatch({ type: "TOGGLE", payload: voiceName });
  };

  return { favorites, toggleFavorite };
}
