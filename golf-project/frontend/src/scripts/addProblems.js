import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';

const firebaseConfig = {

  
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

const problems = [
  {
    id: "add",
    title: "Add Two Numbers",
    description: "Create a function that adds two numbers",
    difficulty: "easy",
    initialCode: {
      python: "def add(a, b):\n    return a + b",
      javascript: "function add(a, b) {\n    return a + b;\n}"
    }
  },
  {
    id: "reverse",
    title: "Reverse String",
    description: "Create a function that reverses a given string",
    difficulty: "easy",
    initialCode: {
      python: "def reverse_string(s):\n    return s[::-1]",
      javascript: "function reverseString(s) {\n    return s.split('').reverse().join('');\n}"
    }
  },
  {
    id: "palindrome",
    title: "Check Palindrome",
    description: "Create a function that checks if a given string is a palindrome.",
    difficulty: "easy",
    initialCode: {
      python: "def is_palindrome(s):\n    # Your code here",
      javascript: "function isPalindrome(s) {\n    // Your code here\n}"
    }
  },
  {
    id: "factorial",
    title: "Calculate Factorial",
    description: "Create a function that calculates the factorial of a given non-negative integer.",
    difficulty: "easy",
    initialCode: {
      python: "def factorial(n):\n    # Your code here",
      javascript: "function factorial(n) {\n    // Your code here\n}"
    }
  },
  {
    id: "fizzbuzz",
    title: "FizzBuzz",
    description: "Create a function that returns 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, 'FizzBuzz' for multiples of both, and the number for other cases.",
    difficulty: "easy",
    initialCode: {
      python: "def fizzbuzz(n):\n    # Your code here",
      javascript: "function fizzbuzz(n) {\n    // Your code here\n}"
    }
  },
  {
    id: "twosum",
    title: "Two Sum",
    description: "Given an array of integers and a target sum, return indices of the two numbers such that they add up to the target.",
    difficulty: "medium",
    initialCode: {
      python: "def two_sum(nums, target):\n    # Your code here",
      javascript: "function twoSum(nums, target) {\n    // Your code here\n}"
    }
  },
  {
    id: "validparentheses",
    title: "Valid Parentheses",
    description: "Create a function that determines if the input string has valid parentheses.",
    difficulty: "medium",
    initialCode: {
      python: "def is_valid_parentheses(s):\n    # Your code here",
      javascript: "function isValidParentheses(s) {\n    // Your code here\n}"
    }
  },
  {
    id: "longestsubstring",
    title: "Longest Substring Without Repeating Characters",
    description: "Find the length of the longest substring without repeating characters.",
    difficulty: "medium",
    initialCode: {
      python: "def length_of_longest_substring(s):\n    # Your code here",
      javascript: "function lengthOfLongestSubstring(s) {\n    // Your code here\n}"
    }
  },
  {
    id: "mergeintervals",
    title: "Merge Intervals",
    description: "Merge all overlapping intervals and return an array of the non-overlapping intervals.",
    difficulty: "medium",
    initialCode: {
      python: "def merge_intervals(intervals):\n    # Your code here",
      javascript: "function mergeIntervals(intervals) {\n    // Your code here\n}"
    }
  },
  {
    id: "groupanagrams",
    title: "Group Anagrams",
    description: "Group anagrams together from an array of strings.",
    difficulty: "medium",
    initialCode: {
      python: "def group_anagrams(strs):\n    # Your code here",
      javascript: "function groupAnagrams(strs) {\n    // Your code here\n}"
    }
  },
  {
    id: "mediansortedarrays",
    title: "Median of Two Sorted Arrays",
    description: "Find the median of two sorted arrays.",
    difficulty: "hard",
    initialCode: {
      python: "def find_median_sorted_arrays(nums1, nums2):\n    # Your code here",
      javascript: "function findMedianSortedArrays(nums1, nums2) {\n    // Your code here\n}"
    }
  },
  {
    id: "regularexpressionmatching",
    title: "Regular Expression Matching",
    description: "Implement regular expression matching with support for '.' and '*'.",
    difficulty: "hard",
    initialCode: {
      python: "def is_match(s, p):\n    # Your code here",
      javascript: "function isMatch(s, p) {\n    // Your code here\n}"
    }
  },
  {
    id: "trapwater",
    title: "Trapping Rain Water",
    description: "Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.",
    difficulty: "hard",
    initialCode: {
      python: "def trap(height):\n    # Your code here",
      javascript: "function trap(height) {\n    // Your code here\n}"
    }
  },
  {
    id: "mergeklargelists",
    title: "Merge k Sorted Lists",
    description: "Merge k sorted linked lists and return it as one sorted list.",
    difficulty: "hard",
    initialCode: {
      python: "def merge_k_lists(lists):\n    # Your code here",
      javascript: "function mergeKLists(lists) {\n    // Your code here\n}"
    }
  },
  {
    id: "longestvalidparentheses",
    title: "Longest Valid Parentheses",
    description: "Given a string containing just '(' and ')', find the length of the longest valid parentheses substring.",
    difficulty: "hard",
    initialCode: {
      python: "def longest_valid_parentheses(s):\n    # Your code here",
      javascript: "function longestValidParentheses(s) {\n    // Your code here\n}"
    }
  }
];

async function addProblems() {
  const batch = writeBatch(db);
  const problemsCollection = collection(db, 'problems');

  problems.forEach((problem) => {
    const docRef = doc(problemsCollection, problem.id);
    batch.set(docRef, problem);
  });

  await batch.commit();
  console.log("Problems added to Firestore");
}

addProblems().then(() => {
  console.log('All problems added.');
}).catch((error) => {
  console.error('Error adding problems:', error);
});
