import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";

export default function App() {
  // Initialize state with default Python code
  const [code, setCode] = useState("def add(a, b):\n    return a + b");

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
    </div>
  );
}
