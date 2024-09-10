import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";

export default function App() {
  // State to store the user's code
  const [code, setCode] = useState("def add(a, b):\n    return a + b");
  
  // State to store the results from the backend
  const [results, setResults] = useState([]);
  
  // State to store the overall result of the test
  const [testResult, setTestResult] = useState("");

  // Function to handle code submission
  const submitCode = () => {
    axios.post("http://localhost:80/python", { code })
      .then((res) => {
        // Update the results and test result state with the response data
        setResults(res.data.results);
        setTestResult(res.data.passOrFail);
      })
      .catch((error) => {
        console.error("Error submitting code:", error);
        // Handle errors by updating results with an appropriate message
        if (error.response) {
          // Error response from the server
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
        setTestResult("failed");
      });
  };

  return (
    <div>
      <h1>Python Code Tester</h1>
      <div>Create a function that adds two numbers in Python</div>
      
      {/* CodeMirror editor for Python code */}
      <CodeMirror
        value={code} // Set the current code
        height="200px" // Height of the editor
        theme="dark" // Theme of the editor
        extensions={[python({ jsx: true })]} // Python language support
        onChange={(value) => setCode(value)} // Update state when the code changes
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
