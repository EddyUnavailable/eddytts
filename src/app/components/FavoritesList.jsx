"use client";
import React from "react";

const FavoritesList = ({ favorites, onRemove }) => {
  if (!favorites.length) return <p>No favorites yet</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {favorites.map((name) => (
        <li key={name}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem 0",
              borderBottom: "1px solid #ccc"
            }}
          >
            <p style={{ margin: 0 }}>{name}</p>
            <button
              onClick={() => onRemove(name)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              ❌
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FavoritesList;
