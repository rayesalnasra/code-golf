import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";

export default function App() {
  // State to store the user's Python code
  const [code, setCode] = useState("def add(a, b):\n    return a + b");
  
  // State to store the results of the test cases
  const [results, setResults] = useState([]);
  
  // State to store the overall test result (pass/fail)
  const [testResult, setTestResult] = useState("");

  // Function to handle code submission
  const submitCode = () => {
    axios.post("http://localhost:80/python", { code })
      .then((res) => {
        // Update the state with the test results and overall test result
        setResults(res.data.results);
        setTestResult(res.data.passOrFail);
      })
      .catch((error) => {
        console.error("Error submitting code:", error);
        // Handle different types of errors and update the results state accordingly
        if (error.response) {
          // Server responded with an error
          setResults([{ 
            error: error.response.data.error || "An error occurred while running your code.",
            traceback: error.response.data.traceback
          }]);
        } else if (error.request) {
          // No response from the server
          setResults([{ 
            error: "Unable to reach the server. Please check your connection and try again." 
          }]);
        } else {
          // Other unexpected errors
          setResults([{ 
            error: "An unexpected error occurred. Please try again." 
          }]);
        }
        // Set the test result to "failed" in case of an error
        setTestResult("failed");
      });
  };

  return (
    <div>
      <h1>Python Code Tester</h1>
      <div>Create a function that adds two numbers in Python</div>
      
      {/* CodeMirror editor for editing Python code */}
      <CodeMirror
        value={code} // The current value of the editor
        height="200px" // Height of the editor
        theme="dark" // Theme of the editor
        extensions={[python({ jsx: true })]} // Extension for Python language support
        onChange={(value) => setCode(value)} // Update state when the code changes
      />
      
      {/* Button to submit the code for testing */}
      <button onClick={submitCode}>
        Submit
      </button>
      
      {/* Display test results if any results are available */}
      {results.length > 0 && (
        <div>
          <h2>Test Results:</h2>
          {results.map((result, index) => (
            <div key={index}>
              {result.error ? (
                <div>
                  <strong>Error:</strong> {result.error} {/* Display error message */}
                  {result.traceback && (
                    <pre>{result.traceback}</pre> {/* Display traceback if available */}
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
      
      {/* Display the overall test result */}
      {testResult && (
        <div>
          Overall Result: {testResult}
        </div>
      )}
    </div>
  );
}
