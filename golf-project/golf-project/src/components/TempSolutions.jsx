import React, { useState, useEffect } from "react";
import { updateData, readData } from "./databaseUtils";

function TempSolutions() {
  const ans = "a + b = c";
  const [inputValue, setInputValue] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [userData, setUserData] = useState({ score: 0, level: 0, xp: 0 });

  const userId = "user5";

  useEffect(() => {
    // Fetch the current user data from the database
    readData(`users/${userId}`, (data) => {
      if (data) {
        setUserData({
          score: data.score || 0,
          level: data.level || 0,
          xp: data.xp || 0,
        });
      }
    });
  }, [userId]);

  const isAnswerCorrect = (answer) => {
    return answer.trim() === ans;
  };

  const xpForNextLevel = (level) => 100 + level * 50;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAnswerCorrect(inputValue)) {
      let newXP = userData.xp + 10;
      let newLevel = userData.level;
      let newScore = userData.score + 10;

      while (newXP >= xpForNextLevel(newLevel)) {
        newXP -= xpForNextLevel(newLevel);
        newLevel += 1;
      }

      const updatedUserData = {
        score: newScore,
        level: newLevel,
        xp: newXP,
      };
      setUserData(updatedUserData);
      updateData(`users/${userId}`, updatedUserData)
        .then(() => setResultMessage("Correct"))
        .catch((error) => {
          console.error("Error updating data:", error);
          setResultMessage("Error updating data");
        });
    } else {
      setResultMessage("Incorrect");
    }
  };

  return (
    <div>
      <h1>Question 1</h1>
      <h3>Answer the following question:</h3>
      <p>a = 1, b = 2 c = 3</p>
      <p>write the equation using a, b, c, where answer must equal c</p>
      <textarea
        style={{ width: "100%", height: "200px" }}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      ></textarea>
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      {resultMessage && (
        <h1 style={{ color: resultMessage === "Correct" ? "green" : "red" }}>
          {resultMessage}
        </h1>
      )}
    </div>
  );
}

export default TempSolutions;
