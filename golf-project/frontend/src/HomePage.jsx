import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function HomePage({ isAuthenticated }) {
  // Array of 20 coding and golf-related messages
  const messages = [
    "Ready to ace the coding green?",
    "Code your way to a hole-in-one!",
    "Par for the course? Let's aim for birdies in coding!",
    "Sharpen your skills and swing for the code!",
    "Coding is like golf; consistency is key.",
    "Every bug is a sand trap; let's code our way out!",
    "Time to tee off with some clean code!",
    "Keep your code swing smooth and efficient!",
    "Let's chip away at that coding challenge!",
    "Aim for pars, birdies, and eagles in your code!",
    "Drive your code to the finish line!",
    "Code like a pro, swing like a golfer!",
    "Putt some finesse into our coding challenges!",
    "Master the course, master the code!",
    "Ready to lower your code handicap?",
    "Time to take a swing at that code challenge!",
    "Let's aim for a coding hole-in-one!",
    "Swing for success with every line of code!",
    "Chip away at the problem, line by line.",
    "Golf your code to perfection!",
  ];

  // State to store the current message and typed text
  const [typedText, setTypedText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  // Refs for typing and timeout control
  const charIndexRef = useRef(0);
  const timeoutIdRef = useRef(null);

  useEffect(() => {
    // Typing effect function
    const typeMessage = () => {
      const currentMessage = messages[messageIndex];

      // Add the next character to the typed text
      setTypedText(currentMessage.slice(0, charIndexRef.current + 1));

      // Move to the next character
      charIndexRef.current += 1;

      if (charIndexRef.current < currentMessage.length) {
        // Set the timeout to type the next character
        timeoutIdRef.current = setTimeout(typeMessage, 50); // Adjust typing speed here
      } else {
        // Once the message is fully typed, change it after 5 seconds
        timeoutIdRef.current = setTimeout(changeMessage, 30000); // 5 seconds delay
      }
    };

    // Initialize typing effect
    setTypedText(""); // Clear the typed text before starting
    charIndexRef.current = 0; // Reset character index
    typeMessage();

    // Cleanup function to clear timeouts
    return () => {
      clearTimeout(timeoutIdRef.current);
    };
  }, [messageIndex]); // Re-run the effect when messageIndex changes

  // Function to change the message
  const changeMessage = () => {
    const newIndex = (messageIndex + 1) % messages.length; // Cycle through messages
    setMessageIndex(newIndex);
  };

  return (
    <div>
      <h1>Welcome to Code Golf</h1>
      {isAuthenticated ? (
        <p>{typedText}</p>
      ) : (
        <p>
          Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to start golfing!
        </p>
      )}
    </div>
  );
}

export default HomePage;
