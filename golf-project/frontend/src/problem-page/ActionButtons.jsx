// components/ActionButtons.jsx
import React from "react";

export default function ActionButtons({ onRun, onSave, onReset, onViewSolution, isSaving, isLoading, showSolution }) {
  return (
    <div className="button-container">
      <button 
        className="btn btn-primary" 
        onClick={onRun}
        disabled={isLoading}
      >
        Run
      </button>
      <button 
        className="btn btn-success" 
        onClick={onSave}
        disabled={isSaving || isLoading}
      >
        {isSaving ? "Saving..." : "Save Code"}
      </button>
      <button 
        className="btn btn-warning" 
        onClick={onReset}
        disabled={isLoading}
      >
        Reset Code
      </button>
      <button 
        className="btn btn-info" 
        onClick={onViewSolution}
        disabled={isLoading}
      >
        {showSolution ? "Hide Solution" : "View Solution"}
      </button>
    </div>
  );
}