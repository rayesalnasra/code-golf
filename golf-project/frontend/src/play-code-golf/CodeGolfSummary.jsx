import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore/lite';
import { dbCodeRunner } from '../firebase/firebaseCodeRunner';
import './CodeGolfSummary.css';

const CodeGolfSummary = ({ difficulty }) => {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummaryData();
  }, [difficulty]);

  const fetchSummaryData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem('userUID');
      const userCodeGolfCol = collection(dbCodeRunner, 'userCodeGolf');
      const q = query(userCodeGolfCol, where('userId', '==', userId), where('difficulty', '==', difficulty));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSummaryData(data);
    } catch (err) {
      console.error("Error fetching summary data:", err);
      setError("Failed to load summary data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handlePlayAgain = () => {
    navigate('/play-code-golf', { replace: true });
  };

  if (isLoading) return <div>Loading summary...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="code-golf-summary">
      <h1>Code Golf Summary</h1>
      <div className="summary-stats">
        <p>Total Score: {summaryData.reduce((total, problem) => total + problem.score, 0)}</p>
      </div>
      {summaryData.map((problem) => (
        <div key={problem.id} className="problem-summary">
          <h2>Problem: {problem.problemId}</h2>
          <p>Score: {problem.score}</p>
          <p>Time Spent: {formatTime(problem.timer)}</p>
          <p>Attempts: {problem.attempts}</p>
          <p>Character Count: {problem.characterCount}</p>
          <div className="code-preview">
            <h3>Your Code:</h3>
            <pre><code>{problem.code || 'No code submitted'}</code></pre>
          </div>
        </div>
      ))}
      <button onClick={handlePlayAgain} className="play-again-button">
        Play Again
      </button>
    </div>
  );
};

export default CodeGolfSummary;
