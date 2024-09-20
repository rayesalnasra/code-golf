import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ProblemSelectionPage.css";

const difficulties = {
  easy: {
    description: "Ideal for beginners. These problems cover basic programming concepts and simple algorithms.",
    emoji: "🌱",
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
    emoji: "🌿",
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
    emoji: "🌳",
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
      <div className="content-container">
        <h1 className="page-title">Problem Selection 🧩</h1>
        
        <section className="difficulty-section">
          <h2>Choose Your Challenge</h2>
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
          
          <p className="difficulty-description">
            {difficulties[selectedDifficulty].emoji} {difficulties[selectedDifficulty].description}
          </p>
        </section>
        
        <section className="problem-list-section">
          <h2>Available Problems</h2>
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
        </section>

        <section className="problem-selection-info">
          <h2>Tips for Problem Solving 💡</h2>
          <ul>
            <li>Start with easier problems and gradually increase difficulty</li>
            <li>Read the problem statement carefully before beginning</li>
            <li>Plan your approach before writing code</li>
            <li>Test your solution with various inputs</li>
            <li>After solving, look for ways to optimize your code</li>
          </ul>
        </section>
      </div>
    </div>
  );
}