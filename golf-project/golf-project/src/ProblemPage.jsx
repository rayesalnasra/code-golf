import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";

// Main functional component
export default function App() {
  // State to manage the Python code input by the user
  const [code, setCode] = useState("def add(a, b):\n    return a + b");

  // State to store the results of the test cases from the server
  const [results, setResults] = useState([]);

  // State to store the overall result (pass/fail) of the test cases
  const [testResult, setTestResult] = useState("");

  // Function to handle code submission
  const submitCode = () => {
    // Send POST request to the server with the code
    axios.post("http://localhost:80/python", { code })
      .then((res) => {
        // On success, update results and testResult state
        setResults(res.data.results);
        setTestResult(res.data.passOrFail);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error submitting code:", error);
        if (error.response) {
          // Server responded with an error
          setResults([{ 
            error: error.response.data.error || "An error occurred while running your code.",
            traceback: error.response.data.traceback
          }]);
        } else if (error.request) {
          // No response received
          setResults([{ 
            error: "Unable to reach the server. Please check your connection and try again." 
          }]);
        } else {
          // Other errors
          setResults([{ 
            error: "An unexpected error occurred. Please try again." 
          }]);
        }
        setTestResult("failed");
      });
  };

  return (
    <div>
      <h1>Python Code Tester</h1>
      <div>Create a function that adds two numbers in Python</div> 
      
      {/* CodeMirror editor for Python code input */}
      <CodeMirror
        value={code} // Set the editor's content
        height="200px" // Set the editor's height
        theme="dark" // Set the editor's theme
        extensions={[python({ jsx: true })]} // Use Python language mode
        onChange={(value) => setCode(value)} // Update state on content change
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
