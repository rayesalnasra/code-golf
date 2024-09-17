import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, query, where, doc, getDoc, setDoc } from 'firebase/firestore/lite';

const firebaseConfigCodeRunner = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const appCodeRunner = initializeApp(firebaseConfigCodeRunner, 'CODE_RUNNER');
const dbCodeRunner = getFirestore(appCodeRunner);

export async function getTestCases(problemId) {
  const testCasesCol = collection(dbCodeRunner, 'testCases');
  const q = query(testCasesCol, where("problemId", "==", problemId));
  const testCasesSnapshot = await getDocs(q);
  return testCasesSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      inputs: data.inputs.map(input => {
        try {
          return JSON.parse(input);
        } catch {
          return input;
        }
      }),
      expected_output: (() => {
        try {
          return JSON.parse(data.expected_output);
        } catch {
          return data.expected_output;
        }
      })()
    };
  });
}

export async function saveUserCode(userId, problemId, code) {
  const userSubmissionsCol = collection(dbCodeRunner, 'userSubmissions');
  const docRef = doc(userSubmissionsCol, `${userId}_${problemId}`);
  await setDoc(docRef, {
    userId,
    problemId,
    code,
    timestamp: new Date()
  }, { merge: true });
  return docRef.id;
}

export async function getUserSubmission(userId, problemId) {
  const userSubmissionsCol = collection(dbCodeRunner, 'userSubmissions');
  const docRef = doc(userSubmissionsCol, `${userId}_${problemId}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().code;
  } else {
    return null;
  }
}

export async function addTestCases(problemId, testCases) {
  const testCasesCol = collection(dbCodeRunner, 'testCases');
  const batch = dbCodeRunner.batch();

  testCases.forEach((testCase) => {
    const newTestCaseRef = doc(testCasesCol);
    const flattenedInputs = testCase.inputs.map(input => 
      Array.isArray(input) ? JSON.stringify(input) : input
    );
    const flattenedExpectedOutput = Array.isArray(testCase.expected_output) 
      ? JSON.stringify(testCase.expected_output) 
      : testCase.expected_output;

    batch.set(newTestCaseRef, {
      problemId,
      inputs: flattenedInputs,
      expected_output: flattenedExpectedOutput
    });
  });

  await batch.commit();
}

export { appCodeRunner, dbCodeRunner };