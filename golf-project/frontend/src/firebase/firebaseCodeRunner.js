import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, query, where, doc, getDoc, setDoc } from 'firebase/firestore/lite';

// Firebase configuration for the Code Runner application, accessing environment variables for security
const firebaseConfigCodeRunner = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase app for the Code Runner
const appCodeRunner = initializeApp(firebaseConfigCodeRunner, 'CODE_RUNNER');

// Initialize Firestore database for the Code Runner
const dbCodeRunner = getFirestore(appCodeRunner);

/**
 * Fetches test cases for a given problem ID from the Firestore database.
 * @param {string} problemId - The ID of the problem to fetch test cases for.
 * @returns {Promise<Array>} An array of test case objects with parsed inputs and expected outputs.
 */
export async function getTestCases(problemId) {
  const testCasesCol = collection(dbCodeRunner, 'testCases'); // Reference to the testCases collection
  const q = query(testCasesCol, where("problemId", "==", problemId)); // Query to filter by problem ID
  const testCasesSnapshot = await getDocs(q); // Fetch the filtered documents

  // Map through the documents to format and parse inputs and expected outputs
  return testCasesSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      inputs: data.inputs.map(input => {
        try {
          return JSON.parse(input); // Parse input if it's a JSON string
        } catch {
          return input; // Return input as is if parsing fails
        }
      }),
      expected_output: (() => {
        try {
          return JSON.parse(data.expected_output); // Parse expected output if it's a JSON string
        } catch {
          return data.expected_output; // Return expected output as is if parsing fails
        }
      })()
    };
  });
}

/**
 * Saves user code submission to the Firestore database.
 * @param {string} userId - The ID of the user submitting the code.
 * @param {string} problemId - The ID of the problem being solved.
 * @param {string} language - The programming language used for the submission.
 * @param {string} code - The actual code submitted by the user.
 * @returns {Promise<string>} The ID of the newly created or updated document.
 */
export async function saveUserCode(userId, problemId, language, code) {
  const userSubmissionsCol = collection(dbCodeRunner, 'userSubmissions'); // Reference to the userSubmissions collection
  const languageId = language === 'python' ? 'py' : 'js'; // Determine language ID based on input
  const docRef = doc(userSubmissionsCol, `${userId}_${problemId}_${languageId}`); // Reference to the specific submission document

  // Save or merge the user's submission in the database
  await setDoc(docRef, {
    userId,
    problemId,
    language,
    languageId,
    code,
    timestamp: new Date() // Store the submission timestamp
  }, { merge: true });
  
  return docRef.id; // Return the document ID of the submission
}

/**
 * Retrieves a user's code submission for a specific problem and language.
 * @param {string} userId - The ID of the user whose submission is being retrieved.
 * @param {string} problemId - The ID of the problem associated with the submission.
 * @param {string} language - The programming language of the submission.
 * @returns {Promise<string|null>} The submitted code or null if no submission exists.
 */
export async function getUserSubmission(userId, problemId, language) {
  const userSubmissionsCol = collection(dbCodeRunner, 'userSubmissions'); // Reference to the userSubmissions collection
  const languageId = language === 'python' ? 'py' : 'js'; // Determine language ID based on input
  const docRef = doc(userSubmissionsCol, `${userId}_${problemId}_${languageId}`); // Reference to the specific submission document
  const docSnap = await getDoc(docRef); // Fetch the document

  if (docSnap.exists()) {
    return docSnap.data().code; // Return the submitted code if it exists
  } else {
    return null; // Return null if no submission is found
  }
}

/**
 * Fetches all solutions submitted by a user.
 * @param {string} userId - The ID of the user whose solutions are being retrieved.
 * @returns {Promise<Array>} An array of the user's submissions grouped by problem ID.
 */
export async function getUserSolutions(userId) {
  const userSubmissionsCol = collection(dbCodeRunner, 'userSubmissions'); // Reference to the userSubmissions collection
  const q = query(userSubmissionsCol, where("userId", "==", userId)); // Query to filter submissions by user ID
  const querySnapshot = await getDocs(q); // Fetch the filtered documents
  
  const solutions = {};
  querySnapshot.docs.forEach(doc => {
    const data = doc.data();
    // Group submissions by problem ID and organize languages used
    if (!solutions[data.problemId]) {
      solutions[data.problemId] = {
        problemId: data.problemId,
        languages: {}
      };
    }
    solutions[data.problemId].languages[data.language] = {
      code: data.code,
      timestamp: data.timestamp // Store the submission timestamp
    };
  });
  
  return Object.values(solutions); // Return an array of grouped solutions
}

/**
 * Adds multiple test cases for a specific problem.
 * @param {string} problemId - The ID of the problem to add test cases for.
 * @param {Array} testCases - An array of test case objects to add.
 */
export async function addTestCases(problemId, testCases) {
  const testCasesCol = collection(dbCodeRunner, 'testCases'); // Reference to the testCases collection
  const batch = dbCodeRunner.batch(); // Create a batch for batch operations

  testCases.forEach((testCase) => {
    const newTestCaseRef = doc(testCasesCol); // Reference for the new test case document
    const flattenedInputs = testCase.inputs.map(input => 
      Array.isArray(input) ? JSON.stringify(input) : input // Flatten inputs for storage
    );
    const flattenedExpectedOutput = Array.isArray(testCase.expected_output) 
      ? JSON.stringify(testCase.expected_output) // Flatten expected output for storage
      : testCase.expected_output;

    // Set the new test case in the batch
    batch.set(newTestCaseRef, {
      problemId,
      inputs: flattenedInputs,
      expected_output: flattenedExpectedOutput
    });
  });

  await batch.commit(); // Commit the batch write operation
}

/**
 * Retrieves the solution for a specific problem in a given programming language.
 * @param {string} problemId - The ID of the problem to retrieve the solution for.
 * @param {string} language - The programming language of the solution.
 * @returns {Promise<string>} The solution code or a message indicating no solution is available.
 */
export async function getSolution(problemId, language) {
  const solutionsCol = collection(dbCodeRunner, 'codeSolutions'); // Reference to the codeSolutions collection
  const docRef = doc(solutionsCol, problemId); // Reference to the specific problem document
  const docSnap = await getDoc(docRef); // Fetch the document

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data[language] || "No solution available for this language."; // Return solution or message
  } else {
    return "No solution available for this problem."; // Message if problem document does not exist
  }
}

/**
 * Saves Code Golf submission to the Firestore database.
 * @param {string} userId - The ID of the user submitting the code.
 * @param {string} problemId - The ID of the problem being solved.
 * @param {string} language - The programming language used for the submission.
 * @param {string} code - The actual code submitted by the user.
 * @param {number} characterCount - The character count of the submitted code.
 * @param {number} attempts - The number of attempts made by the user.
 * @param {number} score - The score achieved by the user.
 * @param {number} timer - The timer value for the submission.
 * @returns {Promise<string>} The ID of the newly created or updated document.
 */
export async function saveCodeGolfSubmission(userId, problemId, language, code, characterCount, attempts, score, timer) {
  console.log('Saving Code Golf submission:', { userId, problemId, language, code, characterCount, attempts, score, timer });
  const userCodeGolfCol = collection(dbCodeRunner, 'userCodeGolf');
  const languageId = language === 'python' ? 'py' : 'js';
  const docRef = doc(userCodeGolfCol, `${userId}_${problemId}_${languageId}`);
  await setDoc(docRef, {
    userId,
    problemId,
    language,
    languageId,
    code,
    characterCount,
    attempts,
    score,
    timer,
    timestamp: new Date()
  }, { merge: true });
  console.log('Code Golf submission saved successfully');
  return docRef.id;
}

/**
 * Retrieves a user's Code Golf submission for a specific problem and language.
 * @param {string} userId - The ID of the user whose submission is being retrieved.
 * @param {string} problemId - The ID of the problem associated with the submission.
 * @param {string} language - The programming language of the submission.
 * @returns {Promise<string|null>} The submitted code or null if no submission exists.
 */
export async function getUserCodeGolfSubmission(userId, problemId, language) {
  const userCodeGolfCol = collection(dbCodeRunner, 'userCodeGolf');
  const languageId = language === 'python' ? 'py' : 'js';
  const docRef = doc(userCodeGolfCol, `${userId}_${problemId}_${languageId}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

// Export the initialized app and database for use in other parts of the application
export { appCodeRunner, dbCodeRunner };
