import { useReducer, useEffect } from "react";

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

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites");
      if (saved) {
        dispatch({ type: "LOAD", payload: JSON.parse(saved) });
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const toggleFavorite = (voiceName) => {
    dispatch({ type: "TOGGLE", payload: voiceName });
  };

  return { favorites, toggleFavorite };
}
