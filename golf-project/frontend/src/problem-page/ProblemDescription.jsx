// components/ProblemDescription.jsx
import React from "react";

export default function ProblemDescription({ description }) {
  return (
    // Render the problem description as a heading
    <h2 className="problem-description">{description}</h2>
  );
}
