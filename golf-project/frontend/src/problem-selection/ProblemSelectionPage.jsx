// ProblemSelectionPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore/lite";
import { dbCodeRunner } from "../firebase/firebaseCodeRunner";
import { readData } from "../firebase/databaseUtils";
import "./ProblemSelectionPage.css";

// Object containing difficulty levels with descriptions and emojis
const difficulties = {
  easy: {
    description: "Ideal for beginners. These problems cover basic programming concepts and simple algorithms.",
    emoji: "🌱",
  },
  medium: {
    description: "Challenges for intermediate programmers. These problems involve more complex algorithms and data structures.",
    emoji: "🌿",
  },
  hard: {
    description: "Advanced problems for experienced programmers. These challenges often require optimal solutions and advanced algorithms.",
    emoji: "🌳",
  }
};

export default function ProblemSelectionPage() {
  // State variables for managing component data and UI
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");
  const [systemProblems, setSystemProblems] = useState([]);
  const [userProblems, setUserProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect hook to fetch problems when difficulty changes
  useEffect(() => {
    fetchProblems();
  }, [selectedDifficulty]);

  // Function to fetch problems from Firestore
  const fetchProblems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching problems...");
      const problemsCollection = collection(dbCodeRunner, 'problems');
      const problemsSnapshot = await getDocs(problemsCollection);
      console.log(`Found ${problemsSnapshot.docs.length} problems`);

      // Process each problem document
      const allProblems = await Promise.all(problemsSnapshot.docs.map(async (doc) => {
        const problemData = doc.data();
        console.log(`Processing problem: ${doc.id}`, problemData);
        let creatorInfo = null;
        // Fetch creator info if available
        if (problemData.createdBy) {
          try {
            await new Promise((resolve) => {
              readData(`users/${problemData.createdBy}`, (userData) => {
                if (userData) {
                  creatorInfo = {
                    name: userData.displayName || "Anonymous User",
                    createdAt: problemData.createdAt ? new Date(problemData.createdAt) : null
                  };
                }
                resolve();
              });
            });
          } catch (userError) {
            console.error(`Error fetching user data for problem ${doc.id}:`, userError);
          }
        }
        return { 
          id: doc.id, 
          ...problemData, 
          creatorInfo
        };
      }));
      // Filter problems based on selected difficulty
      const filteredProblems = allProblems.filter(problem => problem.difficulty === selectedDifficulty);
      
      // Separate system and user-created problems
      const systemProblemsList = filteredProblems.filter(problem => !problem.creatorInfo);
      const userProblemsList = filteredProblems.filter(problem => problem.creatorInfo);

      setSystemProblems(systemProblemsList);
      setUserProblems(userProblemsList);

      console.log(`Filtered ${systemProblemsList.length} system problems and ${userProblemsList.length} user problems for difficulty: ${selectedDifficulty}`);
    } catch (err) {
      console.error("Error fetching problems:", err);
      setError(`Failed to load problems. Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format dates
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to render a list of problems
  const renderProblemList = (problems, title) => (
    <section className="problem-list-section">
      <h2>{title}</h2>
      {problems.length === 0 ? (
        <p>No problems found for this difficulty level.</p>
      ) : (
        <ul className="problem-list">
          {problems.map((problem) => (
            <li key={problem.id} className="problem-item">
              <Link to={`/problems/${problem.id}`} className="problem-link">
                {problem.title}
              </Link>
              {problem.creatorInfo && (
                <span className="problem-creator">
                  - created by {problem.creatorInfo.name} at {formatDate(problem.creatorInfo.createdAt)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  // Main component render
  return (
    <div className="problem-selection-page">
      <div className="content-container">
        <h1 className="page-title">Problem Selection 🧩</h1>
        
        {/* Difficulty selection section */}
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
        
        {/* Conditional rendering based on loading and error states */}
        {isLoading ? (
          <p>Loading problems...</p>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchProblems}>Try Again</button>
          </div>
        ) : (
          <>
            {renderProblemList(systemProblems, "System Problems")}
            {renderProblemList(userProblems, "User-Created Problems")}
          </>
        )}

        {/* Tips section */}
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
