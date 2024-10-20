import React, { useState, useEffect, useRef } from 'react';
import { addMessage, getMessages } from '../firebase/firebaseDiscussions';
import './DiscussionPage.css';

const DiscussionPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = getMessages((messageList) => {
        setMessages(messageList);
      });
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(`Error fetching messages: ${err.message}`);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessage]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const formatMessage = (text) => {
    return text.split('```').map((part, index) => {
      if (index % 2 === 0) {
        return <span key={index}>{part}</span>;
      } else {
        return <pre key={index}><code>{part}</code></pre>;
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      const userDisplayName = localStorage.getItem('userDisplayName');
      const userUID = localStorage.getItem('userUID');
      
      if (!userUID) {
        throw new Error("User not authenticated");
      }

      await addMessage(
        userUID,
        userDisplayName || 'Anonymous',
        newMessage
      );
      setNewMessage('');
      setError(null);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(`Failed to send message: ${err.message}`);
    }
  };

  if (error) {
    return <div className="discussion-page__error">{error}</div>;
  }

  return (
    <div className="discussion-page">
      <h1 className="discussion-page__title">Discussion</h1>
      <div className="discussion-page__message-list">
        {messages.map((message) => (
          <div key={message.id} className="discussion-page__message">
            <strong className="discussion-page__message-user">{message.userName}: </strong>
            <span className="discussion-page__message-content">
              {formatMessage(message.message)}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="discussion-page__form">
        <textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="discussion-page__input"
          rows="1"
        />
        <button type="submit" className="discussion-page__button">Send</button>
      </form>
    </div>
  );
};

export default DiscussionPage;