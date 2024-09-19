// components/LanguageSelector.jsx
import React from "react";

export default function LanguageSelector({ language, onLanguageChange }) {
  return (
    <div className="language-selector">
      <label htmlFor="language-select">Language: </label>
      <select 
        id="language-select" 
        value={language} 
        onChange={(e) => onLanguageChange(e.target.value)}
      >
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
      </select>
    </div>
  );
}