import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore/lite";
import { dbCodeRunner } from "../firebase/firebaseCodeRunner";
import ProblemPage from '../problem-page/ProblemPage';
import './PlayCodeGolf.css';

const PlayCodeGolf = () => {
  const { difficulty: urlDifficulty, problemId: urlProblemId } = useParams();
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState(urlDifficulty || null);
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedDifficulty) {
      fetchProblems();
    }
  }, [selectedDifficulty]);

  useEffect(() => {
    if (urlProblemId && problems.length > 0) {
      const index = problems.findIndex(p => p.id === urlProblemId);
      if (index !== -1) {
        setCurrentProblemIndex(index);
      }
    }
  }, [urlProblemId, problems]);

  const fetchProblems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching problems for difficulty:", selectedDifficulty);
      const problemsCollection = collection(dbCodeRunner, 'problems');
      const problemsSnapshot = await getDocs(problemsCollection);
      console.log(`Found ${problemsSnapshot.docs.length} total problems`);

      const allProblems = problemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const filteredProblems = allProblems.filter(problem => problem.difficulty === selectedDifficulty);
      console.log(`Filtered ${filteredProblems.length} problems for difficulty: ${selectedDifficulty}`);

      // Shuffle the filtered problems and take the first 5
      const shuffled = filteredProblems.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5);

      setProblems(selected);
      if (!urlProblemId) {
        navigate(`/play-code-golf/${selectedDifficulty}/${selected[0].id}`);
      }
    } catch (err) {
      console.error("Error fetching problems:", err);
      setError(`Failed to load problems. Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    navigate(`/play-code-golf/${difficulty}`);
  };

  const handleProblemComplete = () => {
    if (currentProblemIndex < problems.length - 1) {
      navigateToNextProblem();
    } else {
      alert("Congratulations! You've completed all problems in this difficulty level.");
      setSelectedDifficulty(null);
      setProblems([]);
      navigate('/play-code-golf');
    }
  };

  const navigateToProblem = (index) => {
    setCurrentProblemIndex(index);
    navigate(`/play-code-golf/${selectedDifficulty}/${problems[index].id}`);
  };

  const navigateToPreviousProblem = () => {
    if (currentProblemIndex > 0) {
      navigateToProblem(currentProblemIndex - 1);
    }
  };

  const navigateToNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      navigateToProblem(currentProblemIndex + 1);
    }
  };

  if (isLoading) return <div>Loading problems...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="play-code-golf">
      <h1>Play Code Golf</h1>
      {!selectedDifficulty ? (
        <div className="difficulty-selection">
          <h2>Select Difficulty</h2>
          <button onClick={() => handleDifficultySelect('easy')}>Easy</button>
          <button onClick={() => handleDifficultySelect('medium')}>Medium</button>
          <button onClick={() => handleDifficultySelect('hard')}>Hard</button>
        </div>
      ) : problems.length > 0 ? (
        <div className="problem-container">
          <h2>Problem {currentProblemIndex + 1} of {problems.length}</h2>
          <div className="navigation-buttons">
            <button 
              onClick={navigateToPreviousProblem} 
              disabled={currentProblemIndex === 0}
            >
              Previous Problem
            </button>
            {problems.map((_, index) => (
              <button 
                key={index} 
                onClick={() => navigateToProblem(index)}
                className={currentProblemIndex === index ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
            <button 
              onClick={navigateToNextProblem} 
              disabled={currentProblemIndex === problems.length - 1}
            >
              Next Problem
            </button>
          </div>
          <ProblemPage 
            key={problems[currentProblemIndex].id}
            problemId={problems[currentProblemIndex].id} 
            onComplete={handleProblemComplete}
          />
        </div>
      ) : (
        <div>No problems found for this difficulty level.</div>
      )}
    </div>
  );
};

export default PlayCodeGolf;
