import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";

const problemDescriptions = {
  add: "Create a function that adds two numbers in Python",
  reverse: "Create a function that reverses a given string in Python",
};

const initialCodes = {
  add: "def add(a, b):\n    return a + b",
  reverse: "def reverse_string(s):\n    return s[::-1]",
};

// Main functional component for the Python code tester
export default function App() {
  // State to manage the Python code input by the user
  const [code, setCode] = useState(initialCodes["add"]); // Default to "add" problem

  // State to store the results of test cases from the server
  const [results, setResults] = useState([]);

  // State to store the overall result of the test cases (pass/fail)
  const [testResult, setTestResult] = useState("");

  // Memoized callback to handle changes in the CodeMirror editor
  const handleChange = React.useCallback((value) => {
    setCode(value); // Update code state with the new value from the editor
  }, []);

  // Function to handle the submission of code to the server
  const submitCode = () => {
    // Send a POST request to the server with the code
    axios.post("http://localhost:/python", { code })
      .then((res) => {
        // On successful response, update results and testResult state
        setResults(res.data.results);
        setTestResult(res.data.passOrFail);
      })
      .catch((error) => {
        // Handle different types of errors
        console.error("Error submitting code:", error);
        if (error.response) {
          // Server responded with an error
          setResults([{ 
            error: error.response.data.error || "An error occurred while running your code."
          }]);
        } else if (error.request) {
          // No response received from the server
          setResults([{ 
            error: "Unable to reach the server. Please check your connection and try again." 
          }]);
        } else {
          // Other errors
          setResults([{ 
            error: "An unexpected error occurred. Please try again." 
          }]);
        }
        // Set the overall result to "failed"
        setTestResult("failed");
      });
  };

  // Replace fixed problem description with dynamic one
  const problemDescription = problemDescriptions["add"];
  
  return (
    <div>
      <h1>Python Code Tester</h1>
      <div>{problemDescription}</div>
      
      {/* CodeMirror editor for Python code input */}
      <CodeMirror
        value={code}
        height="200px"
        theme="dark"
        extensions={[python({ jsx: true })]}
        onChange={handleChange}
      />
      
      {/* Button to submit the code */}
      <button onClick={submitCode}>
        Submit
      </button>
      
      {/* Display test results if available */}
      {results.length > 0 && (
        <div>
          <h2>Test Results:</h2>
          {results.map((result, index) => (
            <div key={index}>
              {result.error ? (
                <div>
                  <strong>Error:</strong> {result.error}
                  {result.traceback && (
                    <pre>{result.traceback}</pre> // Display traceback if available
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
      
      {/* Display the overall result */}
      {testResult && (
        <div>
          Overall Result: {testResult}
        </div>
      )}
    </div>
  );
}
