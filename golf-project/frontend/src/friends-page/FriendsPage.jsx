import React, { useEffect, useState } from "react";
import './FriendsPage.css'; // Ensure to import your CSS file

function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [newFriend, setNewFriend] = useState("");

  useEffect(() => {
    // Placeholder logic, replace with Firebase fetching logic for friends and requests
    setFriends(["Rayes", "David", "Will", "Billal"]);
    setPendingRequests(["Matthew", "Jane"]); // Sample sent pending requests
    setReceivedInvitations(["Alex", "Sophie"]); // Sample received invitations
  }, []);

  const handleSendInvitation = () => {
    if (newFriend) {
      // Logic to send friend request (Firebase logic would go here)
      setPendingRequests([...pendingRequests, newFriend]);
      setNewFriend(""); // Clear the input after sending the request
    }
  };

  const handleAcceptInvitation = (inviter) => {
    setFriends([...friends, inviter]);
    setReceivedInvitations(receivedInvitations.filter((i) => i !== inviter));
  };

  const handleRejectInvitation = (inviter) => {
    setReceivedInvitations(receivedInvitations.filter((i) => i !== inviter));
  };

  return (
    <div className="friends-page">
      <h1 className="page-title">Friends List 👥</h1>

      <div className="friends-container">
        <div className="friends-section">
          <h2>Friends</h2>
          <ul>
            {friends.map((friend, index) => (
              <li key={index} className="friend-item">
                {friend}
              </li>
            ))}
          </ul>
        </div>

        <div className="friends-section">
          <h2>Pending Friend Requests Sent</h2>
          <ul>
            {pendingRequests.map((request, index) => (
              <li key={index} className="request-item">
                {request}
              </li>
            ))}
          </ul>
        </div>

        <div className="friends-section">
          <h2>Friend Invitations Received</h2>
          <ul>
            {receivedInvitations.map((inviter, index) => (
              <li key={index} className="invitation-item">
                {inviter}
                <div>
                  <button className="accept-button" onClick={() => handleAcceptInvitation(inviter)}>
                    Accept
                  </button>
                  <button className="reject-button" onClick={() => handleRejectInvitation(inviter)}>
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="send-invitation">
        <h2>Send Friend Invitation</h2>
        <input
          type="text"
          value={newFriend}
          onChange={(e) => setNewFriend(e.target.value)}
          placeholder="Enter friend's name"
        />
        <button className="send-invitation-button" onClick={handleSendInvitation}>Send Invitation</button>
      </div>
    </div>
  );
}

export default FriendsPage;
