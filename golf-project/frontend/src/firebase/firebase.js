import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore/lite";
import { getDatabase } from "firebase/database";

// Firebase configuration, accessing environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
const db = getFirestore(app);

/**
 * Fetches test cases from the Firestore database.
 * @returns {Promise<Array>} An array of test case objects.
 */
export async function getTestCases() {
  const testCasesCol = collection(db, "testCases"); // Reference to the testCases collection
  const testCasesSnapshot = await getDocs(testCasesCol); // Retrieve documents from the collection
  return testCasesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Map documents to include their IDs
}

/**
 * Saves user code submission to the Firestore database.
 * @param {string} problemId - The ID of the problem associated with the submission.
 * @param {string} code - The code submitted by the user.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function saveUserCode(problemId, code) {
  const userSubmissionsCol = collection(db, "userSubmissions"); // Reference to the userSubmissions collection
  const docRef = await addDoc(userSubmissionsCol, {
    problemId,
    code,
    timestamp: new Date(), // Store the submission timestamp
  });
  return docRef.id; // Return the document ID of the newly created submission
}

// Initialize Firebase Realtime Database
export const database = getDatabase(app);

// Export the initialized app for further use
export default app;
