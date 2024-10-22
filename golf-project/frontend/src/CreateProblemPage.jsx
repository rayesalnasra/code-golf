import React, { useState, useEffect } from 'react';
import { setDoc, doc } from 'firebase/firestore/lite';
import { dbCodeRunner } from './firebase/firebaseCodeRunner';
import ProblemForm from './components/ProblemForm';
import './CreateProblemPage.css';

const CreateProblemPage = () => {
  // State to store the user ID
  const [userId, setUserId] = useState(null);

  // Effect to retrieve the user ID from local storage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userUID');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Function to handle form submission
  const handleSubmit = async (problem, testCases) => {
    // Check if user is logged in
    if (!userId) {
      alert("You must be logged in to save a problem.");
      return;
    }

    try {
      // Prepare problem data
      const problemData = {
        ...problem,
        initialCode: { [problem.language]: problem.initialCode },
        createdBy: userId,
        createdAt: new Date().toISOString()
      };

      // Save problem data to Firestore
      await setDoc(doc(dbCodeRunner, 'problems', problem.id), problemData);

      // Prepare and save test cases data
      const testCasesData = {
        problemId: problem.id,
        cases: testCases,
        createdBy: userId,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(dbCodeRunner, 'testCases', problem.id), testCasesData);

      // Prepare and save solution data
      const solutionData = {
        problemId: problem.id,
        [problem.language]: problem.solution,
        createdBy: userId,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(dbCodeRunner, 'codeSolutions', problem.id), solutionData);

      alert('Problem, test cases, and solution created successfully!');
    } catch (error) {
      console.error("Error saving problem: ", error);
      alert('Error saving problem. Please try again.');
    }
  };

  // Initial problem state
  const initialProblem = {
    id: '',
    title: '',
    description: '',
    difficulty: 'easy',
    language: 'javascript',
    initialCode: '',
    solution: ''
  };

  return (
    <div className="create-problem-page">
      <div className="content-container">
        <h1 className="page-title">Create New Problem 🧩</h1>
        {userId ? (
          // Render ProblemForm if user is logged in
          <div className="create-problem-form">
            <h2>Problem Details</h2>
            <ProblemForm
              initialProblem={initialProblem}
              initialTestCases={[]}
              onSubmit={handleSubmit}
              submitButtonText="Create Problem"
              showIdField={true}
            />
          </div>
        ) : (
          // Show error message if user is not logged in
          <p className="error-message">Please log in to create a problem.</p>
        )}
      </div>
    </div>
  );
};

export default CreateProblemPage;
