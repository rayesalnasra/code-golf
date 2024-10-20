import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, off, update, get } from 'firebase/database';

// Firebase configuration for the Discussions feature, accessing environment variables for security
const firebaseConfigDiscussions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL // Make sure this is set in your .env file
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
  const messagesRef = ref(dbDiscussions, 'messages');
  const newMessageRef = push(messagesRef);
  await update(newMessageRef, {
    userId,
    userName,
    message,
    timestamp: Date.now()
  });
  return newMessageRef.key;
}

/**
 * Retrieves messages from the discussions.
 * @param {function} callback - Function to call with the retrieved messages.
 * @returns {function} Function to unsubscribe from the listener.
 */
export function getMessages(callback) {
  const messagesRef = ref(dbDiscussions, 'messages');
  const handleNewMessages = (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const messageList = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value
      }));
      callback(messageList);
    }
  };
  onValue(messagesRef, handleNewMessages);
  return () => off(messagesRef, 'value', handleNewMessages);
}

/**
 * Retrieves a single message by its ID.
 * @param {string} messageId - The ID of the message to retrieve.
 * @returns {Promise<Object|null>} The message object or null if not found.
 */
export async function getMessageById(messageId) {
  const messageRef = ref(dbDiscussions, `messages/${messageId}`);
  const snapshot = await get(messageRef);
  if (snapshot.exists()) {
    return { id: messageId, ...snapshot.val() };
  }
  return null;
}

/**
 * Updates an existing message.
 * @param {string} messageId - The ID of the message to update.
 * @param {Object} updates - An object containing the fields to update.
 * @returns {Promise<void>}
 */
export async function updateMessage(messageId, updates) {
  const messageRef = ref(dbDiscussions, `messages/${messageId}`);
  await update(messageRef, updates);
}

// Export the initialized app and database for use in other parts of the application
export { appDiscussions, dbDiscussions };