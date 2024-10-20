import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/firebaseAuth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { database } from "../firebase/firebase";
import "./AuthPages.css"; // Updated to use the unified AuthPages.css

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save authentication state in localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userUID", user.uid);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userDisplayName", user.displayName || user.email); // Use displayName or email as fallback

      // will start

      // Initialize Firebase Realtime Database
      const userRef = ref(database, "users/" + user.uid);

      // Check if user exists in the database
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        // User does not exist, add to database
        await set(userRef, {
          displayName: user.displayName || user.email,
          score: 0,
          xp: 0,
          level: 0,
        });
      }

      //will end

      // Navigate to home page after login
      navigate("/home");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1>Welcome to Code Golf</h1>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoComplete="off"
          />
          <input
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete="off"
          />
          <button type="submit" className="auth-button">
            Login
          </button>
          {error && <p className="auth-error">{error}</p>}
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;