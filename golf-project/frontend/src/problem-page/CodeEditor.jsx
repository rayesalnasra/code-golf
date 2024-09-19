// components/CodeEditor.jsx
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";

export default function CodeEditor({ code, language, isLoading, loadError, onChange, readOnly, title }) {
  if (isLoading) {
    return <div className="loading-message">Loading your saved code...</div>;
  }

  if (loadError) {
    return <div className="error-message">{loadError}</div>;
  }

  return (
    <div className="code-editor-container">
      {title && <h3>{title}</h3>}
      <CodeMirror
        value={code}
        height="200px"
        theme="light"
        extensions={[language === "python" ? python() : javascript()]}
        onChange={onChange}
        readOnly={readOnly}
        className="code-editor"
      />
    </div>
  );
}