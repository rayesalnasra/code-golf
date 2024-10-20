import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore/lite";
import { dbCodeRunner } from "../firebase/firebaseCodeRunner";
import ProblemPage from '../problem-page/ProblemPage';
import Timer from './Timer';
import './PlayCodeGolf.css';

// Scoring constants
const SCORING = {
  ACE: 1,
  BIRDIE: 2,
  PAR: 3,
  BOGEY: 4,
  DOUBLE_BOGEY: 5,
  TRIPLE_BOGEY: 6,
  MAX_SCORE: 7
};

const PAR_ATTEMPTS = {
  easy: 3,
  medium: 4,
  hard: 5
};

const MAX_ATTEMPTS = {
  easy: 6,
  medium: 7,
  hard: 8
};

const PlayCodeGolf = () => {
  const { difficulty: urlDifficulty, problemId: urlProblemId } = useParams();
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState(urlDifficulty || null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [problemTimes, setProblemTimes] = useState({});
  const [characterCount, setCharacterCount] = useState(0);
  const [attempts, setAttempts] = useState({});
  const [scores, setScores] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [solvedProblems, setSolvedProblems] = useState({});

  useEffect(() => {
    if (selectedDifficulty && selectedLanguage) {
      fetchProblems();
    }
  }, [selectedDifficulty, selectedLanguage]);

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
      const problemsCollection = collection(dbCodeRunner, 'problems');
      const problemsSnapshot = await getDocs(problemsCollection);
      const allProblems = problemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const filteredProblems = allProblems.filter(problem => problem.difficulty === selectedDifficulty);
      const shuffled = filteredProblems.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5);
      setProblems(selected);
      if (!urlProblemId) {
        navigate(`/play-code-golf/${selectedDifficulty}/${selected[0].id}?language=${selectedLanguage}`);
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
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    navigate(`/play-code-golf/${selectedDifficulty}/${language}`);
  };

  const calculateScore = (problemId, attempts) => {
    const par = PAR_ATTEMPTS[selectedDifficulty];
    const maxAttempts = MAX_ATTEMPTS[selectedDifficulty];

    if (attempts === 1) return SCORING.ACE;
    if (attempts === par - 1) return SCORING.BIRDIE;
    if (attempts === par) return SCORING.PAR;
    if (attempts === par + 1) return SCORING.BOGEY;
    if (attempts === par + 2) return SCORING.DOUBLE_BOGEY;
    if (attempts === par + 3) return SCORING.TRIPLE_BOGEY;
    if (attempts >= maxAttempts) return SCORING.MAX_SCORE;
    return attempts;
  };

  const getScoreLabel = (score) => {
    switch (score) {
      case SCORING.ACE: return "Hole-in-One";
      case SCORING.BIRDIE: return "Birdie";
      case SCORING.PAR: return "Par";
      case SCORING.BOGEY: return "Bogey";
      case SCORING.DOUBLE_BOGEY: return "Double Bogey";
      case SCORING.TRIPLE_BOGEY: return "Triple Bogey";
      case SCORING.MAX_SCORE: return "Maximum Score";
      default: return `${score} Strokes`;
    }
  };

  const getCompletionMessage = (score, attempts) => {
    const par = PAR_ATTEMPTS[selectedDifficulty];
    switch (score) {
      case SCORING.ACE:
        return `Hole-in-One (Ace): Incredible! You solved the problem in a single attempt.`;
      case SCORING.BIRDIE:
        return `Birdie: Great job! You solved the problem in ${attempts} attempts, one less than par (${par}).`;
      case SCORING.PAR:
        return `Par: Good work! You solved the problem in ${attempts} attempts, exactly par for this difficulty.`;
      case SCORING.BOGEY:
        return `Bogey: Not bad! You solved the problem in ${attempts} attempts, one over par (${par}).`;
      case SCORING.DOUBLE_BOGEY:
        return `Double Bogey: You solved the problem in ${attempts} attempts, two over par (${par}).`;
      case SCORING.TRIPLE_BOGEY:
        return `Triple Bogey: You solved the problem in ${attempts} attempts, three over par (${par}).`;
      default:
        return `You solved the problem in ${attempts} attempts. Par for this difficulty is ${par}.`;
    }
  };

  const handleAttempt = (problemId, isCorrect) => {
    if (isCorrect) {
      const currentAttempts = attempts[problemId] || 0;
      const newAttempts = currentAttempts + 1;
      const newScore = calculateScore(problemId, newAttempts);
      
      setScores(prevScores => ({
        ...prevScores,
        [problemId]: newScore
      }));
      
      setAttempts(prevAttempts => ({
        ...prevAttempts,
        [problemId]: newAttempts
      }));

      setSolvedProblems(prevSolved => ({
        ...prevSolved,
        [problemId]: true
      }));

      const newTotalScore = Object.values({ ...scores, [problemId]: newScore }).reduce((a, b) => a + b, 0);
      setTotalScore(newTotalScore);
      
      const message = getCompletionMessage(newScore, newAttempts);
      setCompletionMessage(message);
      setShowCompletionMessage(true);
      setIsTimerRunning(false);
    } else {
      setAttempts(prevAttempts => ({
        ...prevAttempts,
        [problemId]: (prevAttempts[problemId] || 0) + 1
      }));
      
      if ((attempts[problemId] || 0) + 1 >= MAX_ATTEMPTS[selectedDifficulty]) {
        const maxScore = SCORING.MAX_SCORE;
        setScores(prevScores => ({
          ...prevScores,
          [problemId]: maxScore
        }));
        const newTotalScore = Object.values({ ...scores, [problemId]: maxScore }).reduce((a, b) => a + b, 0);
        setTotalScore(newTotalScore);
        
        const message = `Maximum attempts reached. Moving to the next problem.`;
        setCompletionMessage(message);
        setShowCompletionMessage(true);
        setIsTimerRunning(false);
      }
    }
  };

  const handleNextProblem = () => {
    setShowCompletionMessage(false);
    if (currentProblemIndex < problems.length - 1) {
      navigateToNextProblem();
    } else {
      const finalScore = Object.values(scores).reduce((a, b) => a + b, 0);
      alert(`Congratulations! You've completed all problems in this difficulty level. Your final score is: ${finalScore}`);
      setSelectedDifficulty(null);
      setProblems([]);
      setSolvedProblems({});
      navigate('/play-code-golf');
    }
  };

  const handleProblemStart = () => {
    setIsTimerRunning(true);
  };

  const handleTimeUpdate = (time) => {
    setProblemTimes(prevTimes => ({
      ...prevTimes,
      [problems[currentProblemIndex].id]: time
    }));
  };

  const handleCodeChange = (newCode) => {
    setCharacterCount(newCode.length);
  };

  const navigateToProblem = (index) => {
    setCurrentProblemIndex(index);
    setIsTimerRunning(false);
    setCharacterCount(0);
    navigate(`/play-code-golf/${selectedDifficulty}/${problems[index].id}?language=${selectedLanguage}`);
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
      ) : !selectedLanguage ? (
        <div className="language-selection">
          <h2>Select Language</h2>
          <button onClick={() => handleLanguageSelect('python')}>Python</button>
          <button onClick={() => handleLanguageSelect('javascript')}>JavaScript</button>
        </div>
      ) : problems.length > 0 ? (
        <div className="problem-container">
          <h2>Problem {currentProblemIndex + 1} of {problems.length}</h2>
          <div className="problem-stats">
            <Timer isRunning={isTimerRunning} onTimeUpdate={handleTimeUpdate} />
            <div className="character-count">Characters: {characterCount}</div>
            <div className="attempts">Attempts: {attempts[problems[currentProblemIndex].id] || 0}</div>
            <div className="score">
              Score: {scores[problems[currentProblemIndex].id] || '-'} 
              ({getScoreLabel(scores[problems[currentProblemIndex].id] || 0)})
            </div>
            <div className="total-score">Total Score: {totalScore}</div>
          </div>
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
            key={`${problems[currentProblemIndex].id}-${selectedLanguage}`}
            problemId={problems[currentProblemIndex].id} 
            onComplete={() => handleAttempt(problems[currentProblemIndex].id, true)}
            onIncorrectAttempt={() => handleAttempt(problems[currentProblemIndex].id, false)}
            onStart={handleProblemStart}
            onCodeChange={handleCodeChange}
            isCodeGolfMode={true}
            isSolved={solvedProblems[problems[currentProblemIndex].id] || false}
            language={selectedLanguage}
          />
          {showCompletionMessage && (
            <div className="completion-message">
              <p>{completionMessage}</p>
              <button onClick={handleNextProblem}>
                {currentProblemIndex < problems.length - 1 ? 'Next Problem' : 'Finish Game'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>No problems found for this difficulty level.</div>
      )}
    </div>
  );
};

export default PlayCodeGolf;