import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './styles.css';  

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Needed to prevent page reloading on Form Submissions
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // Store user information in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userUID', user.uid);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userDisplayName', user.displayName); // Store displayName

      // Send the token to the backend for verification
      await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      navigate('/home'); // Redirect to home page
    } catch (error) {
      console.error('Login error:', error); // Log the error for debugging
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
      
      <p>
        <Link to="/register">Don't have an account? Sign up</Link>
      </p>
    </div>
  );
}

export default Login;
