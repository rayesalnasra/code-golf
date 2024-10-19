import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseAuth';
import HomePage from './home-page/HomePage';
import ProfilePage from './profile-page/ProfilePage';
import LeaderboardPage from './leaderboard-page/LeaderboardPage';
import TutorialPage from './tutorial-page/TutorialPage';
import DocumentationPage from './documentation-page/DocumentationPage';
import DiscussionPage from './discussion-page/DiscussionPage';
import ProblemPage from './problem-page/ProblemPage';
import ProblemSelectionPage from './problem-selection/ProblemSelectionPage';
import MySolutionsPage from './solutions-page/MySolutionsPage';
import DirectMessagePage from './dm-page/DirectMessagePage'; // Ensure this is imported
import Login from './login-pages/Login';
import Register from './login-pages/Register';
import codeGolfLogo from './code-golf-icon.png';
import './App.css';

/**
 * Main application component that handles routing and authentication.
 */
function App() {
  // State variables to manage authentication and UI settings
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userDisplayName, setUserDisplayName] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Retrieve dark mode preference from local storage
    const savedDarkMode = localStorage.getItem('isDarkMode') === 'true';
    setIsDarkMode(savedDarkMode);

    // Set up listener for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        const displayName = user.displayName || localStorage.getItem('userDisplayName') || user.email;
        setIsAuthenticated(true);
        setUserDisplayName(displayName);
        localStorage.setItem('userDisplayName', displayName);
      } else {
        setIsAuthenticated(false);
        setUserDisplayName('');
        localStorage.setItem('isAuthenticated', 'false');
      }
      setIsLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setIsAuthenticated(false);
      setUserDisplayName('');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userUID');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userDisplayName');
      window.location.href = '/login';
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('isDarkMode', !isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && (
          <>
            <div className="header-container">
              <div className="logo-container">
                <img src={codeGolfLogo} alt="Code Golf Logo" className="code-golf-logo" />
              </div>
              <div className="profile-container">
                <div className="profile-icon" onClick={toggleDropdown} style={{ cursor: 'pointer', fontSize: '30px' }}>
                  👤
                </div>
                {isDropdownVisible && (
                  <div className="dropdown">
                    <ul>
                      <li><Link to="/profile">Profile</Link></li>
                      <li><Link to="/my-solutions">My Solutions</Link></li>
                      <li><button onClick={toggleDarkMode}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</button></li>
                      <li><button onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <nav>
              <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/leaderboard">Leaderboard</Link></li>
                <li><Link to="/tutorial">Tutorial</Link></li>
                <li><Link to="/documentation">Documentation</Link></li>
                <li><Link to="/discussion">Discussion</Link></li>
                <li><Link to="/problems">Problems</Link></li>
              </ul>
            </nav>
          </>
        )}

        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/home" />} />
          <Route path="/home" element={<HomePage isAuthenticated={isAuthenticated} />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/my-solutions" element={isAuthenticated ? <MySolutionsPage /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={isAuthenticated ? <LeaderboardPage /> : <Navigate to="/login" />} />
          <Route path="/tutorial" element={isAuthenticated ? <TutorialPage /> : <Navigate to="/login" />} />
          <Route path="/documentation" element={isAuthenticated ? <DocumentationPage /> : <Navigate to="/login" />} />
          <Route path="/discussion" element={isAuthenticated ? <DiscussionPage /> : <Navigate to="/login" />} />
          <Route path="/problems" element={isAuthenticated ? <ProblemSelectionPage /> : <Navigate to="/login" />} />
          <Route path="/problems/:problemId" element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />} />
          <Route path="/direct-message/:userId" element={isAuthenticated ? <DirectMessagePage /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
