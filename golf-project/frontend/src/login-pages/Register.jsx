import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/firebaseAuth";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { database } from "../firebase/firebase";
import { ref, get, set } from "firebase/database";
import "./AuthPages.css"; // Updated to use the unified AuthPages.css

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Custom error messages
  const customErrorMessages = {
    "auth/email-already-in-use": "This email is already in use. Please use a different email.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/operation-not-allowed": "Email/password accounts are not enabled.",
    "auth/weak-password": "Password should be at least 6 characters long.",
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update the user's profile with the displayName (username)
      await updateProfile(user, { displayName: username });

      // Store user information in localStorage using `username` directly
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userUID", user.uid);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userDisplayName", username);

      // Send the token to the backend for verification
      const idToken = await user.getIdToken();
      await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });

      // Initialize Firebase Realtime Database
      const userRef = ref(database, "users/" + user.uid);

      // Check if user exists in the database
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        // User does not exist, add to database
        await set(userRef, {
          displayName: username || user.email,
          score: 0,
          xp: 0,
          level: 0,
        });
        console.log("User added to database");
      } else {
        console.log("User already exists in database");
      }

      // Navigate to home after verification and localStorage updates
      navigate("/home");
    } catch (error) {
      console.error("Registration error:", error);
      const errorCode = error.code;
      const errorMessage = customErrorMessages[errorCode] || "An error occurred during registration.";
      setError(errorMessage); // Set custom error message
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
            autoComplete="off"
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
          />
          <button type="submit" className="auth-button">
            Sign Up
          </button>
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
