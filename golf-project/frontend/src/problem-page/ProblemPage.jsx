// ProblemPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getTestCases, saveUserCode, getUserSubmission, getSolution, getUserCodeGolfSubmission } from "../firebase/firebaseCodeRunner.js";
import { ref, onValue, update } from "firebase/database";
import { database } from "../firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore/lite";
import { dbCodeRunner } from "../firebase/firebaseCodeRunner";
import "./ProblemPage.css";

import CodeEditor from "./CodeEditor";
import TestResults from "./TestResults.jsx";
import UserStats from "./UserStats";
import ProblemDescription from "./ProblemDescription";
import ActionButtons from "./ActionButtons";
import LanguageSelector from "./LanguageSelector";
import axios from "axios";

// Main ProblemPage component
export default function ProblemPage({ 
  problemId: propProblemId, 
  onComplete, 
  onIncorrectAttempt, 
  onStart, 
  onCodeChange,
  isCodeGolfMode = false,
  isSolved = false,
  language: propLanguage,
  showBackLink = true
}) {
  // Extract parameters from URL and router
  const { problemId: paramProblemId, difficulty } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine the problem ID (from props or URL params)
  const problemId = propProblemId || paramProblemId;
  
  // State variables
  const [language, setLanguage] = useState(propLanguage || 'python'); // Default to 'python' if not provided
  const [code, setCode] = useState("");
  const [results, setResults] = useState([]);
  const [testResult, setTestResult] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [testCases, setTestCases] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solutionCode, setSolutionCode] = useState("");
  const [user, setUser] = useState(null);
  const [problem, setProblem] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Effect to set language from URL params (if not in Code Golf mode)
  useEffect(() => {
    if (!isCodeGolfMode) {
      const params = new URLSearchParams(location.search);
      const langParam = params.get('language');
      if (langParam && (langParam === 'python' || langParam === 'javascript')) {
        setLanguage(langParam);
      }
    }
  }, [location.search, isCodeGolfMode]);

  // Effect to fetch problem details when problemId changes
  useEffect(() => {
    if (problemId) {
      fetchProblem();
    }
  }, [problemId]);

  // Effect to fetch test cases, user submission, and user data when problem or language changes
  useEffect(() => {
    if (problem) {
      fetchTestCases();
      fetchUserSubmission();
      fetchUserData();
    }
  }, [problem, language]);

  // Function to fetch problem details from Firestore
  const fetchProblem = async () => {
    setIsLoading(true);
    try {
      if (!problemId) {
        throw new Error("Problem ID is undefined");
      }
      const problemDoc = await getDoc(doc(dbCodeRunner, 'problems', problemId));
      if (problemDoc.exists()) {
        setProblem(problemDoc.data());
      } else {
        setLoadError("Problem not found");
      }
    } catch (error) {
      console.error("Error fetching problem:", error);
      setLoadError("Failed to load problem details");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch test cases for the current problem
  const fetchTestCases = async () => {
    try {
      // First, try to fetch test cases from the new structure
      const testCasesDocRef = doc(dbCodeRunner, 'testCases', problemId);
      const testCasesDoc = await getDoc(testCasesDocRef);
      
      if (testCasesDoc.exists()) {
        // New structure: test cases are in a 'cases' array
        setTestCases(testCasesDoc.data().cases);
      } else {
        // If not found, try the old getTestCases function
        const oldTestCases = await getTestCases(problemId);
        if (oldTestCases && oldTestCases.length > 0) {
          setTestCases(oldTestCases);
        } else {
          throw new Error("No test cases found for this problem");
        }
      }
    } catch (error) {
      console.error("Error fetching test cases:", error);
      setLoadError("Failed to load test cases. Please try again.");
    }
  };

  // Function to fetch user's previous submission for the current problem
  const fetchUserSubmission = async () => {
    setIsLoading(true);
    setLoadError("");
    const userId = localStorage.getItem('userUID');

    try {
      if (isCodeGolfMode && userId) {
        // For Code Golf mode, try to load user submission
        const userCode = await getUserCodeGolfSubmission(userId, problemId, language, difficulty);
        if (userCode) {
          setCode(userCode.code);
          // Update other state variables if needed
          if (onCodeChange) {
            onCodeChange(userCode.code);
          }
        } else {
          setCode(problem?.initialCode[language] || "");
        }
      } else if (!isCodeGolfMode && userId) {
        // For regular mode, try to load user submission
        const userCode = await getUserSubmission(userId, problemId, language);
        if (userCode) {
          setCode(userCode);
        } else {
          setCode(problem?.initialCode[language] || "");
        }
      } else {
        // If no user ID or not in Code Golf mode, use initial code
        setCode(problem?.initialCode[language] || "");
      }
    } catch (error) {
      console.error("Error fetching user submission:", error);
      setLoadError("Failed to load your saved code. Using initial code instead.");
      setCode(problem?.initialCode[language] || "");
    } finally {
      setResults([]);
      setTestResult("");
      setIsLoading(false);
      setHasUnsavedChanges(false);
      setShowSolution(false);
      setIsInitialLoad(false);
    }
  };

  // Function to fetch user data from the database
  const fetchUserData = () => {
    const userId = localStorage.getItem('userUID');
    if (userId) {
      const userRef = ref(database, `users/${userId}`);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          setUser(userData);
        }
      });
    }
  };

  // Function to handle code changes in the editor
  const handleChange = (value) => {
    if (!isCodeGolfMode || !isSolved) {
      setCode(value);
      setHasUnsavedChanges(true);
      setShowSolution(false);
      if (onCodeChange) {
        onCodeChange(value);
      }
    }
  };

  // Function to update user's progress after passing a test
  const updateUserProgress = () => {
    if (!user || isCodeGolfMode) return;  // Don't update progress in Code Golf mode

    const userId = localStorage.getItem('userUID');
    const newScore = user.score + 10;
    let newXP = user.xp + 10;
    let newLevel = user.level;
    let xpLimit = 100 + (user.level * 50);

    if (newXP >= xpLimit) {
      newLevel++;
      newXP = newXP - xpLimit;
    }

    const updatedUser = {
      ...user,
      score: newScore,
      xp: newXP,
      level: newLevel
    };

    const userRef = ref(database, `users/${userId}`);
    update(userRef, updatedUser);
    setUser(updatedUser);

    alert(`Congratulations! You've earned 10 points and 10 XP. Your new score is ${newScore} and you're at level ${newLevel} with ${newXP} XP.`);
    
    if (onComplete) {
      onComplete();
    }
  };

  // Function to run the user's code and check against test cases
  const runCode = () => {
    axios.post("http://localhost:3000/run-code", { code, problem: problemId, language, testCases })
      .then((res) => {
        setResults(res.data.results);
        setTestResult(res.data.passOrFail);
        if (res.data.passOrFail === 'passed') {
          if (isCodeGolfMode) {
            // In Code Golf mode, just call onComplete without updating user progress
            if (onComplete) onComplete();
          } else {
            // In regular mode, update user progress and show congratulatory message
            updateUserProgress();
            if (onComplete) onComplete();
          }
        } else {
          if (onIncorrectAttempt) onIncorrectAttempt();
        }
      })
      .catch((error) => {
        console.error("Error running code:", error);
        handleError(error);
        if (onIncorrectAttempt) onIncorrectAttempt();
      });
  };

  // Function to save user's code to the database
  const saveCode = async () => {
    if (isCodeGolfMode) return;

    setIsSaving(true);
    try {
      const userId = localStorage.getItem('userUID');
      if (!userId) {
        throw new Error("User not authenticated");
      }
      await saveUserCode(userId, problemId, language, code);
      alert("Code saved successfully!");
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving code:", error);
      alert("Failed to save code. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to reset the code editor to the initial state
  const resetCode = () => {
    if (window.confirm("Are you sure you want to reset your code? This action cannot be undone.")) {
      setCode(problem?.initialCode[language] || "");
      setHasUnsavedChanges(true);
      setShowSolution(false);
    }
  };

  // Function to handle errors from code execution
  const handleError = (error) => {
    if (error.response) {
      setResults([{ error: error.response.data.error || "An error occurred while running your code." }]);
    } else if (error.request) {
      setResults([{ error: "Unable to reach the server. Please check your connection and try again." }]);
    } else {
      setResults([{ error: `An unexpected error occurred: ${error.message}. Please try again.` }]);
    }
    setTestResult("failed");
  };

  // Function to handle navigation away from the page
  const handleNavigateAway = (to) => {
    if (hasUnsavedChanges) {
      const confirmNavigation = window.confirm(
        "You have unsaved changes. Do you want to save before leaving?"
      );
      if (confirmNavigation) {
        saveCode().then(() => navigate(to));
      } else {
        navigate(to);
      }
    } else {
      navigate(to);
    }
  };

  // Function to toggle solution visibility
  const handleViewSolution = async () => {
    if (showSolution) {
      setShowSolution(false);
    } else {
      try {
        const solution = await getSolution(problemId, language);
        setSolutionCode(solution);
        setShowSolution(true);
      } catch (error) {
        console.error("Error fetching solution:", error);
        alert("Failed to fetch solution. Please try again.");
      }
    }
  };

  // Effect to call onStart when the problem is loaded
  useEffect(() => {
    if (problem && onStart) {
      onStart();
    }
  }, [problem, onStart]);

  // Function to handle language change
  const handleLanguageChange = (newLanguage) => {
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm(
        "You have unsaved changes. Changing the language will lose these changes. Do you want to continue?"
      );
      if (!confirmChange) {
        return;
      }
    }
    setLanguage(newLanguage);
    
    if (!isCodeGolfMode) {
      navigate(`/problems/${problemId}?language=${newLanguage}`, { replace: true });
    }
    
    setCode(problem?.initialCode[newLanguage] || "");
    setHasUnsavedChanges(false);
    setShowSolution(false);
  };

  // Effect to fetch user submission or set initial code when problem or language changes
  useEffect(() => {
    if (problem && !isCodeGolfMode) {
      fetchUserSubmission();
    } else if (problem && isCodeGolfMode) {
      setCode(problem.initialCode[language] || "");
    }
  }, [problem, language, isCodeGolfMode]);

  // Render the component
  return (
    <div className="problem-page">
      {showBackLink && (
        <button onClick={() => handleNavigateAway("/problems")} className="back-link">
          &larr; Back to problem selection
        </button>
      )}
      
      {problem && <ProblemDescription description={problem.description} />}
      
      {!isCodeGolfMode && (
        <LanguageSelector
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      )}
      
      {!isCodeGolfMode && user && <UserStats user={user} />}

      <CodeEditor
        code={code}
        language={language}
        isLoading={isLoading || isInitialLoad}
        loadError={loadError}
        onChange={handleChange}
        readOnly={isCodeGolfMode && isSolved}
      />
      
      <ActionButtons
        onRun={runCode}
        onSave={isCodeGolfMode ? null : saveCode}
        onReset={resetCode}
        onViewSolution={isCodeGolfMode ? null : handleViewSolution}
        isSaving={isSaving}
        isLoading={isLoading}
        showSolution={showSolution}
        disableRun={isCodeGolfMode && isSolved}
        disableReset={isCodeGolfMode && isSolved}
        isCodeGolfMode={isCodeGolfMode}
      />
      
      {hasUnsavedChanges && !isCodeGolfMode && (
        <div className="unsaved-changes-warning">
          You have unsaved changes. Remember to save your code!
        </div>
      )}

      {showSolution && !isCodeGolfMode && (
        <CodeEditor
          code={solutionCode}
          language={language}
          readOnly={true}
          title="Solution"
        />
      )}
      
      <TestResults 
        results={results}
        testResult={testResult}
      />
    </div>
  );
}
