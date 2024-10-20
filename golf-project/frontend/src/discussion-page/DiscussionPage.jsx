import React, { useState, useEffect, useRef } from 'react';
<<<<<<< Updated upstream
import { addMessage, getMessages, checkDMConversation } from '../firebase/firebaseDiscussions';
import { useNavigate } from 'react-router-dom';
import './DiscussionPage.css';

const DiscussionPage = () => {
  const [messages, setMessages] = useState([]); // State to track messages
  const [newMessage, setNewMessage] = useState(''); // State for new message input
  const [error, setError] = useState(null); // Error handling state
  const [pastDMs, setPastDMs] = useState({}); // State to track past direct messages
  const textareaRef = useRef(null); // Reference for the textarea for auto-height adjustment
  const navigate = useNavigate(); // React Router hook for navigation
  const userUID = localStorage.getItem('userUID'); // Fetch the user's UID from local storage
=======
import { addMessage, getMessages } from '../firebase/firebaseDiscussions';
import './DiscussionPage.css';

const DiscussionPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);
>>>>>>> Stashed changes

  useEffect(() => {
    let unsubscribe;
    try {
<<<<<<< Updated upstream
      // Subscribe to messages and fetch them from Firebase
      unsubscribe = getMessages(async (messageList) => {
        setMessages(messageList);

        // Process the list of messages to identify existing direct message conversations
        const existingDMs = await Promise.all(
          messageList.map(async (message) => {
            if (message.userId !== userUID) { // Check if the message is not from the current user
              const conversationKey = [userUID, message.userId].sort().join('_'); // Create a conversation key
              const conversationExists = await checkDMConversation(conversationKey); // Check if conversation exists
              return conversationExists ? { userId: message.userId } : null;
            }
            return null;
          })
        );
        
        // Create a map of user IDs with active direct message conversations
        const dmMap = existingDMs.reduce((acc, dm) => {
          if (dm) acc[dm.userId] = dm;
          return acc;
        }, {});

        setPastDMs(dmMap); // Update the state with past DMs
      });
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(`Error fetching messages: ${err.message}`); // Set error message if fetching fails
    }

    // Clean up the subscription on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userUID]); // Dependency array: this effect runs when userUID changes

  useEffect(() => {
    adjustTextareaHeight(); // Adjust textarea height when the new message changes
=======
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
>>>>>>> Stashed changes
  }, [newMessage]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
<<<<<<< Updated upstream
      textarea.style.height = 'auto'; // Reset height to auto
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to the scroll height of the content
=======
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
>>>>>>> Stashed changes
    }
  };

  const formatMessage = (text) => {
<<<<<<< Updated upstream
    // Split message by '```' to format code blocks
    return text.split('```').map((part, index) => {
      if (index % 2 === 0) {
        return <span key={index}>{part}</span>; // Normal text
      } else {
        return <pre key={index}><code>{part}</code></pre>; // Code block
=======
    return text.split('```').map((part, index) => {
      if (index % 2 === 0) {
        return <span key={index}>{part}</span>;
      } else {
        return <pre key={index}><code>{part}</code></pre>;
>>>>>>> Stashed changes
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< Updated upstream
    
    const trimmedMessage = newMessage.trim(); // Remove any extra spaces from the message
    if (trimmedMessage === '') return; // Prevent sending empty messages

    try {
      const userDisplayName = localStorage.getItem('userDisplayName'); // Get the user's display name

      if (!userUID) {
        throw new Error("User not authenticated"); // Throw an error if the user is not authenticated
      }

      // Add the message to the database
      await addMessage(
        userUID,
        userDisplayName || 'Anonymous', // Use 'Anonymous' if no display name is available
        trimmedMessage
      );
      setNewMessage(''); // Clear the message input after sending
      setError(null); // Clear any existing error
    } catch (err) {
      console.error("Error sending message:", err);
      setError(`Failed to send message: ${err.message}`); // Set error if sending fails
    }
  };

  const handleReplyStatus = (userId) => {
    return pastDMs[userId] ? 'Reply' : 'Start DM'; // Show 'Reply' if a DM exists, otherwise 'Start DM'
  };

  const getButtonColor = (userId) => {
    return pastDMs[userId] ? 'blue' : 'green'; // Blue for existing DMs, green for new DMs
  };

  if (error) {
    return <div className="discussion-page__error">{error}</div>; // Display any errors
=======
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
>>>>>>> Stashed changes
  }

  return (
    <div className="discussion-page">
      <h1 className="discussion-page__title">Discussion</h1>
      <div className="discussion-page__message-list">
        {messages.map((message) => (
          <div key={message.id} className="discussion-page__message">
<<<<<<< Updated upstream
            <div className="discussion-page__header">
              <strong className="discussion-page__message-user">{message.userName}</strong> {/* Show the username */}
              {message.userId !== userUID && ( // Only show the DM button for other users' messages
                <button 
                  className="dm-button" 
                  onClick={() => navigate(`/direct-message/${message.userId}`)} // Navigate to the DM page
                  style={{
                    backgroundColor: getButtonColor(message.userId), // Set the button color
                    marginLeft: 'auto', // Move the button to the right
                  }}
                >
                  {handleReplyStatus(message.userId)} {/* Display either 'Reply' or 'Start DM' */}
                </button>
              )}
            </div>
            <span className="discussion-page__message-content">
              {formatMessage(message.message)} {/* Format the message content, including code blocks */}
=======
            <strong className="discussion-page__message-user">{message.userName}: </strong>
            <span className="discussion-page__message-content">
              {formatMessage(message.message)}
>>>>>>> Stashed changes
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="discussion-page__form">
        <textarea
<<<<<<< Updated upstream
          ref={textareaRef} // Reference to the textarea for height adjustment
          value={newMessage} // Controlled input for the new message
          onChange={(e) => setNewMessage(e.target.value)} // Update message on change
          placeholder="Type your message..." // Placeholder text
          className="discussion-page__input"
          rows="1"
        />
        <button type="submit" className="discussion-page__button">Send</button> {/* Send button */}
=======
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="discussion-page__input"
          rows="1"
        />
        <button type="submit" className="discussion-page__button">Send</button>
>>>>>>> Stashed changes
      </form>
    </div>
  );
};

<<<<<<< Updated upstream
export default DiscussionPage;
=======
export default DiscussionPage;
>>>>>>> Stashed changes
