import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration for authentication, accessing environment variables for security
const firebaseConfigAuth = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app specifically for authentication
const appAuth = initializeApp(firebaseConfigAuth, 'AUTH');

// Get the Firebase Authentication instance
const auth = getAuth(appAuth);


// Export the initialized authentication app and auth instance for use in other parts of the application
export { appAuth, auth };

