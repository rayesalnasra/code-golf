import React, { useEffect, useState } from "react";
import { readData } from "./databaseUtils";

function TempProfile({ score }) {
  const [userData, setUserData] = useState({ name: "", score: 0 });

  useEffect(() => {
    // Fetch user2 data from the database
    readData("users/user2", (data) => {
      if (data) {
        setUserData(data);
      }
    });
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <h3>{userData.name}</h3>
      <p>Score: {userData.score}</p>
    </div>
  );
}

export default TempProfile;
