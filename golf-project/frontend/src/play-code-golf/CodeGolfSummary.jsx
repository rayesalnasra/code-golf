import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore/lite';
import { dbCodeRunner } from '../firebase/firebaseCodeRunner';
import './CodeGolfSummary.css';

// Component to display a summary of Code Golf results
const CodeGolfSummary = ({ difficulty }) => {
  const navigate = useNavigate();
  // State to store summary data
  const [summaryData, setSummaryData] = useState([]);
  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);
  // State to store any error messages
  const [error, setError] = useState(null);

  // Fetch summary data when the component mounts or difficulty changes
  useEffect(() => {
    fetchSummaryData();
  }, [difficulty]);

  // Function to fetch summary data from Firestore
  const fetchSummaryData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get user ID from local storage
      const userId = localStorage.getItem('userUID');
      // Reference to the userCodeGolf collection
      const userCodeGolfCol = collection(dbCodeRunner, 'userCodeGolf');
      // Create a query to fetch user's data for the given difficulty
      const q = query(userCodeGolfCol, where('userId', '==', userId), where('difficulty', '==', difficulty));
      // Execute the query
      const querySnapshot = await getDocs(q);
      // Map the query results to an array of data objects
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Update the state with the fetched data
      setSummaryData(data);
    } catch (err) {
      console.error("Error fetching summary data:", err);
      setError("Failed to load summary data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format time in minutes and seconds
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Handler for the "Play Again" button
  const handlePlayAgain = () => {
    navigate('/play-code-golf', { replace: true });
  };

  // Show loading message while data is being fetched
  if (isLoading) return <div>Loading summary...</div>;
  // Show error message if there was an error fetching data
  if (error) return <div className="error-message">{error}</div>;

  // Render the summary data
  return (
    <div className="code-golf-summary">
      <h1>Code Golf Summary</h1>
      <div className="summary-stats">
        {/* Calculate and display total score */}
        <p>Total Score: {summaryData.reduce((total, problem) => total + problem.score, 0)}</p>
      </div>
      {/* Map through each problem and display its details */}
      {summaryData.map((problem) => (
        <div key={problem.id} className="problem-summary">
          <h2>Problem: {problem.problemId}</h2>
          <p>Score: {problem.score}</p>
          <p>Time Spent: {formatTime(problem.timer)}</p>
          <p>Attempts: {problem.attempts}</p>
          <p>Character Count: {problem.characterCount}</p>
          <div className="code-preview">
            <h3>Your Code:</h3>
            {/* Display the user's code or a message if no code was submitted */}
            <pre><code>{problem.code || 'No code submitted'}</code></pre>
          </div>
        </div>
      ))}
      {/* Button to play again */}
      <button onClick={handlePlayAgain} className="play-again-button">
        Play Again
      </button>
    </div>
  );
};

export default CodeGolfSummary;
