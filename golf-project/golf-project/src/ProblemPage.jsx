import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";

export default function ProblemPage() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [testResult, setTestResult] = useState("");

  const handleChange = React.useCallback((value) => {
    setCode(value);
  }, []);

  const submitCode = () => {
    axios.post("http://localhost:80/python", { code })
      .then((res) => {
        setOutput(res.data.output);
        setTestResult(res.data.passOrFail);
      })
      .catch((error) => {
        console.error("Error submitting code:", error);
        if (error.response) {
          setOutput(error.response.data.output || "An error occurred while running your code.");
        } else if (error.request) {
          setOutput("Unable to reach the server. Please check your connection and try again.");
        } else {
          setOutput("An unexpected error occurred. Please try again.");
        }
        setTestResult("failed");
      });
  };

  return (
    <div>
      <h1>Python Code Tester</h1>
      <div>Create a function that adds two numbers in Python</div>
      
      <CodeMirror
        value={code}
        height="200px"
        theme="dark"
        extensions={[python({ jsx: true })]}
        onChange={handleChange}
      />
      
      <button onClick={submitCode}>
        Submit
      </button>
      
      {output && (
        <div>
          <h2>Output:</h2>
          <pre>
            {output}
          </pre>
        </div>
      )}
      
      {testResult && (
        <div>
          Test {testResult}
        </div>
      )}
    </div>
  );
}
