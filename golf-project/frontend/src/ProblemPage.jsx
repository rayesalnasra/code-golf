import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import axios from "axios";
import { saveUserCode, getTestCases, getUserSubmission } from "./firebaseCodeRunner";
import "./ProblemPage.css";


const problemDescriptions = {
  add: "Create a function that adds two numbers",
  reverse: "Create a function that reverses a given string",
  palindrome: "Create a function that checks if a given string is a palindrome.",
  factorial: "Create a function that calculates the factorial of a given non-negative integer.",
  fizzbuzz: "Create a function that returns 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, 'FizzBuzz' for multiples of both, and the number for other cases.",
  twosum: "Given an array of integers and a target sum, return indices of the two numbers such that they add up to the target.",
  validparentheses: "Create a function that determines if the input string has valid parentheses.",
  longestsubstring: "Find the length of the longest substring without repeating characters.",
  mergeintervals: "Merge all overlapping intervals and return an array of the non-overlapping intervals.",
  groupanagrams: "Group anagrams together from an array of strings.",
  mediansortedarrays: "Find the median of two sorted arrays.",
  regularexpressionmatching: "Implement regular expression matching with support for '.' and '*'.",
  trapwater: "Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.",
  mergeklargelists: "Merge k sorted linked lists and return it as one sorted list.",
  longestvalidparentheses: "Given a string containing just '(' and ')', find the length of the longest valid parentheses substring.",
};

const initialCodes = {
  python: {
    add: "def add(a, b):\n    return a + b",
    reverse: "def reverse_string(s):\n    return s[::-1]",
    palindrome: "def is_palindrome(s):\n    # Your code here",
    factorial: "def factorial(n):\n    # Your code here",
    fizzbuzz: "def fizzbuzz(n):\n    # Your code here",
    twosum: "def two_sum(nums, target):\n    # Your code here",
    validparentheses: "def is_valid_parentheses(s):\n    # Your code here",
    longestsubstring: "def length_of_longest_substring(s):\n    # Your code here",
    mergeintervals: "def merge_intervals(intervals):\n    # Your code here",
    groupanagrams: "def group_anagrams(strs):\n    # Your code here",
    mediansortedarrays: "def find_median_sorted_arrays(nums1, nums2):\n    # Your code here",
    regularexpressionmatching: "def is_match(s, p):\n    # Your code here",
    trapwater: "def trap(height):\n    # Your code here",
    mergeklargelists: "def merge_k_lists(lists):\n    # Your code here",
    longestvalidparentheses: "def longest_valid_parentheses(s):\n    # Your code here",
  },
  javascript: {
    add: "function add(a, b) {\n    return a + b;\n}",
    reverse: "function reverseString(s) {\n    return s.split('').reverse().join('');\n}",
    palindrome: "function isPalindrome(s) {\n    // Your code here\n}",
    factorial: "function factorial(n) {\n    // Your code here\n}",
    fizzbuzz: "function fizzbuzz(n) {\n    // Your code here\n}",
    twosum: "function twoSum(nums, target) {\n    // Your code here\n}",
    validparentheses: "function isValidParentheses(s) {\n    // Your code here\n}",
    longestsubstring: "function lengthOfLongestSubstring(s) {\n    // Your code here\n}",
    mergeintervals: "function mergeIntervals(intervals) {\n    // Your code here\n}",
    groupanagrams: "function groupAnagrams(strs) {\n    // Your code here\n}",
    mediansortedarrays: "function findMedianSortedArrays(nums1, nums2) {\n    // Your code here\n}",
    regularexpressionmatching: "function isMatch(s, p) {\n    // Your code here\n}",
    trapwater: "function trap(height) {\n    // Your code here\n}",
    mergeklargelists: "function mergeKLists(lists) {\n    // Your code here\n}",
    longestvalidparentheses: "function longestValidParentheses(s) {\n    // Your code here\n}",
  }
};

export default function ProblemPage() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [results, setResults] = useState([]);
  const [testResult, setTestResult] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [testCases, setTestCases] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const langParam = params.get('language');
    if (langParam && (langParam === 'javascript' || langParam === 'python')) {
      setLanguage(langParam);
    }
  }, [location]);

  useEffect(() => {
    fetchTestCases();
    fetchUserSubmission();
  }, [problemId, language]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const fetchTestCases = async () => {
    try {
      const cases = await getTestCases(problemId);
      setTestCases(cases);
    } catch (error) {
      console.error("Error fetching test cases:", error);
    }
  };

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
          setCode(initialCodes[language][problemId] || "");
        }
      } catch (error) {
        console.error("Error fetching user submission:", error);
        setLoadError("Failed to load your saved code. Using initial code instead.");
        setCode(initialCodes[language][problemId] || "");
      }
    } else {
      setCode(initialCodes[language][problemId] || "");
    }
    setResults([]);
    setTestResult("");
    setIsLoading(false);
    setHasUnsavedChanges(false);
  };

  const handleChange = useCallback((value) => {
    setCode(value);
    setHasUnsavedChanges(true);
  }, []);


  const runCode = () => {
    axios.post("http://localhost:3000/run-code", { code, problem: problemId, language, testCases })
      .then((res) => {
        setResults(res.data.results);
        setTestResult(res.data.passOrFail);
      })
      .catch((error) => {
        console.error("Error running code:", error);
        handleError(error);
      });
  };

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

  const resetCode = () => {
    if (window.confirm("Are you sure you want to reset your code? This action cannot be undone.")) {
      setCode(initialCodes[language][problemId] || "");
      setHasUnsavedChanges(true);
    }
  };

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
    navigate(`/problems/${problemId}?language=${newLanguage}`, { replace: true });
  };

  return (
    <div className="problem-page">
      <button onClick={() => handleNavigateAway("/problems")} className="back-link">
        &larr; Back to problem selection
      </button>
      
      <h2 className="problem-description">{problemDescriptions[problemId]}</h2>
      
      <div className="language-selector">
        <label htmlFor="language-select">Language: </label>
        <select 
          id="language-select" 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>
      
      <div className="code-editor-container">
        {isLoading ? (
          <div className="loading-message">Loading your saved code...</div>
        ) : loadError ? (
          <div className="error-message">{loadError}</div>
        ) : (
          <CodeMirror
            value={code}
            height="200px"
            theme="light"
            extensions={[language === "python" ? python() : javascript()]}
            onChange={handleChange}
            className="code-editor"
          />
        )}
      </div>
      
      <div className="button-container">
        <button 
          className="btn btn-primary" 
          onClick={runCode}
          disabled={isLoading}
        >
          Run
        </button>
        <button 
          className="btn btn-success" 
          onClick={saveCode}
          disabled={isSaving || isLoading}
        >
          {isSaving ? "Saving..." : "Save Code"}
        </button>
        <button 
          className="btn btn-warning" 
          onClick={resetCode}
          disabled={isLoading}
        >
          Reset Code
        </button>
      </div>
      
      {hasUnsavedChanges && (
        <div className="unsaved-changes-warning">
          You have unsaved changes. Remember to save your code!
        </div>
      )}
      
      {results.length > 0 && (
        <div className="results-container">
          <h3 className="results-title">Test Results:</h3>
          {results.map((result, index) => (
            <div key={index} className={`result-item ${result.passed ? 'result-passed' : 'result-failed'}`}>
              {result.error ? (
                <div>
                  <strong>Error:</strong> {result.error}
                  {result.traceback && (
                    <pre className="error-traceback">{result.traceback}</pre>
                  )}
                </div>
              ) : (
                <div>
                  <div><strong>Inputs:</strong> {JSON.stringify(result.inputs)}</div>
                  <div><strong>Expected Output:</strong> {JSON.stringify(result.expected_output)}</div>
                  <div><strong>Actual Output:</strong> {JSON.stringify(result.actual_output)}</div>
                  {result.printed_output && (
                    <div><strong>Printed Output:</strong> <pre>{result.printed_output}</pre></div>
                  )}
                  <div><strong>Passed:</strong> {result.passed ? 'Yes' : 'No'}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {testResult && (
        <div className={`test-result ${testResult === 'passed' ? 'test-passed' : 'test-failed'}`}>
          Overall Result: {testResult}
        </div>
      )}
    </div>
  );
}