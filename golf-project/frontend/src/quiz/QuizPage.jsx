import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { readData, removeData } from '../firebase/databaseUtils';
import { auth } from '../firebase/firebaseAuth';
import { premadeQuizzesList } from './premadeQuizzes';
import './QuizPage.css';

function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = () => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          readData(`quiz/${user.uid}`, (data) => {
            if (data) {
              const userQuizzes = Object.entries(data).map(([id, quiz]) => ({
                id,
                ...quiz,
                isPremade: false,
              }));
              setQuizzes([...premadeQuizzesList, ...userQuizzes]);
            } else {
              setQuizzes([...premadeQuizzesList]);
            }
            setLoading(false);
          });
        } else {
          setQuizzes([...premadeQuizzesList]);
          setLoading(false);
        }
      });

      return unsubscribe;
    };

    const unsubscribe = fetchQuizzes();
    return () => unsubscribe();
  }, []);

  const handleDeleteQuiz = async (quizId) => {
    try {
      await removeData(`quiz/${auth.currentUser.uid}/${quizId}`);
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quiz-page-container">
      <h1 className="quiz-page-title">Available Quizzes</h1>

      {quizzes.length === 0 ? (
        <p>No quizzes available.</p>
      ) : (
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <h2 className="quiz-title">{quiz.title}</h2>
              <p>Created at: {new Date(quiz.createdAt).toLocaleString()}</p>
              <div className="quiz-card-buttons">
                <Link to={`/take-quiz/${quiz.id}`} className="start-quiz-btn">
                  Start Quiz
                </Link>
                {!quiz.isPremade && auth.currentUser && (
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="delete-quiz-btn"
                  >
                    Delete Quiz
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {auth.currentUser && (
        <>
          <h2 className="create-quiz-title">Create Your Own Quiz</h2>
          <Link to="/create-quiz" className="create-quiz-btn">
            Go to Quiz Creation Page
          </Link>
        </>
      )}
    </div>
  );
}

export default QuizPage;