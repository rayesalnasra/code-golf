// components/LanguageSelector.jsx
import React from "react";

export default function LanguageSelector({
  language,            // Current selected language (either 'python' or 'javascript')
  onLanguageChange     // Callback function triggered when the language is changed
}) {
  return (
    <div className="language-selector">
      <label htmlFor="language-select">Language: </label>
      <select 
        id="language-select" // ID for the select element
        value={language}     // Controlled value of the select
        onChange={(e) => onLanguageChange(e.target.value)} // Call the onLanguageChange function with the selected value
      >
        <option value="python">Python</option> // Option for Python
        <option value="javascript">JavaScript</option> // Option for JavaScript
      </select>
    </div>
  );
}
