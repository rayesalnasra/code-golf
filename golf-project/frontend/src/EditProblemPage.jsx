import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite';
import { dbCodeRunner } from './firebase/firebaseCodeRunner';
import ProblemForm from './components/ProblemForm';
import './EditProblemPage.css';

const EditProblemPage = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblem();
  }, [problemId]);

  const fetchProblem = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const problemDoc = await getDoc(doc(dbCodeRunner, 'problems', problemId));
      const testCasesDoc = await getDoc(doc(dbCodeRunner, 'testCases', problemId));
      const solutionDoc = await getDoc(doc(dbCodeRunner, 'codeSolutions', problemId));

      if (problemDoc.exists() && testCasesDoc.exists() && solutionDoc.exists()) {
        const problemData = problemDoc.data();
        const testCasesData = testCasesDoc.data();
        const solutionData = solutionDoc.data();

        setProblem({
          id: problemId,
          ...problemData,
          initialCode: problemData.initialCode[problemData.language] || '',
          solution: solutionData[problemData.language] || ''
        });
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

  const handleSubmit = async (updatedProblem, updatedTestCases) => {
    try {
      const problemData = {
        ...updatedProblem,
        initialCode: { [updatedProblem.language]: updatedProblem.initialCode },
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(dbCodeRunner, 'problems', problemId), problemData);

      const testCasesData = {
        cases: updatedTestCases,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(doc(dbCodeRunner, 'testCases', problemId), testCasesData);

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

  if (isLoading) return <div>Loading problem...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="edit-problem-page">
      <h1>Edit Problem</h1>
      {problem && (
        <ProblemForm
          initialProblem={problem}
          initialTestCases={testCases}
          onSubmit={handleSubmit}
          submitButtonText="Update Problem"
          showIdField={false}
        />
      )}
    </div>
  );
};

export default EditProblemPage;
