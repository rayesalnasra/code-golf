// components/UserStats.jsx
import React from "react";

export default function UserStats({ user }) {
  return (
    <div className="user-stats">
      <p>Level: {user.level}</p>
      <p>XP: {user.xp} / {100 + (user.level * 50)}</p>
      <p>Score: {user.score}</p>
    </div>
  );
}