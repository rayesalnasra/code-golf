import React, { useState, useEffect } from "react";
import { readData, updateData } from "./databaseUtils";

// ToDo:
// 1. Fix code so that user score is update in the database.
// 2. Separate into pages.

function TempSolutions({ incrementScore }) {
  const ans = "a + b = c";
  const [inputValue, setInputValue] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [currentScore, setCurrentScore] = useState(0);

  const userId = "user2";

  useEffect(() => {
    // Fetch the current score from the database
    readData(`users/${userId}`, (data) => {
      if (data && data.score !== undefined) {
        setCurrentScore(data.score);
      }
    });
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === ans) {
      setResultMessage("Correct");
      incrementScore();
      const newScore = currentScore + 1;
      setCurrentScore(newScore);
      updateData(`users/${userId}`, { score: newScore });
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
