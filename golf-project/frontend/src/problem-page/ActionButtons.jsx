// components/ActionButtons.jsx
import React from "react";

export default function ActionButtons({
  onRun,           // Function to execute code
  onSave,          // Function to save code
  onReset,         // Function to reset the code editor
  onViewSolution,  // Function to toggle the solution view
  isSaving,        // Indicates if the code is currently being saved
  isLoading,       // Indicates if an action is in progress
  showSolution     // Indicates if the solution is currently visible
}) {
  return (
    <div className="button-container">
      <button 
        className="btn btn-primary" 
        onClick={onRun} // Trigger the run action
        disabled={isLoading} // Disable button while loading
      >
        Run
      </button>
      <button 
        className="btn btn-success" 
        onClick={onSave} // Trigger the save action
        disabled={isSaving || isLoading} // Disable if saving or loading
      >
        {isSaving ? "Saving..." : "Save Code"} 
      </button>
      <button 
        className="btn btn-warning" 
        onClick={onReset} // Trigger the reset action
        disabled={isLoading} // Disable button while loading
      >
        Reset Code
      </button>
      <button 
        className="btn btn-info" 
        onClick={onViewSolution} // Toggle view solution action
        disabled={isLoading} // Disable button while loading
      >
        {showSolution ? "Hide Solution" : "View Solution"}
      </button>
    </div>
  );
}
