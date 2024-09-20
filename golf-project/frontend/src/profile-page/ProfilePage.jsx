import React, { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { readData, updateData } from "../firebase/databaseUtils";
import { auth } from "../firebase/firebaseAuth";
import "./ProfilePage.css";

function ProfilePage() {
  const [user, setUser] = useState({
    displayName: "",
    email: "",
    level: 0,
    xp: 0,
    score: 0,
  });

  const [editableUser, setEditableUser] = useState({
    displayName: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userUID");
    const storedEmail = localStorage.getItem("userEmail");
    const storedDisplayName = localStorage.getItem("userDisplayName");

    if (userId) {
      readData(`users/${userId}`, (userData) => {
        if (userData) {
          setUser({
            displayName:
              storedDisplayName || userData.displayName || "Anonymous User",
            email: storedEmail || userData.email || "No email provided",
            level: userData.level || 0,
            xp: userData.xp || 0,
            score: userData.score || 0,
          });
          setEditableUser({
            displayName:
              storedDisplayName || userData.displayName || "Anonymous User",
          });
        }
      });
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setEditableUser({
      displayName: user.displayName,
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    const userId = localStorage.getItem("userUID");

    if (userId) {
      try {
        const authUser = auth.currentUser;

        // --- Update Firebase Auth ---
        if (editableUser.displayName !== user.displayName) {
          await updateProfile(authUser, {
            displayName: editableUser.displayName,
          });
        }

        // --- Update Firebase Realtime Database ---
        // Update the display name in Realtime Database
        await updateData(`users/${userId}`, {
          displayName: editableUser.displayName,
        });

        // --- Update Local Storage ---
        localStorage.setItem("userDisplayName", editableUser.displayName);

        // Update user state and exit edit mode
        setUser((prevUser) => ({
          ...prevUser,
          displayName: editableUser.displayName,
        }));
        setIsEditing(false);

        alert("Profile updated successfully");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile. Please try again.");
      }
    } else {
      console.error("No user ID found in localStorage");
    }
  };

  return (
    <div className="profile-page">
      <div className="content-container">
        <h1 className="page-title">User Profile 👤</h1>

        <section className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>Username</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="displayName"
                  value={editableUser.displayName}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{user.displayName}</p>
              )}
            </div>
            <div className="info-item">
              <h3>Email</h3>
              <p>{user.email}</p> {/* Email is displayed but not editable */}
            </div>
          </div>
          {isEditing ? (
            <div className="button-group">
              <button className="save-button" onClick={handleSaveClick}>
                Save
              </button>
              <button className="cancel-button" onClick={handleCancelClick}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="edit-button" onClick={handleEditClick}>
              Edit
            </button>
          )}
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
              <p className="stat-value">
                {user.xp} / {100 + user.level * 50}
              </p>
            </div>
            <div className="stat-item">
              <h3>Score</h3>
              <p className="stat-value">{user.score}</p>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2>Recent Activity</h2>
          <p>
            Coming soon: Your recent problem-solving activity will be displayed
            here!
          </p>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
