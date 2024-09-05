import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SolutionTest from "./SolutionTest.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SolutionTest />
  </StrictMode>
);
