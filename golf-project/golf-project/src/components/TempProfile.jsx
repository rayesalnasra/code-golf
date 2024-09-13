import React, { useEffect, useState } from "react";
import { readData } from "./databaseUtils"; // Ensure the path is correct

const userId = "user5";

function TempProfile() {
  const [userData, setUserData] = useState({
    name: "",
    score: 0,
    level: 0,
    xp: 0,
  });

  useEffect(() => {
    // Fetch user2 data from the database
    readData(`users/${userId}`, (data) => {
      if (data) {
        setUserData(data);
      }
    });
  }, []);

  const xpForNextLevel = (level) => 100 + level * 50;

  return (
    <div>
      <h1>Profile</h1>
      <h3>{userData.name}</h3>
      <p>Score: {userData.score}</p>
      <p>Level: {userData.level}</p>
      <p>
        XP: {userData.xp}/{xpForNextLevel(userData.level)}
      </p>
    </div>
  );
}

export default TempProfile;
