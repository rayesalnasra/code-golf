import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import './styles.css';  

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user's profile with the displayName (username)
      await updateProfile(user, {
        displayName: username
      });

      // Get token
      const idToken = await user.getIdToken();

      // Store user information in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userUID', user.uid);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userDisplayName', user.displayName);

      // Send the token to the backend for verification
      await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      // Navigates to home after verification
      navigate('/home');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br /><br />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Sign Up</button>
        {error && <p>{error}</p>}
      </form>

      <p>
        <Link to="/login">Already have an account? Log in</Link>
      </p>
    </div>
  );
}

export default Register;
