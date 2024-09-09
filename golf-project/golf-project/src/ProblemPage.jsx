import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";

export default function ProblemPage() {
    // State to hold the code from the editor
    const [code, setCode] = useState("");
  
    // State to hold the output after code submission
    const [output, setOutput] = useState("");
  
    // Update the code state when the editor content changes
    const handleChange = React.useCallback((value) => {
      setCode(value);
    }, []);
  
    // Placeholder function for handling code submission
    const submitCode = () => {
      // TODO: Add logic to handle code submission and update output
    };
  
    return (
      <div>
        <h1>Python Code Tester</h1>
        <div>Create a function that adds two numbers in Python</div>
        
        {/* CodeMirror editor for writing Python code */}
        <CodeMirror
          value={code} // Current content of the editor
          height="200px" // Height of the editor
          theme="dark" // Editor theme
          extensions={[python({ jsx: true })]} // Python syntax highlighting
          onChange={handleChange} // Function to call when editor content changes
        />
        
        {/* Button to submit the code */}
        <button onClick={submitCode}>
          Submit
        </button>
        
        {/* Display the output if there is any */}
        {output && (
          <div>
            <h2>Output:</h2>
            <pre>
              {output}
            </pre>
          </div>
        )}
      </div>
    );
  }
  