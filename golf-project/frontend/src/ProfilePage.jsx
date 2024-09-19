import React, { useState, useEffect } from 'react';
import { readData } from './databaseUtils';
import './ProfilePage.css';

function ProfilePage() {
  const [user, setUser] = useState({
    displayName: '',
    email: '',
    level: 0,
    xp: 0,
    score: 0,
  });

  useEffect(() => {
    const userId = localStorage.getItem('userUID');
    const storedEmail = localStorage.getItem('userEmail');
    const storedDisplayName = localStorage.getItem('userDisplayName');

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