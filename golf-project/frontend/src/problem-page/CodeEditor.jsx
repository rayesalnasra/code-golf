// components/CodeEditor.jsx
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python"; // Import Python language support
import { javascript } from "@codemirror/lang-javascript"; // Import JavaScript language support

export default function CodeEditor({
  code,         // The code to be displayed in the editor
  language,     // The programming language of the code (either 'python' or 'javascript')
  isLoading,    // Indicates if the editor is currently loading saved code
  loadError,    // Error message if loading the code fails
  onChange,     // Callback function triggered when the code is changed
  readOnly,     // Boolean indicating if the editor is read-only
  title         // Optional title to display above the editor
}) {
  // Display a loading message while code is being loaded
  if (isLoading) {
    return <div className="loading-message">Loading your saved code...</div>;
  }

  // Display an error message if there's an error loading the code
  if (loadError) {
    return <div className="error-message">{loadError}</div>;
  }

  return (
    <div className="code-editor-container">
      {title && <h3>{title}</h3>} {/* Conditionally render title if provided */}
      <CodeMirror
        value={code} // The initial code displayed in the editor
        height="200px" // Set the height of the editor
        theme="dark" // Set the theme for the editor
        extensions={[language === "python" ? python() : javascript()]} // Load the appropriate language extension
        onChange={onChange} // Set the onChange callback
        readOnly={readOnly} // Set the read-only state
        className="code-editor" // Additional class for styling
      />
    </div>
  );
}
