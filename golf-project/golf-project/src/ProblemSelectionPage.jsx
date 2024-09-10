import React from "react";
import { Link } from "react-router-dom";

const problems = [
  { id: "add", title: "Add Two Numbers" },
  { id: "reverse", title: "Reverse String" },
];

export default function ProblemSelectionPage() {
  return (
    <div className="home-page">
      <h2 className="problem-list-title">Select a Problem:</h2>
      <ul className="problem-list">
        {problems.map((problem) => (
          <li key={problem.id} className="problem-item">
            <Link
              to={`/problem/${problem.id}`}
              className="problem-link"
            >
              {problem.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}