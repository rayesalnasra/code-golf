import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore/lite";
import { dbCodeRunner } from "./firebaseCodeRunner";
import "./MySolutionsPage.css";

// Problem titles
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
  longestvalidparentheses: "Longest Valid Parentheses",
};

export default function MySolutionsPage() {
  const [solutions, setSolutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserSolutions();
  }, []);

  // fetch user solutions from the database
  const fetchUserSolutions = async () => {
    setIsLoading(true);
    setError(null);
    const userId = localStorage.getItem("userUID");

    if (!userId) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    // Fetch user submissions from the database
    try {
      const userSubmissionsCol = collection(dbCodeRunner, "userSubmissions");
      const q = query(userSubmissionsCol, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const userSolutions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        problemTitle:
          problemTitles[doc.data().problemId] || doc.data().problemId,
      }));

      // Set the user solutions in the state
      setSolutions(userSolutions);
    } catch (err) {
      console.error("Error fetching user solutions:", err);
      setError("Failed to load your solutions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading your solutions...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-solutions-page">
      <h2>My Solutions 📝</h2>
      {solutions.length === 0 ? (
        <p>You haven't submitted any solutions yet.</p>
      ) : (
        <ul className="solutions-list">
          {solutions.map((solution) => (
            <li key={solution.id} className="solution-item">
              <h3>{solution.problemTitle}</h3>
              <p>
                Last updated:{" "}
                {new Date(solution.timestamp.seconds * 1000).toLocaleString()}
              </p>
              <Link
                to={`/problems/${solution.problemId}`}
                className="view-problem-link"
              >
                View Problem
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
