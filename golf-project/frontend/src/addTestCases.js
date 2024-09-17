import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';

const firebaseConfig = {

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

const newProblems = {
  palindrome: [
    { inputs: ["racecar"], expected_output: true },
    { inputs: ["hello"], expected_output: false },
    { inputs: ["A man a plan a canal Panama"], expected_output: true }
  ],
  factorial: [
    { inputs: [5], expected_output: 120 },
    { inputs: [0], expected_output: 1 },
    { inputs: [10], expected_output: 3628800 }
  ],
  fizzbuzz: [
    { inputs: [15], expected_output: "FizzBuzz" },
    { inputs: [3], expected_output: "Fizz" },
    { inputs: [5], expected_output: "Buzz" },
    { inputs: [7], expected_output: "7" }
  ],
  twosum: [
    { inputs: [[2, 7, 11, 15], 9], expected_output: [0, 1] },
    { inputs: [[3, 2, 4], 6], expected_output: [1, 2] },
    { inputs: [[3, 3], 6], expected_output: [0, 1] }
  ],
  validparentheses: [
    { inputs: ["()"], expected_output: true },
    { inputs: ["()[]{}"], expected_output: true },
    { inputs: ["(]"], expected_output: false }
  ],
  longestsubstring: [
    { inputs: ["abcabcbb"], expected_output: 3 },
    { inputs: ["bbbbb"], expected_output: 1 },
    { inputs: ["pwwkew"], expected_output: 3 }
  ],
  mergeintervals: [
    { inputs: [[[1,3],[2,6],[8,10],[15,18]]], expected_output: [[1,6],[8,10],[15,18]] },
    { inputs: [[[1,4],[4,5]]], expected_output: [[1,5]] },
    { inputs: [[[1,4],[0,4]]], expected_output: [[0,4]] }
  ],
  groupanagrams: [
    { inputs: [["eat","tea","tan","ate","nat","bat"]], expected_output: [["ate","eat","tea"],["nat","tan"],["bat"]] },
    { inputs: [[""]], expected_output: [[""]] },
    { inputs: [["a"]], expected_output: [["a"]] }
  ],
  mediansortedarrays: [
    { inputs: [[1,3], [2]], expected_output: 2.0 },
    { inputs: [[1,2], [3,4]], expected_output: 2.5 },
    { inputs: [[0,0], [0,0]], expected_output: 0.0 }
  ],
  regularexpressionmatching: [
    { inputs: ["aa", "a"], expected_output: false },
    { inputs: ["aa", "a*"], expected_output: true },
    { inputs: ["ab", ".*"], expected_output: true }
  ],
  trapwater: [
    { inputs: [[0,1,0,2,1,0,1,3,2,1,2,1]], expected_output: 6 },
    { inputs: [[4,2,0,3,2,5]], expected_output: 9 },
    { inputs: [[1,2,3,4,5]], expected_output: 0 }
  ],
  mergeklargelists: [
    { inputs: [[[1,4,5],[1,3,4],[2,6]]], expected_output: [1,1,2,3,4,4,5,6] },
    { inputs: [[]], expected_output: [] },
    { inputs: [[[]]], expected_output: [] }
  ],
  longestvalidparentheses: [
    { inputs: ["(()"], expected_output: 2 },
    { inputs: [")()())"], expected_output: 4 },
    { inputs: [""], expected_output: 0 }
  ]
};

async function addTestCases(problemId, testCases) {
    const batch = writeBatch(db);
    const testCasesCol = collection(db, 'testCases');
  
    testCases.forEach((testCase) => {
      const newTestCaseRef = doc(testCasesCol);
      batch.set(newTestCaseRef, {
        problemId,
        inputs: testCase.inputs,
        expected_output: testCase.expected_output
      });
    });
  
    await batch.commit();
  }
  
  async function addAllTestCases() {
    for (const [problemId, testCases] of Object.entries(newProblems)) {
      try {
        await addTestCases(problemId, testCases);
        console.log(`Test cases added successfully for problem: ${problemId}`);
      } catch (error) {
        console.error(`Error adding test cases for problem ${problemId}:`, error);
      }
    }
  }
  
  addAllTestCases().then(() => {
    console.log('All test cases added.');
  });
