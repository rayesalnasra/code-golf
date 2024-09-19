import React, { useState, useEffect } from 'react'; // Import React
import { readData } from './databaseUtils'; // Import a custom function to read data from the database
import './ProfilePage.css'; // Import CSS for styling the profile page

// Define the ProfilePage component
function ProfilePage() {
  // Define the initial state 'user' with useState to store user profile information
  const [user, setUser] = useState({
    displayName: '', // User's display name
    email: '', // User's email
    level: 0, // User's current level
    xp: 0, // user's XP 
    score: 0, // User's total score
  });

  useEffect(() => {
    const userId = localStorage.getItem('userUID'); // Retrieve the user's UID
    const storedEmail = localStorage.getItem('userEmail'); // Retrieve the stored email 
    const storedDisplayName = localStorage.getItem('userDisplayName'); // Retrieve the stored display name

    if (userId) {
      readData(`users/${userId}`, (userData) => {
        if (userData) {
          setUser({
            displayName: storedDisplayName || userData.displayName || 'Anonymous User',
            email: storedEmail || userData.email || 'No email provided',
            level: userData.level || 1,
            xp: userData.xp || 0,
            score: userData.score || 0,
          });
        }
      });
    }
  }, []);

  return (
    <div className="profile-page">
      <div className="content-container">
        <h1 className="page-title">User Profile 👤</h1>
        
        <section className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>Username</h3>
              <p>{user.displayName}</p>
            </div>
            <div className="info-item">
              <h3>Email</h3>
              <p>{user.email}</p>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2>Code Golf Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>Level</h3>
              <p className="stat-value">{user.level}</p>
            </div>
            <div className="stat-item">
              <h3>XP</h3>
              <p className="stat-value">{user.xp} / {100 + (user.level * 50)}</p>
            </div>
            <div className="stat-item">
              <h3>Score</h3>
              <p className="stat-value">{user.score}</p>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2>Recent Activity</h2>
          <p>Coming soon: Your recent problem-solving activity will be displayed here!</p>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;