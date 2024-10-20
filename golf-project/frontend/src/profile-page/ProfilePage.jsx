import React, { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { readData, updateData } from "../firebase/databaseUtils";
import { auth } from "../firebase/firebaseAuth";
import { Line } from "react-chartjs-2"; // New import for Line chart
import { getDatabase, ref, get, set } from "firebase/database"; // New import for Firebase Realtime Database
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js"; // New import for Chart.js
import "./ProfilePage.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
); // New Chart.js registration

function ProfilePage() {
  const getBadges = (score) => {
    const badges = [];
    if (score > 100) badges.push("100");
    if (score > 1000) badges.push("1000");
    if (score > 1500) badges.push("1500");
    if (score > 2000) badges.push("2000");
    if (score > 2500) badges.push("2500");
    return badges;
  };

  const getLevelBadges = (level) => {
    const badges = [];
    if (level >= 1) badges.push("1");
    if (level >= 5) badges.push("5");
    if (level >= 10) badges.push("10");
    if (level >= 50) badges.push("50");
    if (level >= 100) badges.push("100+");
    return badges;
  };

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

  // --- New state for weekly progress ---
  const [weeklyProgress, setWeeklyProgress] = useState([]);

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

      // --- New code to fetch weekly progress ---
      const fetchWeeklyProgress = async () => {
        const db = getDatabase();
        const progressData = [];
        for (let i = 1; i <= 7; i++) {
          const dayRef = ref(db, `weeklyProgress/${userId}/day${i}`);
          const snapshot = await get(dayRef);
          if (snapshot.exists()) {
            progressData.push(snapshot.val());
          } else {
            progressData.push(0); // Default value if no data exists
          }
        }
        setWeeklyProgress(progressData);
      };

      fetchWeeklyProgress();

      // --- New code to update day7 value and shift previous values ---
      const updateWeeklyProgress = async () => {
        const db = getDatabase();
        const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
        const lastAccessRef = ref(db, `users/${userId}/lastAccessDate`);
        const lastAccessSnapshot = await get(lastAccessRef);
        const lastAccessDate = lastAccessSnapshot.exists()
          ? lastAccessSnapshot.val()
          : null;

        if (lastAccessDate === currentDate) {
          // Update day7 value to current score
          const day7Ref = ref(db, `weeklyProgress/${userId}/day7`);
          const userScoreRef = ref(db, `users/${userId}/score`);
          const userScoreSnapshot = await get(userScoreRef);
          if (userScoreSnapshot.exists()) {
            await set(day7Ref, userScoreSnapshot.val());
          }
        } else {
          // Shift previous values to the left
          for (let i = 1; i < 7; i++) {
            const currentDayRef = ref(db, `weeklyProgress/${userId}/day${i}`);
            const nextDayRef = ref(db, `weeklyProgress/${userId}/day${i + 1}`);
            const nextDaySnapshot = await get(nextDayRef);
            if (nextDaySnapshot.exists()) {
              await set(currentDayRef, nextDaySnapshot.val());
            }
          }
          // Update day7 value to current score
          const day7Ref = ref(db, `weeklyProgress/${userId}/day7`);
          const userScoreRef = ref(db, `users/${userId}/score`);
          const userScoreSnapshot = await get(userScoreRef);
          if (userScoreSnapshot.exists()) {
            await set(day7Ref, userScoreSnapshot.val());
          }
          // Update last access date
          await set(lastAccessRef, currentDate);
        }
      };

      updateWeeklyProgress();
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

  // --- New code to prepare data for the line chart ---
  const data = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "Weekly Progress",
        data: weeklyProgress,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const score = context.raw;
            return `Score: ${score}`;
          },
        },
      },
    },
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
          <h2>Badges</h2>
          <div className="badges-grid">
            {["100", "1000", "1500", "2000", "2500"].map((badge, index) => (
              <div key={index} className="badge-item">
                <img
                  className={`badge-image ${
                    user.score >= badge ? "" : "greyed-out"
                  }`}
                  src={`./src/assets/badges/gold_medal.png`}
                  alt={`Badge for ${badge} points`}
                />
                <p>{badge} Points</p>
              </div>
            ))}
          </div>
          <div className="badges-grid">
            {["1", "5", "10", "50", "100+"].map((badge, index) => (
              <div key={index} className="badge-item">
                <img
                  className={`badge-image ${
                    user.level >= parseInt(badge) ? "" : "greyed-out"
                  }`}
                  src={`./src/assets/badges/gold_medal.png`}
                  alt={`Badge for Level ${badge}`}
                />
                <p>Level {badge}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h2>Weekly Progress</h2>
          <Line data={data} options={options} />
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
