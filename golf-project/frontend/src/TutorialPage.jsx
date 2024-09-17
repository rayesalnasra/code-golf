import React from 'react';
import './TutorialPage.css';

const TutorialPage = () => {
  return (
    <div className="tutorial-page">
      <div className="content-container">
        <h1 className="page-title">How to Play Code Golf 🎯</h1>
        
        <section className="tutorial-section">
          <h2>What is Code Golf?</h2>
          <p>Code Golf is a recreational programming competition where participants strive to solve coding challenges using the fewest characters possible while maintaining functionality.</p>
        </section>

        <section className="tutorial-section">
          <h2>Basic Rules</h2>
          <ul>
            <li>Solve the given problem correctly</li>
            <li>Use as few characters as possible in your code</li>
            <li>Your code must be able to run without errors</li>
            <li>External libraries are usually not allowed unless specified</li>
          </ul>
        </section>

        <section className="tutorial-section">
          <h2>Strategies for Code Golf</h2>
          <div className="strategy-list">
            <div className="strategy-item">
              <h3>1. Use Short Variable Names</h3>
              <p>Instead of descriptive names, use single letters or short abbreviations.</p>
              <div className="code-example">
                <pre><code>{`// Instead of:
let counter = 0;
// Use:
let c = 0;`}</code></pre>
              </div>
            </div>
            <div className="strategy-item">
              <h3>2. Utilize Shorthand Operators</h3>
              <p>Use ++ instead of += 1, ternary operators instead of if-else, etc.</p>
              <div className="code-example">
                <pre><code>{`// Instead of:
x = x + 1;
// Use:
x++;`}</code></pre>
              </div>
            </div>
            <div className="strategy-item">
              <h3>3. Leverage Language-Specific Tricks</h3>
              <p>Each programming language has unique shortcuts. Learn and use them.</p>
              <div className="code-example">
                <pre><code>{`// Python example:
# Instead of:
if x in [1, 2, 3, 4, 5]:
# Use:
if x in range(1,6):`}</code></pre>
              </div>
            </div>
          </div>
        </section>

        <section className="tutorial-section">
          <h2>Additional Tips</h2>
          <ul>
            <li>Practice regularly to improve your skills</li>
            <li>Study other golfers' solutions to learn new techniques</li>
            <li>Remember that code golf is about fun and learning, not writing production code</li>
            <li>Balance brevity with readability when possible</li>
          </ul>
        </section>

        <section className="tutorial-section conclusion">
          <h2>Ready to Tee Off?</h2>
          <p>Now that you know the basics, it's time to start golfing! Remember, the goal is to have fun while sharpening your coding skills. Happy golfing!</p>
        </section>
      </div>
    </div>
  );
};

export default TutorialPage;