import React, { useState, useEffect, useRef } from 'react';
import { addDirectMessage, getDirectMessages } from '../firebase/firebaseDiscussions';
import { useParams } from 'react-router-dom';
import './DirectMessagePage.css';

const DirectMessagePage = () => {
  const { userId } = useParams(); // Extract userId from the URL parameters.
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const textareaRef = useRef(null); // Reference to manage the height of the text area dynamically.

  useEffect(() => {
    let unsubscribe;
    try {
      // Generate conversation key by combining the current user's UID with the other user's UID.
      const conversationKey = getConversationKey(localStorage.getItem('userUID'), userId);
      // Subscribe to real-time messages from the conversation.
      unsubscribe = getDirectMessages(conversationKey, (messageList) => {
        setMessages(messageList);
      });
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(`Error fetching messages: ${err.message}`);
    }

    // Clean up: Unsubscribe from messages when the component unmounts.
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return; // Prevent sending empty messages.

    try {
      const userUID = localStorage.getItem('userUID'); // Get current user ID from local storage.
      const userDisplayName = localStorage.getItem('userDisplayName'); // Get current user display name.

      const conversationKey = getConversationKey(userUID, userId); // Generate the conversation key.

      // Add the new message to the conversation.
      await addDirectMessage(
        conversationKey,
        userUID,
        userDisplayName || 'Anonymous',
        newMessage
      );
      setNewMessage(''); // Clear the message input field after sending.
      setError(null);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(`Failed to send message: ${err.message}`);
    }
  };

  // Helper function to generate a consistent key for the conversation between two users.
  const getConversationKey = (user1, user2) => {
    return [user1, user2].sort().join('_');
  };

  return (
    <div className="dm-page">
      <h1 className="dm-page__title">Direct Message</h1>
      <div className="dm-page__message-list">
        {messages.map((message) => (
          // Conditionally apply different classes for messages sent by the user and other users.
          <div 
            key={message.id} 
            className={`dm-page__message ${message.userId === localStorage.getItem('userUID') ? 'dm-page__message--from-user' : 'dm-page__message--from-other'}`}
          >
            <div className="dm-page__message-user">
              <strong>{message.userName}</strong>
            </div>
            <div className="dm-page__message-content">
              {message.message}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="dm-page__form">
        <textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="dm-page__input"
          rows="1"
        />
        <button type="submit" className="dm-page__button">Send</button>
      </form>
      {error && <div className="dm-page__error">{error}</div>}
    </div>
  );
};

export default DirectMessagePage;
