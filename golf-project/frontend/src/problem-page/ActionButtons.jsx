// components/ActionButtons.jsx
import React from "react";

export default function ActionButtons({
  onRun,           // Function to execute code
  onSave,          // Function to save code
  onReset,         // Function to reset the code editor
  onViewSolution,  // Function to toggle the solution view
  isSaving,        // Indicates if the code is currently being saved
  isLoading,       // Indicates if an action is in progress
  showSolution,    // Indicates if the solution is currently visible
  disableRun,       // Indicates if the run button should be disabled
  disableReset,    // Indicates if the reset button should be disabled
  isCodeGolfMode    // Indicates if the problem is in Code Golf mode
}) {
  return (
    <div className="action-buttons">
      <button onClick={onRun} disabled={isLoading || disableRun}>
        Run Code
      </button>
      {!isCodeGolfMode && onSave && (
        <button onClick={onSave} disabled={isSaving || isLoading}>
          {isSaving ? 'Saving...' : 'Save Code'}
        </button>
      )}
      <button onClick={onReset} disabled={isLoading || disableReset}>
        Reset Code
      </button>
      {!isCodeGolfMode && onViewSolution && (
        <button onClick={onViewSolution} disabled={isLoading}>
          {showSolution ? 'Hide Solution' : 'View Solution'}
        </button>
      )}
    </div>
  );
}
