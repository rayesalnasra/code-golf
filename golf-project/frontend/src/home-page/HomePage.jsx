import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage({ isAuthenticated }) {
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

  const [typedText, setTypedText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const charIndexRef = useRef(0);
  const timeoutIdRef = useRef(null);

  useEffect(() => {
    const typeMessage = () => {
      const currentMessage = messages[messageIndex];
      setTypedText(currentMessage.slice(0, charIndexRef.current + 1));
      charIndexRef.current += 1;

      if (charIndexRef.current < currentMessage.length) {
        timeoutIdRef.current = setTimeout(typeMessage, 50);
      } else {
        timeoutIdRef.current = setTimeout(changeMessage, 3000);
      }
    };

    setTypedText("");
    charIndexRef.current = 0;
    typeMessage();

    return () => {
      clearTimeout(timeoutIdRef.current);
    };
  }, [messageIndex]);

  const changeMessage = () => {
    const newIndex = (messageIndex + 1) % messages.length;
    setMessageIndex(newIndex);
  };

  return (
    <div className="home-page">
      <h1 className="page-title">Welcome to Code Golf 🏌️‍♂️</h1>
      <div className="content-container">
        <div className="welcome-message">
          <p className="typing-effect">{typedText}</p>
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