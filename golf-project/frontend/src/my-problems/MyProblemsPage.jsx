import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore/lite';
import { dbCodeRunner } from '../firebase/firebaseCodeRunner';
import './MyProblemsPage.css';

function MyProblemsPage() {
  // State to store the user's problems
  const [problems, setProblems] = useState([]);
  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);
  // State to store any error messages
  const [error, setError] = useState(null);

  // Fetch user problems when the component mounts
  useEffect(() => {
    fetchUserProblems();
  }, []);

  // Function to fetch user problems from Firestore
  const fetchUserProblems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get user ID from local storage
      const userId = localStorage.getItem('userUID');
      // Reference to the problems collection
      const problemsCollection = collection(dbCodeRunner, 'problems');
      // Create a query to fetch problems created by the user
      const q = query(problemsCollection, where('createdBy', '==', userId));
      // Execute the query
      const querySnapshot = await getDocs(q);
      // Map the query results to an array of problem objects
      const userProblems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Update the state with the fetched problems
      setProblems(userProblems);
    } catch (err) {
      console.error("Error fetching user problems:", err);
      setError("Failed to load your problems. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle problem deletion
  const handleDelete = async (problemId) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        // Delete the problem document from Firestore
        await deleteDoc(doc(dbCodeRunner, 'problems', problemId));
        // Update the local state to remove the deleted problem
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
        // Show loading message while fetching problems
        <div className="loading">Loading your problems...</div>
      ) : error ? (
        // Show error message if there was an error fetching problems
        <div className="error-message">{error}</div>
      ) : (
        <>
          {problems.length === 0 ? (
            // Show message if user hasn't created any problems
            <p>You haven't created any problems yet.</p>
          ) : (
            // Render list of user's problems
            <ul className="problem-list">
              {problems.map(problem => (
                <li key={problem.id} className="problem-item">
                  <span className="problem-title">{problem.title}</span>
                  <div className="problem-actions">
                    {/* Link to edit the problem */}
                    <Link to={`/edit-problem/${problem.id}`} className="edit-button">Edit</Link>
                    {/* Button to delete the problem */}
                    <button onClick={() => handleDelete(problem.id)} className="delete-button">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {/* Link to create a new problem */}
          <Link to="/create-problem" className="create-problem-button">Create New Problem</Link>
        </>
      )}
    </div>
  );
}

export default MyProblemsPage;
