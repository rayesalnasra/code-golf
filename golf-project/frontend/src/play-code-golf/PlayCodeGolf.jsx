import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore/lite";
import { dbCodeRunner } from "../firebase/firebaseCodeRunner";
import ProblemPage from '../problem-page/ProblemPage';
import Timer from './Timer';
import CodeGolfSummary from './CodeGolfSummary';
import { saveCodeGolfSubmission, getUserCodeGolfSubmission } from '../firebase/firebaseCodeRunner';
import './PlayCodeGolf.css';
import { auth } from '../firebase/firebaseAuth';

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

// Par attempts for different difficulty levels
const PAR_ATTEMPTS = {
  easy: 3,
  medium: 4,
  hard: 5
};

// Maximum attempts for different difficulty levels
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
  const [showSummary, setShowSummary] = useState(false);
  const [userCode, setUserCode] = useState({});
  const [problemAttempts, setProblemAttempts] = useState(0);
  const [score, setScore] = useState(0); // Initialize score
  const [problemTimer, setProblemTimer] = useState(0);
  const [difficulty, setDifficulty] = useState('easy'); // Example initialization
  const [gameId, setGameId] = useState('game123'); // Example game ID

  // Fetch problems when difficulty and language are selected
  useEffect(() => {
    if (selectedDifficulty && selectedLanguage) {
      fetchProblems().then(() => {
        loadInitialUserCode();
      });
    }
  }, [selectedDifficulty, selectedLanguage]);

  // Set current problem index based on URL problem ID
  useEffect(() => {
    if (urlProblemId && problems.length > 0) {
      const index = problems.findIndex(p => p.id === urlProblemId);
      if (index !== -1) {
        setCurrentProblemIndex(index);
      }
    }
  }, [urlProblemId, problems]);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch problems from Firestore
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

  // Handle difficulty selection
  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  // Handle language selection
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    navigate(`/play-code-golf/${selectedDifficulty}/${language}`);
  };

  // Calculate score based on attempts and difficulty
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

  // Get score label based on score value
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

  // Generate completion message based on score and attempts
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

  // Handle problem attempt (correct or incorrect)
  const handleAttempt = async (problemId, isCorrect) => {
    await saveCurrentProblemState();
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

  // Handle navigation to next problem
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

  // Start the timer when problem starts
  const handleProblemStart = () => {
    setIsTimerRunning(true);
  };

  // Update problem time
  const handleTimeUpdate = (time) => {
    setProblemTimes(prevTimes => ({
      ...prevTimes,
      [problems[currentProblemIndex].id]: time
    }));
  };

  // Handle code changes and update character count
  const handleCodeChange = (newCode) => {
    const problemId = problems[currentProblemIndex].id;
    setCharacterCount(newCode.length);
    setUserCode(prevCode => ({
      ...prevCode,
      [problemId]: newCode
    }));
  };

  // Save current problem state to Firestore
  const saveCurrentProblemState = async () => {
    const user = auth.currentUser;
    if (!user || !problems[currentProblemIndex]) {
      console.error('User is not authenticated or current problem is not defined');
      return;
    }

    const currentProblem = problems[currentProblemIndex];
    const problemId = currentProblem.id;
    const currentCode = userCode[problemId] || '';
    const difficulty = currentProblem?.difficulty || 'unknown';

    console.log('Current problem:', currentProblem);
    console.log('Difficulty:', difficulty);

    const currentAttempts = attempts[problemId] || 0;
    const currentScore = scores[problemId] || 0;
    const currentTimer = problemTimes[problemId] || 0;

    console.log('Attempts:', currentAttempts);
    console.log('Score:', currentScore);
    console.log('Timer:', currentTimer);

    try {
      await saveCodeGolfSubmission(
        user.uid,
        problemId,
        selectedLanguage,
        currentCode,
        currentCode.length,
        currentAttempts,
        currentScore,
        currentTimer,
        difficulty
      );
      console.log('Code Golf submission saved successfully');
    } catch (error) {
      console.error('Error saving Code Golf submission:', error);
    }
  };

  // Navigate to a specific problem
  const navigateToProblem = (index) => {
    setCurrentProblemIndex(index);
    setIsTimerRunning(false);
    
    const problem = problems[index];
    if (!problem) {
      console.error('Problem not found');
      return;
    }

    setCharacterCount(0);
    setUserCode(prevCode => ({
      ...prevCode,
      [problem.id]: problem.initialCode[selectedLanguage] || ''
    }));
    
    navigate(`/play-code-golf/${selectedDifficulty}/${problem.id}?language=${selectedLanguage}`);
  };

  // Navigate to previous problem
  const navigateToPreviousProblem = () => {
    if (currentProblemIndex > 0) {
      navigateToProblem(currentProblemIndex - 1);
    }
  };

  // Navigate to next problem
  const navigateToNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      navigateToProblem(currentProblemIndex + 1);
    }
  };

  // Handle finish game action
  const handleFinish = () => {
    // Assign maximum score to unsolved problems
    const finalScores = { ...scores };
    problems.forEach((problem) => {
      if (!finalScores[problem.id]) {
        finalScores[problem.id] = 7; // Maximum score
      }
    });
    setScores(finalScores);
    setTotalScore(Object.values(finalScores).reduce((a, b) => a + b, 0));
    setShowSummary(true);
  };

  // Load initial user code from Firestore
  const loadInitialUserCode = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    const initialUserCode = {};
    for (const problem of problems) {
      try {
        const submission = await getUserCodeGolfSubmission(userId, problem.id, selectedLanguage, selectedDifficulty);
        if (submission) {
          initialUserCode[problem.id] = submission.code;
          
          // Update other state variables with the saved submission data
          setAttempts(prevAttempts => ({
            ...prevAttempts,
            [problem.id]: submission.attempts
          }));
          setScores(prevScores => ({
            ...prevScores,
            [problem.id]: submission.score
          }));
          setProblemTimes(prevTimes => ({
            ...prevTimes,
            [problem.id]: submission.timer
          }));
        } else {
          initialUserCode[problem.id] = problem.initialCode[selectedLanguage] || '';
        }
      } catch (error) {
        console.error(`Error loading Code Golf submission for problem ${problem.id}:`, error);
        initialUserCode[problem.id] = problem.initialCode[selectedLanguage] || '';
      }
    }
    setUserCode(initialUserCode);
  };

  // Update problem timer
  const handleTimerUpdate = (newTime) => {
    setProblemTimer(newTime);
  };

  // Update score
  const updateScore = (newScore) => {
    setScore(newScore);
  };

  // Increment problem attempts
  const incrementAttempts = () => {
    setProblemAttempts(prevAttempts => prevAttempts + 1);
  };

  // Update timer
  const updateTimer = (seconds) => {
    const problemId = problems[currentProblemIndex].id;
    setProblemTimes(prevTimes => ({
      ...prevTimes,
      [problemId]: (prevTimes[problemId] || 0) + 1
    }));
  };

  // Log score updates
  useEffect(() => {
    console.log('Score updated:', score);
  }, [score]);

  // Log attempts updates
  useEffect(() => {
    console.log('Attempts updated:', problemAttempts);
  }, [problemAttempts]);

  // Log timer updates
  useEffect(() => {
    console.log('Timer updated:', problemTimer);
  }, [problemTimer]);

  // Start/stop timer based on isTimerRunning state
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        updateTimer(1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, currentProblemIndex]);

  // Get difficulty description
  const getDifficultyDescription = (difficulty) => {
    const descriptions = {
      easy: "👶 Perfect for beginners. Focus on basic programming concepts and simple optimizations.",
      medium: "👨‍💻 For intermediate coders. Challenges require more complex problem-solving and optimization techniques.",
      hard: "🧙‍♂️ For experienced programmers. Expect intricate problems that will push your coding skills to the limit."
    };
    return descriptions[difficulty] || "Select a difficulty to see its description.";
  };

  // Render loading, error, or summary components
  if (isLoading) return <div>Loading problems...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (showSummary) {
    return (
      <CodeGolfSummary
        difficulty={selectedDifficulty}
      />
    );
  }

  // Main component render
  return (
    <div className="play-code-golf">
      <div className="content-container">
        <h1 className="page-title">Play Code Golf 🏌️‍♂️</h1>
        
        {/* Render difficulty selection */}
        {!selectedDifficulty ? (
          <section className="difficulty-section">
            <h2>Choose Your Challenge 🎯</h2>
            <p className="section-description">
              Select the difficulty level that matches your coding skills. Each level offers a unique set of challenges designed to test your problem-solving abilities and code optimization skills.
            </p>
            <div className="difficulty-selector">
              {['easy', 'medium', 'hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleDifficultySelect(diff)}
                  className={`difficulty-button ${selectedDifficulty === diff ? 'selected' : ''}`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
            {selectedDifficulty && (
              <p className="difficulty-description">
                {getDifficultyDescription(selectedDifficulty)}
              </p>
            )}
          </section>
        ) : !selectedLanguage ? (
          <section className="language-section">
            <h2>Pick Your Language 💻</h2>
            <p className="section-description">
              Choose the programming language you want to use for this Code Golf session. Each language offers its own unique features and challenges for code golf.
            </p>
            <div className="language-selector">
              {['python', 'javascript'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`language-button ${selectedLanguage === lang ? 'selected' : ''}`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
          </section>
        ) : problems.length > 0 ? (
          <div className="problem-container">
            <h2>Problem {currentProblemIndex + 1} of {problems.length}</h2>
            <div className="problem-stats">
              <Timer
                isRunning={isTimerRunning}
                onTimerUpdate={handleTimeUpdate}
              />
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
              initialCode={userCode[problems[currentProblemIndex].id] || ''}
              showBackLink={false}
            />
            <div className="finish-button-container">
              <button onClick={handleFinish} className="finish-button">Finish Game</button>
            </div>
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
          <div className="no-problems-message">
            <p>No problems found for this difficulty level. Please try another difficulty or check back later.</p>
            <button onClick={() => setSelectedDifficulty(null)} className="retry-button">
              Select Different Difficulty
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayCodeGolf;
