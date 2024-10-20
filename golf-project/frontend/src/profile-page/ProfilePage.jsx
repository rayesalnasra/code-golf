import React, { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { readProfileData, updateData } from "../firebase/databaseUtils";
import { auth } from "../firebase/firebaseAuth";
import { Line } from "react-chartjs-2";
import { getDatabase, ref, get, set } from "firebase/database";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
);

function ProfilePage() {
  const [user, setUser] = useState({
    displayName: "",
    email: "",
    level: 0,
    xp: 0,
    score: 0,
    bio: "",
  });

  const [editableUser, setEditableUser] = useState({
    displayName: "",
    bio: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [pastDMs, setPastDMs] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userUID");
    const storedEmail = localStorage.getItem("userEmail");
    const storedDisplayName = localStorage.getItem("userDisplayName");
    const storedBio = localStorage.getItem("userBio");

    if (userId) {
      const fetchData = async () => {
        try {
          const userData = await readProfileData(`users/${userId}`);
          if (userData) {
            setUser({
              displayName: storedDisplayName || userData.displayName || "Anonymous User",
              email: storedEmail || userData.email || "No email provided",
              level: userData.level || 0,
              xp: userData.xp || 0,
              score: userData.score || 0,
              bio: storedBio || userData.bio || "No bio available",
            });
            setEditableUser({
              displayName: storedDisplayName || userData.displayName || "Anonymous User",
              bio: storedBio || userData.bio || "",
            });
          }

          const directMessages = await readProfileData(`directMessages`);
          const userPastDMs = [];

          for (const conversationKey in directMessages) {
            if (conversationKey.includes(userId)) {
              const otherUserId = conversationKey.split('_').find(id => id !== userId);

              const otherUserData = await readProfileData(`users/${otherUserId}`);
              const displayName = otherUserData?.displayName || "Unknown User";

              const messages = Object.values(directMessages[conversationKey]);

              const latestMessageIndex = messages.length - 1;
              const secondToLatestMessageIndex = messages.length - 2;

              const latestMessage = messages[latestMessageIndex];
              const secondToLatestMessage = messages.length > 1 ? messages[secondToLatestMessageIndex] : latestMessage;

              const messageToDisplay = secondToLatestMessage || latestMessage; 

              const messageTime = new Date(messageToDisplay.timestamp).toLocaleString();

              userPastDMs.push({
                id: otherUserId,
                displayName: displayName,
                latestMessage: messageToDisplay.message,
                latestMessageTime: messageTime,
                isFromUser: messageToDisplay.userId === userId,
              });
            }
          }

          setPastDMs(userPastDMs);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const fetchWeeklyProgress = async () => {
        const db = getDatabase();
        const progressData = [];
        for (let i = 1; i <= 7; i++) {
          const dayRef = ref(db, `weeklyProgress/${userId}/day${i}`);
          const snapshot = await get(dayRef);
          if (snapshot.exists()) {
            progressData.push(snapshot.val());
          } else {
            progressData.push(0);
          }
        }
        setWeeklyProgress(progressData);
      };

      fetchWeeklyProgress();

      const updateWeeklyProgress = async () => {
        const db = getDatabase();
        const currentDate = new Date().toISOString().split("T")[0];
        const lastAccessRef = ref(db, `users/${userId}/lastAccessDate`);
        const lastAccessSnapshot = await get(lastAccessRef);
        const lastAccessDate = lastAccessSnapshot.exists()
          ? lastAccessSnapshot.val()
          : null;

        if (lastAccessDate === currentDate) {
          const day7Ref = ref(db, `weeklyProgress/${userId}/day7`);
          const userScoreRef = ref(db, `users/${userId}/score`);
          const userScoreSnapshot = await get(userScoreRef);
          if (userScoreSnapshot.exists()) {
            await set(day7Ref, userScoreSnapshot.val());
          }
        } else {
          for (let i = 1; i < 7; i++) {
            const currentDayRef = ref(db, `weeklyProgress/${userId}/day${i}`);
            const nextDayRef = ref(db, `weeklyProgress/${userId}/day${i + 1}`);
            const nextDaySnapshot = await get(nextDayRef);
            if (nextDaySnapshot.exists()) {
              await set(currentDayRef, nextDaySnapshot.val());
            }
          }
          const day7Ref = ref(db, `weeklyProgress/${userId}/day7`);
          const userScoreRef = ref(db, `users/${userId}/score`);
          const userScoreSnapshot = await get(userScoreRef);
          if (userScoreSnapshot.exists()) {
            await set(day7Ref, userScoreSnapshot.val());
          }
          await set(lastAccessRef, currentDate);
        }
      };

      fetchData();
      fetchWeeklyProgress();
      updateWeeklyProgress();
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setEditableUser({
      displayName: user.displayName,
      bio: user.bio,
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

        if (editableUser.displayName !== user.displayName) {
          await updateProfile(authUser, {
            displayName: editableUser.displayName,
          });
        }

        await updateData(`users/${userId}`, {
          displayName: editableUser.displayName,
          bio: editableUser.bio,
        });

        localStorage.setItem("userDisplayName", editableUser.displayName);
        localStorage.setItem("userBio", editableUser.bio);

        setUser((prevUser) => ({
          ...prevUser,
          displayName: editableUser.displayName,
          bio: editableUser.bio,
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

  const handleReplyClick = (dmUserId) => {
    navigate(`/direct-message/${dmUserId}`);
  };

  const togglePrivacy = () => {
    setIsPrivate((prevIsPrivate) => !prevIsPrivate);
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
                <p>{isPrivate ? "Private" : user.displayName}</p>
              )}
            </div>
            <div className="info-item">
              <h3>Email</h3>
              <p>{isPrivate ? "Private" : user.email}</p>
            </div>
            <div className="info-item">
              <h3>Bio</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editableUser.bio}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{isPrivate ? "Private" : user.bio}</p>
              )}
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
            <div className="button-group">
              <button className="edit-button" onClick={handleEditClick}>
                Edit
              </button>
              <button className="private-button" onClick={togglePrivacy}>
                {isPrivate ? "Make Public" : "Make Private"}
              </button>
            </div>
          )}
        </section>

        <section className="profile-section">
          <h2>Direct Messages</h2>
          {pastDMs.length > 0 ? (
            <div className="dm-list">
              {pastDMs.map((dmUser, index) => (
                <div 
                  key={`${dmUser.id}-${index}`} 
                  className={`dm-box ${dmUser.isFromUser ? 'user-message' : 'other-user-message'}`}
                >
                  <div className="dm-username">{dmUser.displayName}</div>
                  <div className="dm-latest-message">{dmUser.latestMessage}</div>
                  <div className="dm-time">{dmUser.latestMessageTime}</div>
                  <button className="reply-button" onClick={() => handleReplyClick(dmUser.id)}>
                    Reply
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No past direct messages.</p>
          )}
        </section>

        <section className="profile-section">
          <h2>Statistics</h2>
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
                    user.score >= parseInt(badge) ? "" : "greyed-out"
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
