"use client";
import React from "react";

const FavoritesList = ({ favorites, onRemove }) => {
  if (!favorites.length) return <p>No favorites yet</p>;

  return (
    <ul>
      {favorites.map((name) => (
        <li key={name}>
          {name}
          <button onClick={() => onRemove(name)}>❌</button>
        </li>
      ))}
    </ul>
  );
};

export default FavoritesList;
