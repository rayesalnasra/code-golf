import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ProblemSelectionPage.css";

const difficulties = {
  easy: {
    description: "Ideal for beginners. These problems cover basic programming concepts and simple algorithms.",
    problems: [
      { id: "add", title: "Add Two Numbers" },
      { id: "reverse", title: "Reverse String" },
      { id: "palindrome", title: "Check Palindrome" },
      { id: "factorial", title: "Calculate Factorial" },
      { id: "fizzbuzz", title: "FizzBuzz" }
    ]
  },
  medium: {
    description: "Challenges for intermediate programmers. These problems involve more complex algorithms and data structures.",
    problems: [
      { id: "twosum", title: "Two Sum" },
      { id: "validparentheses", title: "Valid Parentheses" },
      { id: "longestsubstring", title: "Longest Substring Without Repeating Characters" },
      { id: "mergeintervals", title: "Merge Intervals" },
      { id: "groupanagrams", title: "Group Anagrams" }
    ]
  },
  hard: {
    description: "Advanced problems for experienced programmers. These challenges often require optimal solutions and advanced algorithms.",
    problems: [
      { id: "mediansortedarrays", title: "Median of Two Sorted Arrays" },
      { id: "regularexpressionmatching", title: "Regular Expression Matching" },
      { id: "trapwater", title: "Trapping Rain Water" },
      { id: "mergeklargelists", title: "Merge k Sorted Lists" },
      { id: "longestvalidparentheses", title: "Longest Valid Parentheses" }
    ]
  }
};

export default function ProblemSelectionPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");

  return (
    <div className="problem-selection-page">
      <h2 className="problem-list-title">Select a Problem:</h2>
      
      <div className="difficulty-selector">
        <label htmlFor="difficulty-select">Difficulty: </label>
        <select 
          id="difficulty-select" 
          value={selectedDifficulty} 
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      
      <p className="difficulty-description">{difficulties[selectedDifficulty].description}</p>
      
      <ul className="problem-list">
        {difficulties[selectedDifficulty].problems.map((problem) => (
          <li key={problem.id} className="problem-item">
            <Link
              to={`/problems/${problem.id}`}
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