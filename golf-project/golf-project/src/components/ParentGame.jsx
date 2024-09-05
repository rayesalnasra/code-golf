import React, { useState } from "react";
import TempSolutions from "./TempSolutions";
import TempProfile from "./TempProfile";

function ParentGame() {
  const [score, setScore] = useState(0);

  const incrementScore = () => {
    setScore(score + 1);
  };

  return (
    <div>
      <TempProfile score={score} />
      <TempSolutions incrementScore={incrementScore} />
    </div>
  );
}

export default ParentGame;
