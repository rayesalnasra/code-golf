// MySolutionsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserSolutions } from '../firebase/firebaseCodeRunner';
import './MySolutionsPage.css';

// Mapping problem IDs to their titles
const problemTitles = {
  add: "Add Two Numbers",
  reverse: "Reverse String",
  palindrome: "Check Palindrome",
  factorial: "Calculate Factorial",
  fizzbuzz: "FizzBuzz",
  twosum: "Two Sum",
  validparentheses: "Valid Parentheses",
  longestsubstring: "Longest Substring Without Repeating Characters",
  mergeintervals: "Merge Intervals",
  groupanagrams: "Group Anagrams",
  mediansortedarrays: "Median of Two Sorted Arrays",
  regularexpressionmatching: "Regular Expression Matching",
  trapwater: "Trapping Rain Water",
  mergeklargelists: "Merge k Sorted Lists",
  longestvalidparentheses: "Longest Valid Parentheses"
};

export default function MySolutionsPage() {
  // State for storing solutions, loading status, and error message
  const [solutions, setSolutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user solutions when the component mounts
  useEffect(() => {
    fetchUserSolutions();
  }, []);

  const fetchUserSolutions = async () => {
    setIsLoading(true);
    setError(null);
    const userId = localStorage.getItem('userUID');

    // Check if the user is authenticated
    if (!userId) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      // Fetch user solutions from the database
      const userSolutions = await getUserSolutions(userId);
      setSolutions(userSolutions.map(solution => ({
        ...solution,
        problemTitle: problemTitles[solution.problemId] || solution.problemId
      })));
    } catch (err) {
      console.error("Error fetching user solutions:", err);
      setError("Failed to load your solutions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return <div className="loading">Loading your solutions...</div>;
  }

  // Error state
  if (error) {
    return <div className="error">{error}</div>;
  }

  // Render user solutions
  return (
    <div className="my-solutions-page">
      <h2>My Solutions 📝</h2>
      {solutions.length === 0 ? (
        <p>You haven't submitted any solutions yet.</p>
      ) : (
        <ul className="solutions-list">
          {solutions.map((solution) => (
            <li key={solution.problemId} className="solution-item">
              <h3>{solution.problemTitle}</h3>
              {Object.entries(solution.languages).map(([language, data]) => (
                <div key={language} className="language-solution">
                  <p>{language.charAt(0).toUpperCase() + language.slice(1)}</p>
                  <p>Last updated: {new Date(data.timestamp.seconds * 1000).toLocaleString()}</p>
                  <Link 
                    to={`/problems/${solution.problemId}?language=${language}`} 
                    className="view-problem-link"
                  >
                    View Problem
                  </Link>
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
