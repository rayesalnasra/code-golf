import React, { useState } from "react";

function TempSolutions({ incrementScore }) {
  const ans = "a + b = c";
  const [inputValue, setInputValue] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === ans) {
      setResultMessage("Correct");
      incrementScore();
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
