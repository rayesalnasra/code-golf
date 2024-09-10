import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";

// Main functional component for the Python code tester
export default function App() {
  // State to manage the Python code input by the user
  const [code, setCode] = useState("def add(a, b):\n    return a + b");

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
    axios.post("http://localhost:3000/python", { code })
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
        onChange={handleChange} // Handle content changes
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
