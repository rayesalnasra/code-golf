import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage({ isAuthenticated }) {
  // Array of messages to be displayed in a typing effect
  const messages = [
    "🎯 Ready to ace the coding green?",
    "💻 Code your way to a hole-in-one!",
    "⛳ Par for the course? Let's aim for birdies in coding!",
    "🏌️‍♂️ Sharpen your skills and swing for the code!",
    "📝 Coding is like golf; consistency is key.",
    "🏌️‍♀️ Every bug is a sand trap; let's code our way out!",
    "🌟 Time to tee off with some clean code!",
    "⛳ Keep your code swing smooth and efficient!",
    "🔧 Let's chip away at that coding challenge!",
    "🏆 Aim for pars, birdies, and eagles in your code!",
    "🚀 Drive your code to the finish line!",
    "🧑‍💻 Code like a pro, swing like a golfer!",
    "✨ Putt some finesse into our coding challenges!",
    "🎯 Master the course, master the code!",
    "📈 Ready to lower your code handicap?",
    "⏳ Time to take a swing at that code challenge!",
    "🥇 Let's aim for a coding hole-in-one!",
    "💡 Swing for success with every line of code!",
    "🔍 Chip away at the problem, line by line.",
    "🏅 Golf your code to perfection!",
  ];

  const [typedText, setTypedText] = useState(""); // State for the current text being typed
  const [messageIndex, setMessageIndex] = useState(0); // State for the index of the current message
  const charIndexRef = useRef(0); // Ref to track the character index of the current message
  const timeoutIdRef = useRef(null); // Ref to store the timeout ID for cleanup

  useEffect(() => {
    const typeMessage = () => {
      const currentMessage = messages[messageIndex]; // Get the current message
      setTypedText(currentMessage.slice(0, charIndexRef.current + 1)); // Update the typed text
      charIndexRef.current += 1; // Move to the next character

      // If there are more characters, continue typing
      if (charIndexRef.current < currentMessage.length) {
        timeoutIdRef.current = setTimeout(typeMessage, 50); // Adjust typing speed here
      } else {
        timeoutIdRef.current = setTimeout(changeMessage, 3000); // Wait before changing message
      }
    };

    // Reset typing effect
    setTypedText("");
    charIndexRef.current = 0;
    typeMessage();

    // Cleanup function to clear timeouts on unmount
    return () => {
      clearTimeout(timeoutIdRef.current);
    };
  }, [messageIndex]); // Dependency on messageIndex to trigger effect when it changes

  const changeMessage = () => {
    const newIndex = (messageIndex + 1) % messages.length; // Cycle through messages
    setMessageIndex(newIndex); // Update message index
  };

  return (
    <div className="home-page">
      <h1 className="page-title">Welcome to Code Golf 🏌️‍♂️</h1>
      <div className="content-container">
        <div className="welcome-message">
          <p className="typing-effect">{typedText}</p> {/* Display the typing effect */}
        </div>
        <div className="action-buttons">
          <Link to="/problems" className="btn btn-primary">Start Coding 🚀</Link>
          <Link to="/leaderboard" className="btn btn-secondary">View Leaderboard 🏆</Link>
        </div>
        <div className="features">
          <div className="feature-item">
            <h3>Diverse Challenges 🧩</h3>
            <p>Test your skills with a wide range of coding problems, from simple tasks to complex algorithms.</p>
          </div>
          <div className="feature-item">
            <h3>Leaderboard 📊</h3>
            <p>Compete with others and see how you rank among fellow code golfers.</p>
          </div>
          <div className="feature-item">
            <h3>Improve Your Skills 📚</h3>
            <p>Sharpen your coding abilities and learn new techniques with each challenge you tackle.</p>
          </div>
        </div>
        <div className="extra-content">
          <h2>Why Join Us? 🤔</h2>
          <p>Join our community of coding enthusiasts and take part in fun, challenging problems that will boost your skills and confidence!</p>
          <p>Whether you're a beginner or a seasoned coder, there's always something new to learn and achieve. So, gear up and let's code!</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
