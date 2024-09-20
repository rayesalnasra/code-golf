import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore/lite";
import { getDatabase } from "firebase/database";

// Access environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getTestCases() {
  const testCasesCol = collection(db, "testCases");
  const testCasesSnapshot = await getDocs(testCasesCol);
  return testCasesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function saveUserCode(problemId, code) {
  const userSubmissionsCol = collection(db, "userSubmissions");
  const docRef = await addDoc(userSubmissionsCol, {
    problemId,
    code,
    timestamp: new Date(),
  });
  return docRef.id;
}

export const database = getDatabase(app);
export default app;
