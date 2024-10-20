import React, { useState, useEffect } from 'react';
import { setDoc, doc } from 'firebase/firestore/lite';
import { dbCodeRunner } from './firebase/firebaseCodeRunner';
import ProblemForm from './components/ProblemForm';
import './CreateProblemPage.css';

const CreateProblemPage = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userUID');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSubmit = async (problem, testCases) => {
    if (!userId) {
      alert("You must be logged in to save a problem.");
      return;
    }

    try {
      const problemData = {
        ...problem,
        initialCode: { [problem.language]: problem.initialCode },
        createdBy: userId,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(dbCodeRunner, 'problems', problem.id), problemData);

      const testCasesData = {
        problemId: problem.id,
        cases: testCases,
        createdBy: userId,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(dbCodeRunner, 'testCases', problem.id), testCasesData);

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
          <p className="error-message">Please log in to create a problem.</p>
        )}
      </div>
    </div>
  );
};

export default CreateProblemPage;
