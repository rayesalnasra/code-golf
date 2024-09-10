import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getTestCases() {
  try {
    const testCasesCol = collection(db, 'testCases');
    const testCasesSnapshot = await getDocs(testCasesCol);
    return testCasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching test cases:", error);
    throw error;
  }
}

export async function saveUserCode(problemId, code) {
  try {
    const userSubmissionsCol = collection(db, 'userSubmissions');
    const docRef = await addDoc(userSubmissionsCol, {
      problemId,
      code,
      timestamp: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving user code:", error);
    throw error;
  }
}

export default app;