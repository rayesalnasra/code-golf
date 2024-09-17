import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from './firebaseAuth';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import './AuthPages.css';  // Updated to use the unified AuthPages.css

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's profile with the displayName (username)
      await updateProfile(user, { displayName: username });

      // Store user information in localStorage using `username` directly
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userUID', user.uid);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userDisplayName', username);

      // Send the token to the backend for verification
      const idToken = await user.getIdToken();
      await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      // Navigate to home after verification and localStorage updates
      navigate('/home');
    } catch (error) {
      console.error("Registration error:", error); // Add error logging for debugging
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="auth-form">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">Sign Up</button>
          {error && <p className="auth-error">{error}</p>}
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
