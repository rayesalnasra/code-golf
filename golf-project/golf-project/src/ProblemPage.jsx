import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";

export default function App() {
  // Initialize state with default Python code
  const [code, setCode] = useState("def add(a, b):\n    return a + b");
  const [results, setResults] = useState([]); // State to store test results
  const [testResult, setTestResult] = useState(""); // State to store the overall test result

  // Function to handle code submission
  const submitCode = () => {
    axios.post("http://localhost:80/python", { code })
      .then((res) => {
        setResults(res.data.results); // Update results with data from the server
        setTestResult(res.data.passOrFail); // Update overall test result
      })
      .catch((error) => {
        console.error("Error submitting code:", error); // Log any errors
        setResults([{ error: "An error occurred while submitting your code." }]); // Set error result
        setTestResult("failed"); // Set test result to failed
      });
  };

  return (
    <div>
      <h1>Python Code Tester</h1>
      <div>Create a function that adds two numbers in Python</div> 
      
      {/* CodeMirror editor for writing Python code */}
      <CodeMirror
        value={code} // Current code in the editor
        height="200px" // Height of the editor
        theme="dark" // Editor theme
        extensions={[python({ jsx: true })]} // Python language support
        onChange={(value) => setCode(value)} // Update state when the code changes
      />
      
      {/* Button to submit the code */}
      <button onClick={submitCode}>
        Submit
      </button>
      
      {/* Display the test results if available */}
      {results.length > 0 && (
        <div>
          <h2>Test Results:</h2>
          {results.map((result, index) => (
            <div key={index}>
              {result.error ? (
                <div>
                  <strong>Error:</strong> {result.error} {/* Display error if present */}
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
