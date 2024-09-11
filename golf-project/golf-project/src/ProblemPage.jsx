import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";
import { saveUserCode } from "./firebase";
import "./ProblemPage.css";

const problemDescriptions = {
  add: "Create a function that adds two numbers in Python",
  reverse: "Create a function that reverses a given string in Python",
};

const initialCodes = {
  add: "def add(a, b):\n    return a + b",
  reverse: "def reverse_string(s):\n    return s[::-1]",
};

export default function ProblemPage() {
  const { problemId } = useParams();
  const [code, setCode] = useState(initialCodes[problemId] || "");
  const [results, setResults] = useState([]);
  const [testResult, setTestResult] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCode(initialCodes[problemId] || "");
    setResults([]);
    setTestResult("");
  }, [problemId]);

  const handleChange = React.useCallback((value) => {
    setCode(value);
  }, []);

  const runCode = () => {
    axios.post("http://localhost:3000/python", { code, problem: problemId })
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
