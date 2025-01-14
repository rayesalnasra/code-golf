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
import QuizPage from './quiz/QuizPage';
import TakeQuizPage from './quiz/TakeQuizPage';
import QuizCreationPage from './quiz/QuizCreationPage';
import ProblemSelectionPage from './problem-selection/ProblemSelectionPage';
import MySolutionsPage from './solutions-page/MySolutionsPage';
import FriendsPage from './friends-page/FriendsPage'; 
import DirectMessagePage from './dm-page/DirectMessagePage'; // Ensure this is imported
import MyProblemsPage from './my-problems/MyProblemsPage';
import Login from './login-pages/Login';
import Register from './login-pages/Register';
import codeGolfLogo from './code-golf-icon.png';
import CreateProblemPage from './create-problems/CreateProblemPage';
import './App.css';
import EditProblemPage from './create-problems/EditProblemPage';
import PlayCodeGolf from './play-code-golf/PlayCodeGolf';


// Import the DeletableAdBanner component
import DeletableAdBanner from './ads/DeletableAdBanner';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userDisplayName, setUserDisplayName] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('isDarkMode') === 'true';
    setIsDarkMode(savedDarkMode);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && (
          <>
            <header className="app-header">
              <div className="logo-container">
                <img src={codeGolfLogo} alt="Code Golf Logo" className="logo" />
              </div>
              <div className="user-menu">
                <div className="user-icon" onClick={toggleDropdown}>
                  👤
                </div>
                {isDropdownVisible && (
                  <div className="user-dropdown">
                    <ul>
                      <li><Link to="/profile">Profile</Link></li>
                      <li><Link to="/my-solutions">My Solutions</Link></li>
                      <li><Link to="/friends">Friends</Link></li>
                      <li><Link to="/my-problems">My Problems</Link></li>
                      <li><button onClick={toggleDarkMode}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</button></li>
                      <li><button onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </div>
                )}
              </div>
            </header>
            <nav className={`app-nav ${isMenuOpen ? 'open' : ''}`}>
              <ul>
                <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
                <li><Link to="/leaderboard" onClick={toggleMenu}>Leaderboard</Link></li>
                <li><Link to="/tutorial" onClick={toggleMenu}>Tutorial</Link></li>
                <li><Link to="/documentation" onClick={toggleMenu}>Documentation</Link></li>
                <li><Link to="/discussion" onClick={toggleMenu}>Discussion</Link></li>
                <li><Link to="/problems" onClick={toggleMenu}>Problems</Link></li>
                <li><Link to="/create-problem" onClick={toggleMenu}>Create Problem</Link></li>
                <li><Link to="/quiz" onClick={toggleMenu}>Quiz</Link></li>
                <li><Link to="/play-code-golf" onClick={toggleMenu}>Play Code Golf</Link></li>
              </ul>
            </nav>
            <div className="ad-banner">
              <DeletableAdBanner />
            </div>
            <div className="fixed-ad-banner">
              <DeletableAdBanner />
            </div>
          </>
        )}

        <main className="app-main">
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
            <Route path="/friends" element={isAuthenticated ? <FriendsPage /> : <Navigate to="/login" />} />
            <Route path="/direct-message/:userId" element={isAuthenticated ? <DirectMessagePage /> : <Navigate to="/login" />} />
            <Route path="/quiz" element={isAuthenticated ? <QuizPage /> : <Navigate to="/login" />} />
            <Route path="/create-quiz" element={isAuthenticated ? <QuizCreationPage /> : <Navigate to="/login" />} /> {/* Added Quiz Creation Route */}
            <Route path="/take-quiz/:quizId" element={isAuthenticated ? <TakeQuizPage /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
            <Route path="/create-problem" element={isAuthenticated ? <CreateProblemPage /> : <Navigate to="/login" />} />
            <Route path="/my-problems" element={isAuthenticated ? <MyProblemsPage /> : <Navigate to="/login" />} />
            <Route path="/edit-problem/:problemId" element={isAuthenticated ? <EditProblemPage /> : <Navigate to="/login" />} />
            <Route path="/play-code-golf" element={<PlayCodeGolf />} />
            <Route path="/play-code-golf/:difficulty" element={<PlayCodeGolf />} />
            <Route path="/play-code-golf/:difficulty/:language" element={<PlayCodeGolf />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="footer-ad-banner">
            <DeletableAdBanner />
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
