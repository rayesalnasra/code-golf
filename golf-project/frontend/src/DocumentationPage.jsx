import React from 'react';
import './DocumentationPage.css';

const DocumentationPage = () => {
  return (
    <div className="documentation-page">
      <div className="content-container">
        <h1 className="page-title">Coding Resources 📚</h1>
        
        <section className="documentation-section">
          <h2>Getting Started</h2>
          <p>Welcome to the documentation page! Here you'll find resources to help you learn and improve your coding skills, with a focus on JavaScript and Python.</p>
        </section>

        <section className="documentation-section">
          <h2>JavaScript Resources</h2>
          <ul className="resource-list">
            <li>
              <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" target="_blank" rel="noopener noreferrer">
                MDN Web Docs - JavaScript Guide
              </a>
              <p>Comprehensive guide for beginners to advanced developers.</p>
            </li>
            <li>
              <a href="https://javascript.info/" target="_blank" rel="noopener noreferrer">
                JavaScript.info
              </a>
              <p>Modern JavaScript tutorial with simple explanations.</p>
            </li>
            <li>
              <a href="https://www.w3schools.com/js/" target="_blank" rel="noopener noreferrer">
                W3Schools JavaScript Tutorial
              </a>
              <p>Interactive tutorials and examples for beginners.</p>
            </li>
          </ul>
        </section>

        <section className="documentation-section">
          <h2>Python Resources</h2>
          <ul className="resource-list">
            <li>
              <a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noopener noreferrer">
                Python Official Documentation
              </a>
              <p>The official Python tutorial, great for beginners and as a reference.</p>
            </li>
            <li>
              <a href="https://www.learnpython.org/" target="_blank" rel="noopener noreferrer">
                LearnPython.org
              </a>
              <p>Free interactive Python tutorial for beginners.</p>
            </li>
            <li>
              <a href="https://realpython.com/" target="_blank" rel="noopener noreferrer">
                Real Python
              </a>
              <p>Tutorials, articles, and resources for all skill levels.</p>
            </li>
          </ul>
        </section>

        <section className="documentation-section">
          <h2>Additional Learning Resources</h2>
          <ul className="resource-list">
            <li>
              <a href="https://www.freecodecamp.org/" target="_blank" rel="noopener noreferrer">
                freeCodeCamp
              </a>
              <p>Free coding bootcamp with certifications in various technologies.</p>
            </li>
            <li>
              <a href="https://www.codecademy.com/" target="_blank" rel="noopener noreferrer">
                Codecademy
              </a>
              <p>Interactive coding lessons in various programming languages.</p>
            </li>
            <li>
              <a href="https://stackoverflow.com/" target="_blank" rel="noopener noreferrer">
                Stack Overflow
              </a>
              <p>Q&A community for programmers to find solutions to coding problems.</p>
            </li>
          </ul>
        </section>

        <section className="documentation-section conclusion">
          <h2>Ready to Code?</h2>
          <p>These resources will help you get started and improve your coding skills. Remember, practice is key to becoming a proficient programmer. Happy coding!</p>
        </section>
      </div>
    </div>
  );
};

export default DocumentationPage;