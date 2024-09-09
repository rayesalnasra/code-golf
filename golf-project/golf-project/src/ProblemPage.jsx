import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";

export default function ProblemPage() {
    // State to hold the code from the editor
    const [code, setCode] = useState("");
  
    // Update the code state when editor content changes
    const handleChange = React.useCallback((value) => {
      setCode(value);
    }, []);
  
    return (
      <div>
        <h1>Python Code Tester</h1>
        <div>Create a function that adds two numbers in Python</div>
        
        {/* CodeMirror editor for writing Python code */}
        <CodeMirror
          value={code} // Initial content of the editor
          height="200px" // Height of the editor
          theme="dark" // Theme for the editor
          extensions={[python({ jsx: true })]} // Python syntax highlighting
          onChange={handleChange} // Function to call when the editor content changes
        />
      </div>
    );
  }
  