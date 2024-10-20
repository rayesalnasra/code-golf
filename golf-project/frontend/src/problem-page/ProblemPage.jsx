// ProblemPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getTestCases, saveUserCode, getUserSubmission, getSolution } from "../firebase/firebaseCodeRunner.js";
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

export default function ProblemPage({ problemId: propProblemId, onComplete }) {
  const { problemId: paramProblemId, difficulty } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use the prop problemId if available, otherwise use the one from URL params
  const problemId = propProblemId || paramProblemId;
  
  // State variables
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
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

  // Effect to get language from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const langParam = params.get('language');
    if (langParam && (langParam === 'javascript' || langParam === 'python')) {
      setLanguage(langParam);
    }
  }, [location]);

  // Fetch problem, test cases, user submission, and user data on component mount
  useEffect(() => {
    if (problemId) {
      fetchProblem();
    }
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      fetchTestCases();
      fetchUserSubmission();
      fetchUserData();
    }
  }, [problem, language]);

  // Fetch problem details from Firestore
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

  // Fetch test cases for the current problem
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

  // Fetch user's previous submission for the current problem
  const fetchUserSubmission = async () => {
    setIsLoading(true);
    setLoadError("");
    const userId = localStorage.getItem('userUID');
    if (userId) {
      try {
        const userCode = await getUserSubmission(userId, problemId, language);
        if (userCode) {
          setCode(userCode);
        } else {
          setCode(problem?.initialCode[language] || "");
        }
      } catch (error) {
        console.error("Error fetching user submission:", error);
        setLoadError("Failed to load your saved code. Using initial code instead.");
        setCode(problem?.initialCode[language] || "");
      }
    } else {
      setCode(problem?.initialCode[language] || "");
    }
    setResults([]);
    setTestResult("");
    setIsLoading(false);
    setHasUnsavedChanges(false);
    setShowSolution(false);
    setIsInitialLoad(false);
  };

  // Fetch user data from the database
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

  // Handle code changes in the editor
  const handleChange = (value) => {
    setCode(value);
    setHasUnsavedChanges(true);
    setShowSolution(false);
  };

  // Update user's progress after passing a test
  const updateUserProgress = () => {
    if (!user) return;

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

  // Run the user's code and check against test cases
  const runCode = () => {
    axios.post("http://localhost:3000/run-code", { code, problem: problemId, language, testCases })
      .then((res) => {
        setResults(res.data.results);
        setTestResult(res.data.passOrFail);
        if (res.data.passOrFail === 'passed') {
          updateUserProgress();
        }
      })
      .catch((error) => {
        console.error("Error running code:", error);
        handleError(error);
      });
  };

  // Save user's code to the database
  const saveCode = async () => {
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

  // Reset the code editor to the initial state
  const resetCode = () => {
    if (window.confirm("Are you sure you want to reset your code? This action cannot be undone.")) {
      setCode(problem?.initialCode[language] || "");
      setHasUnsavedChanges(true);
      setShowSolution(false);
    }
  };

  // Handle errors from code execution
  const handleError = (error) => {
    if (error.response) {
      setResults([{ error: error.response.data.error || "An error occurred while running your code." }]);
    } else if (error.request) {
      setResults([{ error: "Unable to reach the server. Please check your connection and try again." }]);
    } else {
      setResults([{ error: "An unexpected error occurred. Please try again." }]);
    }
    setTestResult("failed");
  };

  // Handle navigation away from the page
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

  // Change the programming language and reset the code
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
    
    // Update URL based on whether we're in Code Golf mode or regular problem viewing mode
    if (difficulty) {
      navigate(`/play-code-golf/${difficulty}/${problemId}?language=${newLanguage}`, { replace: true });
    } else {
      navigate(`/problems/${problemId}?language=${newLanguage}`, { replace: true });
    }
  };

  // Toggle solution visibility
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

  return (
    <div className="problem-page">
      <button onClick={() => handleNavigateAway("/problems")} className="back-link">
        &larr; Back to problem selection
      </button>
      
      {problem && <ProblemDescription description={problem.description} />}
      
      <LanguageSelector 
        language={language} 
        onLanguageChange={handleLanguageChange} 
      />
      
      {user && <UserStats user={user} />}

      <CodeEditor
        code={code}
        language={language}
        isLoading={isLoading || isInitialLoad}
        loadError={loadError}
        onChange={handleChange}
      />
      
      <ActionButtons
        onRun={runCode}
        onSave={saveCode}
        onReset={resetCode}
        onViewSolution={handleViewSolution}
        isSaving={isSaving}
        isLoading={isLoading}
        showSolution={showSolution}
      />
      
      {hasUnsavedChanges && (
        <div className="unsaved-changes-warning">
          You have unsaved changes. Remember to save your code!
        </div>
      )}

      {showSolution && (
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
