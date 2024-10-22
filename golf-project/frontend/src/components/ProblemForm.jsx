import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import axios from 'axios';

// Main component for creating/editing programming problems
const ProblemForm = ({ initialProblem, initialTestCases, onSubmit, submitButtonText, showIdField }) => {
  // State variables
  const [problem, setProblem] = useState(initialProblem);
  const [testCases, setTestCases] = useState(initialTestCases);
  const [newTestCase, setNewTestCase] = useState({ inputs: '', expected_output: '' });
  const [testResults, setTestResults] = useState(null);
  const [error, setError] = useState(null);
  const [allTestsPassed, setAllTestsPassed] = useState(false);

  // Update state when props change
  useEffect(() => {
    setProblem(initialProblem);
    setTestCases(initialTestCases);
  }, [initialProblem, initialTestCases]);

  // Handle changes in form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProblem(prevProblem => ({
      ...prevProblem,
      [name]: value
    }));
  };

  // Handle changes in code editor
  const handleCodeChange = (value, type) => {
    setProblem(prevProblem => ({
      ...prevProblem,
      [type]: value
    }));
  };

  // Handle changes in test case inputs
  const handleTestCaseChange = (e) => {
    const { name, value } = e.target;
    setNewTestCase(prevTestCase => ({
      ...prevTestCase,
      [name]: value
    }));
  };

  // Parse test case input/output values
  const parseTestCaseValue = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return value.split(',').map(item => {
        try {
          return JSON.parse(item.trim());
        } catch {
          return item.trim();
        }
      });
    }
  };

  // Add a new test case
  const addTestCase = () => {
    const newCase = {
      inputs: parseTestCaseValue(newTestCase.inputs),
      expected_output: parseTestCaseValue(newTestCase.expected_output)
    };
    setTestCases(prevTestCases => [...prevTestCases, newCase]);
    setNewTestCase({ inputs: '', expected_output: '' });
  };

  // Remove a test case
  const removeTestCase = (index) => {
    setTestCases(prevTestCases => prevTestCases.filter((_, i) => i !== index));
  };

  // Run the code against test cases
  const runCode = async () => {
    setError(null);
    setTestResults(null);
    setAllTestsPassed(false);
    try {
      const response = await axios.post("http://localhost:3000/run-code", {
        code: problem.solution,
        problem: problem.id,
        language: problem.language,
        testCases: testCases
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setTestResults(response.data);
        
        if (response.data.passOrFail === 'passed') {
          setAllTestsPassed(true);
          alert("All test cases passed successfully!");
        } else {
          alert("Some test cases failed. Please fix your solution before submitting.");
        }
      }
    } catch (error) {
      console.error("Error running code:", error);
      setError(error.response?.data?.error || "An unexpected error occurred. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allTestsPassed) {
      alert("All test cases must pass before you can submit the problem.");
      return;
    }
    onSubmit(problem, testCases);
  };

  // Render the form
  return (
    <form onSubmit={handleSubmit}>
      {showIdField && (
        <div>
          <label htmlFor="id">Problem ID:</label>
          <input
            type="text"
            id="id"
            name="id"
            value={problem.id}
            onChange={handleInputChange}
            required
          />
        </div>
      )}
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={problem.title}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={problem.description}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          name="difficulty"
          value={problem.difficulty}
          onChange={handleInputChange}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div>
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          name="language"
          value={problem.language}
          onChange={handleInputChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </div>
      
      {/* Initial Code editor */}
      <div>
        <label htmlFor="initialCode">Initial Code:</label>
        <CodeMirror
          value={problem.initialCode}
          height="200px"
          extensions={[problem.language === 'javascript' ? javascript() : python()]}
          onChange={(value) => handleCodeChange(value, 'initialCode')}
        />
      </div>
      
      {/* Solution Code editor */}
      <div>
        <label htmlFor="solution">Solution:</label>
        <CodeMirror
          value={problem.solution}
          height="200px"
          extensions={[problem.language === 'javascript' ? javascript() : python()]}
          onChange={(value) => handleCodeChange(value, 'solution')}
        />
      </div>
      
      {/* Test Cases section */}
      <div>
        <h2>Test Cases</h2>
        {testCases.map((testCase, index) => (
          <div key={index} className="test-case">
            <p>Inputs: {JSON.stringify(testCase.inputs)}</p>
            <p>Expected Output: {JSON.stringify(testCase.expected_output)}</p>
            <button type="button" onClick={() => removeTestCase(index)}>Remove</button>
          </div>
        ))}
        <div>
          <input
            type="text"
            name="inputs"
            value={newTestCase.inputs}
            onChange={handleTestCaseChange}
            placeholder="Inputs (comma-separated or JSON array)"
          />
          <input
            type="text"
            name="expected_output"
            value={newTestCase.expected_output}
            onChange={handleTestCaseChange}
            placeholder="Expected Output"
          />
          <button type="button" onClick={addTestCase}>Add Test Case</button>
        </div>
      </div>
      
      {/* Test Solution button */}
      <button type="button" onClick={runCode}>Test Solution</button>
      
      {/* Submit button (disabled if not all tests passed) */}
      <button type="submit" disabled={!allTestsPassed}>{submitButtonText}</button>
      
      {/* Warning message if not all tests passed */}
      {!allTestsPassed && (
        <p className="warning-message">All test cases must pass before you can submit the problem.</p>
      )}

      {/* Error and test results display */}
    </form>
  );
};

export default ProblemForm;
