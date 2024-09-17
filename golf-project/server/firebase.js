import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore/lite';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getTestCases(problemId) {
  const testCasesCol = collection(db, 'testCases');
  const q = query(testCasesCol, where("problemId", "==", problemId));
  const testCasesSnapshot = await getDocs(q);
  return testCasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function saveUserCode(problemId, code) {
  const userSubmissionsCol = collection(db, 'userSubmissions');
  const docRef = await addDoc(userSubmissionsCol, {
    problemId,
    code,
    timestamp: new Date()
  });
  return docRef.id;
}

export { app, db };