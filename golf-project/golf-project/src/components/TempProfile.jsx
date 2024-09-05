import React from "react";

function TempProfile({ score }) {
  const userName = "William";

  return (
    <div>
      <h1>Profile</h1>
      <h3>{userName}</h3>
      <p>Score: {score}</p>
    </div>
  );
}

export default TempProfile;
