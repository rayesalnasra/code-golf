import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import LeaderboardPage from './LeaderboardPage';
import TutorialPage from './TutorialPage';
import DocumentationPage from './DocumentationPage';
import DiscussionPage from './DiscussionPage';
import ProblemPage from './ProblemPage';
import ProblemSelectionPage from './ProblemSelectionPage'; // Import ProblemSelectionPage
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/leaderboard">Leaderboard</Link></li>
            <li><Link to="/tutorial">Tutorial</Link></li>
            <li><Link to="/documentation">Documentation</Link></li>
            <li><Link to="/discussion">Discussion</Link></li>
            <li><Link to="/problems">Problems</Link></li> {/* Updated link */}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/tutorial" element={<TutorialPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/discussion" element={<DiscussionPage />} />
          <Route path="/problems" element={<ProblemSelectionPage />} /> {/* Updated route */}
          <Route path="/problems/:problemId" element={<ProblemPage />} /> {/* Updated route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
