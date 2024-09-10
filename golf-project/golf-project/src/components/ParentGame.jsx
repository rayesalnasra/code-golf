import React, { useState } from "react";
import TempSolutions from "./TempSolutions";
import TempProfile from "./TempProfile";
import TempLeaderboard from "./TempLeaderboard";

function ParentGame() {
  const [score, setScore] = useState(0);

  const incrementScore = () => {
    setScore(score + 1);
  };

  return (
    <div>
      <TempProfile score={score} />
      <TempSolutions incrementScore={incrementScore} />
      <TempLeaderboard />
    </div>
  );
}

export default ParentGame;
