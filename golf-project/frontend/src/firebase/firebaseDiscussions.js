import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, off, update, get } from 'firebase/database';

// Firebase configuration for the Discussions feature
const firebaseConfigDiscussions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// Initialize Firebase app for the Discussions feature
const appDiscussions = initializeApp(firebaseConfigDiscussions, 'DISCUSSIONS');

// Initialize Realtime Database for the Discussions feature
const dbDiscussions = getDatabase(appDiscussions);

/**
 * Adds a new message to the discussions.
 * @param {string} userId - The ID of the user sending the message.
 * @param {string} userName - The display name of the user.
 * @param {string} message - The content of the message.
 * @returns {Promise<string>} The ID of the newly created message.
 */
export async function addMessage(userId, userName, message) {
  const messagesRef = ref(dbDiscussions, 'messages'); // Reference to the 'messages' node
  const newMessageRef = push(messagesRef); // Push a new child to the 'messages' node
  await update(newMessageRef, {
    userId,
    userName,
    message,
    timestamp: Date.now() // Record timestamp to track when the message was sent
  });
  return newMessageRef.key; // Return the unique key of the new message
}

/**
 * Retrieves messages from the discussions.
 * @param {function} callback - Function to call with the retrieved messages.
 * @returns {function} Function to unsubscribe from the listener.
 */
export function getMessages(callback) {
  const messagesRef = ref(dbDiscussions, 'messages');
  const handleNewMessages = (snapshot) => {
    const data = snapshot.val(); // Retrieve the current data from the snapshot
    if (data) {
      const messageList = Object.entries(data).map(([key, value]) => ({
        id: key,  // Set the message ID
        ...value  // Spread the rest of the message data (userId, userName, message, etc.)
      }));
      callback(messageList); // Pass the message list to the callback
    }
  };
  onValue(messagesRef, handleNewMessages); // Subscribe to real-time updates
  return () => off(messagesRef, 'value', handleNewMessages); // Return a function to unsubscribe
}

/**
 * Adds a new direct message between users.
 * @param {string} conversationKey - The key representing the conversation between two users.
 * @param {string} userId - The ID of the user sending the message.
 * @param {string} userName - The display name of the user.
 * @param {string} message - The content of the message.
 * @returns {Promise<string>} The ID of the newly created message.
 */
export async function addDirectMessage(conversationKey, userId, userName, message) {
  const messagesRef = ref(dbDiscussions, `directMessages/${conversationKey}`); // Reference to the specific conversation
  const newMessageRef = push(messagesRef); // Add a new message in that conversation
  await update(newMessageRef, {
    userId,
    userName,
    message,
    timestamp: Date.now() // Add a timestamp
  });

  // Update the latest message's sender in the conversation to know who sent the most recent message
  await update(ref(dbDiscussions, `directMessages/${conversationKey}`), {
    latestMessageUserId: userId
  });

  return newMessageRef.key; // Return the new message ID
}

/**
 * Retrieves direct messages between users.
 * @param {string} conversationKey - The key representing the conversation between two users.
 * @param {function} callback - Function to call with the retrieved messages.
 * @returns {function} Function to unsubscribe from the listener.
 */
export function getDirectMessages(conversationKey, callback) {
  const messagesRef = ref(dbDiscussions, `directMessages/${conversationKey}`);
  const handleNewMessages = (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const messageList = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value
      }));
      callback(messageList); // Provide the message list to the callback function
    } else {
      callback([]);  // If no messages exist, return an empty list
    }
  };
  onValue(messagesRef, handleNewMessages); // Subscribe to real-time updates
  return () => off(messagesRef, 'value', handleNewMessages);  // Return a function to unsubscribe
}

/**
 * Checks if a direct message conversation exists between two users.
 * @param {string} conversationKey - The key representing the conversation between two users.
 * @returns {Promise<boolean>} - Whether the conversation exists.
 */
export async function checkDMConversation(conversationKey) {
  const messagesRef = ref(dbDiscussions, `directMessages/${conversationKey}`); // Reference to the conversation
  const snapshot = await get(messagesRef); // Retrieve data once
  return snapshot.exists(); // Check if the conversation exists
}

// Export the initialized Firebase app and database for use elsewhere
export { appDiscussions, dbDiscussions };
