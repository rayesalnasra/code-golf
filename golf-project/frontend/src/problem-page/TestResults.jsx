// components/TestResults.jsx
import React from "react";

export default function TestResults({ results, testResult }) {
  // If there are no results and no testResult, render nothing
  if (results.length === 0 && !testResult) {
    return null;
  }

  return (
    <div className="results-container">
      <h3 className="results-title">Test Results:</h3>
      {results.map((result, index) => (
        <div key={index} className={`result-item ${result.passed ? 'result-passed' : 'result-failed'}`}>
          {result.error ? (
            <div>
              <strong>Error:</strong> {result.error}
              {result.traceback && (
                <pre className="error-traceback">{result.traceback}</pre>
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
      {testResult && (
        <div className={`test-result ${testResult === 'passed' ? 'test-passed' : 'test-failed'}`}>
          Overall Result: {testResult}
        </div>
      )}
    </div>
  );
}
