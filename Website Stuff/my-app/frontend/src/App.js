import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Routes
import Login from './Login';
import Register from './Register';
import Home from './Home';
import ProtectedRoute from './ProtectedRoute';

function App() {
  useEffect(() => {
    // Initialize authentication state to false if not already set
    if (localStorage.getItem('isAuthenticated') === null) {
      localStorage.setItem('isAuthenticated', 'false');
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protect the home page using ProtectedRoute */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
            // Refer to ProtectedRoute.js as to how it protects /home
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
