// components/UserStats.jsx
import React from "react";

export default function UserStats({ user }) {
  return (
    <div className="user-stats">
      {/* Display user level */}
      <p>Level: {user.level}</p>
      {/* Display user's experience points (XP) and the next level's requirement */}
      <p>XP: {user.xp} / {100 + (user.level * 50)}</p>
      {/* Display user score */}
      <p>Score: {user.score}</p>
    </div>
  );
}
