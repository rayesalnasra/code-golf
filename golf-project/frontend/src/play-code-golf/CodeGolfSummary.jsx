import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CodeGolfSummary.css';

const CodeGolfSummary = ({ problems, scores, totalScore, problemTimes, attempts, userCode }) => {
  const navigate = useNavigate();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handlePlayAgain = () => {
    navigate('/play-code-golf', { replace: true });
  };

  return (
    <div className="code-golf-summary">
      <h1>Code Golf Summary</h1>
      <div className="summary-stats">
        <p>Total Score: {totalScore}</p>
      </div>
      {problems.map((problem, index) => (
        <div key={problem.id} className="problem-summary">
          <h2>Problem {index + 1}: {problem.title}</h2>
          <p>Score: {scores[problem.id]}</p>
          <p>Time Spent: {formatTime(problemTimes[problem.id] || 0)}</p>
          <p>Attempts: {attempts[problem.id] || 0}</p>
          <p>Character Count: {userCode[problem.id]?.length || 0}</p>
          <div className="code-preview">
            <h3>Your Code:</h3>
            <pre><code>{userCode[problem.id] || 'No code submitted'}</code></pre>
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
