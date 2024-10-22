import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite';
import { dbCodeRunner } from './firebase/firebaseCodeRunner';
import ProblemForm from './components/ProblemForm';
import './EditProblemPage.css';

const EditProblemPage = () => {
  // Extract problemId from URL parameters
  const { problemId } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch problem data when component mounts or problemId changes
  useEffect(() => {
    fetchProblem();
  }, [problemId]);

  // Function to fetch problem data from Firestore
  const fetchProblem = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch problem, test cases, and solution documents
      const problemDoc = await getDoc(doc(dbCodeRunner, 'problems', problemId));
      const testCasesDoc = await getDoc(doc(dbCodeRunner, 'testCases', problemId));
      const solutionDoc = await getDoc(doc(dbCodeRunner, 'codeSolutions', problemId));

      if (problemDoc.exists() && testCasesDoc.exists() && solutionDoc.exists()) {
        // Extract data from documents
        const problemData = problemDoc.data();
        const testCasesData = testCasesDoc.data();
        const solutionData = solutionDoc.data();

        // Set problem state
        setProblem({
          id: problemId,
          ...problemData,
          initialCode: problemData.initialCode[problemData.language] || '',
          solution: solutionData[problemData.language] || ''
        });
        // Set test cases state
        setTestCases(testCasesData.cases || []);
      } else {
        setError('Problem not found');
      }
    } catch (err) {
      console.error("Error fetching problem:", err);
      setError("Failed to load the problem. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle form submission and update problem
  const handleSubmit = async (updatedProblem, updatedTestCases) => {
    try {
      // Prepare updated problem data
      const problemData = {
        ...updatedProblem,
        initialCode: { [updatedProblem.language]: updatedProblem.initialCode },
        updatedAt: new Date().toISOString()
      };

      // Update problem document
      await updateDoc(doc(dbCodeRunner, 'problems', problemId), problemData);

      // Prepare and update test cases document
      const testCasesData = {
        cases: updatedTestCases,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(doc(dbCodeRunner, 'testCases', problemId), testCasesData);

      // Prepare and update solution document
      const solutionData = {
        [updatedProblem.language]: updatedProblem.solution,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(doc(dbCodeRunner, 'codeSolutions', problemId), solutionData);

      alert('Problem updated successfully!');
      navigate('/my-problems');
    } catch (error) {
      console.error("Error updating problem: ", error);
      setError('Error updating problem. Please try again.');
    }
  };

  // Show loading message while fetching data
  if (isLoading) return <div className="loading">Loading problem...</div>;
  // Show error message if there's an error
  if (error) return <div className="error-message">{error}</div>;

  // Render the edit problem form
  return (
    <div className="edit-problem-page">
      <div className="content-container">
        <h1 className="page-title">Edit Problem 📝</h1>
        {problem && (
          <div className="edit-problem-form">
            <h2>Problem Details</h2>
            <ProblemForm
              initialProblem={problem}
              initialTestCases={testCases}
              onSubmit={handleSubmit}
              submitButtonText="Update Problem"
              showIdField={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProblemPage;
