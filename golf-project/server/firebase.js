import { initializeApp } from 'firebase/app'; // Initialize Firebase
import { getFirestore, collection, getDocs, query, where, addDoc } from 'firebase/firestore/lite'; // Firestore functions
import dotenv from 'dotenv'; // Load environment variables

dotenv.config(); // Load environment variables from .env file

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to retrieve test cases for a given problem ID
export async function getTestCases(problemId) {
  const testCasesCol = collection(db, 'testCases');
  const q = query(testCasesCol, where("problemId", "==", problemId));
  const testCasesSnapshot = await getDocs(q);
  
  // Map through the fetched documents and process their data
  return testCasesSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Parse inputs and handle potential JSON errors
      inputs: data.inputs.map(input => {
        try {
          return JSON.parse(input);
        } catch {
          return input; // Return the original input if parsing fails
        }
      }),
      // Parse expected output and handle potential JSON errors
      expected_output: (() => {
        try {
          return JSON.parse(data.expected_output);
        } catch {
          return data.expected_output; // Return the original output if parsing fails
        }
      })()
    };
  });
}

// Function to save user code submissions
export async function saveUserCode(problemId, code) {
  const userSubmissionsCol = collection(db, 'userSubmissions');
  const docRef = await addDoc(userSubmissionsCol, {
    problemId,
    code,
    timestamp: new Date() // Store the current timestamp
  });
  return docRef.id; // Return the ID of the newly created document
}

// Export the initialized app and database
export { app, db };
