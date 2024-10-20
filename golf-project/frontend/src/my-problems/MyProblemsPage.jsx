import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore/lite';
import { dbCodeRunner } from '../firebase/firebaseCodeRunner';
import './MyProblemsPage.css';

function MyProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProblems();
  }, []);

  const fetchUserProblems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem('userUID');
      const problemsCollection = collection(dbCodeRunner, 'problems');
      const q = query(problemsCollection, where('createdBy', '==', userId));
      const querySnapshot = await getDocs(q);
      const userProblems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProblems(userProblems);
    } catch (err) {
      console.error("Error fetching user problems:", err);
      setError("Failed to load your problems. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (problemId) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        await deleteDoc(doc(dbCodeRunner, 'problems', problemId));
        setProblems(problems.filter(problem => problem.id !== problemId));
      } catch (err) {
        console.error("Error deleting problem:", err);
        setError("Failed to delete the problem. Please try again.");
      }
    }
  };

  return (
    <div className="my-problems-page">
      <h1>My Problems</h1>
      {isLoading ? (
        <div className="loading">Loading your problems...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          {problems.length === 0 ? (
            <p>You haven't created any problems yet.</p>
          ) : (
            <ul className="problem-list">
              {problems.map(problem => (
                <li key={problem.id} className="problem-item">
                  <span className="problem-title">{problem.title}</span>
                  <div className="problem-actions">
                    <Link to={`/edit-problem/${problem.id}`} className="edit-button">Edit</Link>
                    <button onClick={() => handleDelete(problem.id)} className="delete-button">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link to="/create-problem" className="create-problem-button">Create New Problem</Link>
        </>
      )}
    </div>
  );
}

export default MyProblemsPage;
