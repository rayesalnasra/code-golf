import React, { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { readData, updateData } from "../firebase/databaseUtils";
import { auth } from "../firebase/firebaseAuth";
import { useNavigate } from "react-router-dom";
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
  const [pastDMs, setPastDMs] = useState([]); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const userId = localStorage.getItem("userUID");
    const storedEmail = localStorage.getItem("userEmail");
    const storedDisplayName = localStorage.getItem("userDisplayName");

    if (userId) {
      const fetchData = async () => {
        try {
          const userData = await readData(`users/${userId}`);
          if (userData) {
            setUser({
              displayName: storedDisplayName || userData.displayName || "Anonymous User",
              email: storedEmail || userData.email || "No email provided",
              level: userData.level || 0,
              xp: userData.xp || 0,
              score: userData.score || 0,
            });
            setEditableUser({
              displayName: storedDisplayName || userData.displayName || "Anonymous User",
            });
          }

          const directMessages = await readData(`directMessages`);
          const userPastDMs = [];

          for (const conversationKey in directMessages) {
            if (conversationKey.includes(userId)) {
              const otherUserId = conversationKey.split('_').find(id => id !== userId);

              const otherUserData = await readData(`users/${otherUserId}`);
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
                isFromUser: messageToDisplay.userId === userId, // Mark if the message is from the user
              });
            }
          }

          setPastDMs(userPastDMs);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
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

        if (editableUser.displayName !== user.displayName) {
          await updateProfile(authUser, {
            displayName: editableUser.displayName,
          });
        }

        await updateData(`users/${userId}`, {
          displayName: editableUser.displayName,
        });

        localStorage.setItem("userDisplayName", editableUser.displayName);

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

  const handleReplyClick = (dmUserId) => {
    navigate(`/direct-message/${dmUserId}`);
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
              <p>{user.email}</p>
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
      </div>
    </div>
  );
}

export default ProfilePage;
