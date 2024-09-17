// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseAuth';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import LeaderboardPage from './LeaderboardPage';
import TutorialPage from './TutorialPage';
import DocumentationPage from './DocumentationPage';
import DiscussionPage from './DiscussionPage';
import ProblemPage from './ProblemPage';
import ProblemSelectionPage from './ProblemSelectionPage';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userDisplayName, setUserDisplayName] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Force reload to get the latest user data
        await user.reload();
  
        // Use user.displayName or fallback to localStorage value
        const displayName = user.displayName || localStorage.getItem('userDisplayName') || user.email;
        
        setIsAuthenticated(true);
        setUserDisplayName(displayName); // Set displayName
        
        // Update localStorage with the latest displayName
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
    // Clear authentication state
    setIsAuthenticated(false);
    setUserDisplayName('');

    // Clear all user-related information from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userUID');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userDisplayName');

    // Navigate to login page
    window.location.href = '/login'; // Use window.location.href to force a full page reload to clear any cached states
  }).catch((error) => {
    console.error("Logout error:", error);
  });
};


  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && (
          <>
            <div className="profile-container">
              <div className="profile-icon" onClick={toggleDropdown} style={{ cursor: 'pointer', fontSize: '30px' }}>
                👤
              </div>
              {isDropdownVisible && (
                <div className="dropdown">
                  <ul>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              )}
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
          <Route 
            path="/home" 
            element={
              <HomePage 
                isAuthenticated={isAuthenticated}
              />
            } 
          />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={isAuthenticated ? <LeaderboardPage /> : <Navigate to="/login" />} />
          <Route path="/tutorial" element={isAuthenticated ? <TutorialPage /> : <Navigate to="/login" />} />
          <Route path="/documentation" element={isAuthenticated ? <DocumentationPage /> : <Navigate to="/login" />} />
          <Route path="/discussion" element={isAuthenticated ? <DiscussionPage /> : <Navigate to="/login" />} />
          <Route path="/problems" element={isAuthenticated ? <ProblemSelectionPage /> : <Navigate to="/login" />} />
          <Route path="/problems/:problemId" element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;