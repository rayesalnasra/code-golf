import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";
import { saveUserCode, getTestCases } from "./firebaseCodeRunner";
import "./ProblemPage.css";

const problemDescriptions = {
  add: "Create a function that adds two numbers in Python",
  reverse: "Create a function that reverses a given string in Python",
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
};

export default function ProblemPage() {
  const { problemId } = useParams();
  const [code, setCode] = useState(initialCodes[problemId] || "");
  const [results, setResults] = useState([]);
  const [testResult, setTestResult] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    setCode(initialCodes[problemId] || "");
    setResults([]);
    setTestResult("");
    fetchTestCases();
  }, [problemId]);

  const fetchTestCases = async () => {
    try {
      const cases = await getTestCases(problemId);
      setTestCases(cases);
    } catch (error) {
      console.error("Error fetching test cases:", error);
    }
  };

  const handleChange = React.useCallback((value) => {
    setCode(value);
  }, []);

  const runCode = () => {
    axios.post("http://localhost:3000/python", { code, problem: problemId, testCases })
      .then((res) => {
        setResults(res.data.results);
        setTestResult(res.data.passOrFail);
      })
      .catch((error) => {
        console.error("Error running code:", error);
        handleError(error);
      });
  };

  const submitCode = async () => {
    setIsSaving(true);
    try {
      await saveUserCode(problemId, code);
      alert("Code submitted successfully!");
    } catch (error) {
      console.error("Error submitting code:", error);
      alert("Failed to submit code. Please try again.");
    } finally {
      setIsSaving(false);
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

  return (
    <div className="problem-page">
      <Link to="/problems" className="back-link">
        &larr; Back to problem selection
      </Link>
      
      <h2 className="problem-description">{problemDescriptions[problemId]}</h2>
      
      <div className="code-editor-container">
        <CodeMirror
          value={code}
          height="200px"
          theme="light"
          extensions={[python({ jsx: true })]}
          onChange={handleChange}
          className="code-editor"
        />
      </div>
      
      <div className="button-container">
        <button 
          className="btn btn-primary" 
          onClick={runCode}
        >
          Run
        </button>
        <button 
          className="btn btn-success" 
          onClick={submitCode}
          disabled={isSaving}
        >
          {isSaving ? "Submitting..." : "Submit"}
        </button>
      </div>
      
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