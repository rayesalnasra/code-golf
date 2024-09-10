import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";

export default function App() {
  // Initialize state with default Python code
  const [code, setCode] = useState("def add(a, b):\n    return a + b");
  const [output, setOutput] = useState(""); // State to store the output from the server

  // Function to submit code to the server
  const submitCode = () => {
    axios.post("http://localhost:80/python", { code })
      .then((res) => setOutput(res.data.output)) // Update output state with the server response
      .catch((error) => console.error("Error submitting code:", error)); // Log errors to the console
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
      
      {/* Display the output from the server if available */}
      {output && (
        <div>
          <h2>Output:</h2>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}
