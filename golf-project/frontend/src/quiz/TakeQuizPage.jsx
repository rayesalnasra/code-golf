import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { readData } from '../firebase/databaseUtils'; // Import readData function
import { auth } from '../firebase/firebaseAuth'; // Import auth for user state
import { premadeQuizzes } from './premadeQuizzes';
import './TakeQuizPage.css'; // Import styles

const TakeQuizPage = () => {
  const { quizId } = useParams(); // Get quizId from URL parameters
  const navigate = useNavigate(); // Hook for navigation
  const [quiz, setQuiz] = useState(null); // State for quiz data
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // State for current question index
  const [userAnswers, setUserAnswers] = useState({}); // State for user's answers
  const [quizCompleted, setQuizCompleted] = useState(false); // State to track quiz completion

  
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (premadeQuizzes[quizId]) {
        setQuiz(premadeQuizzes[quizId]);
        setUserAnswers(Object.fromEntries(premadeQuizzes[quizId].questions.map((_, index) => [index, []])));
      } else if (user) {
        readData(`quiz/${user.uid}/${quizId}`, (data) => {
          if (data) {
            setQuiz(data);
            setUserAnswers(Object.fromEntries(data.questions.map((_, index) => [index, []])));
          } else {
            navigate('/quiz');
          }
        });
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [quizId, navigate]);

  // Function to format questions and answers wrapped in triple backticks (```).
  const formatMessage = (text) => {
    return text.split('```').map((part, index) => {
      if (index % 2 === 0) {
        return <span key={index}>{part}</span>;
      } else {
        return <pre key={index} className="code-block"><code>{part}</code></pre>;
      }
    });
  };

  const handleAnswerChange = (answerIndex) => {
    const question = quiz.questions[currentQuestionIndex];
    if (question.questionType === 'multiple-choice' || question.questionType === 'true-false') {
      setUserAnswers({ ...userAnswers, [currentQuestionIndex]: [answerIndex] }); // Set single answer
    } else {
      const currentAnswers = userAnswers[currentQuestionIndex] || [];
      const updatedAnswers = currentAnswers.includes(answerIndex)
        ? currentAnswers.filter(index => index !== answerIndex) // Remove answer if already selected
        : [...currentAnswers, answerIndex]; // Add answer if not selected
      setUserAnswers({ ...userAnswers, [currentQuestionIndex]: updatedAnswers });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Go to next question
    } else {
      setQuizCompleted(true); // Mark quiz as completed
    }
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const correctAnswers = question.correctAnswers;
      // Check if user's answers match the correct answers
      if (JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswers.reduce((acc, curr, i) => curr ? [...acc, i] : acc, []).sort())) {
        score++; // Increment score for correct answer
      }
    });
    return score; // Return total score
  };

  if (!quiz) return <div>Loading...</div>; // Show loading message while fetching quiz

  if (quizCompleted) {
    const score = calculateScore(); // Calculate score when quiz is completed
    return (
      <div className="quiz-completed">
        <h2>Quiz Completed!</h2>
        <p>Your score: {score} out of {quiz.questions.length}</p>
        <button onClick={() => navigate('/quiz')}>Back to Quizzes</button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]; // Get current question

  return (
    <div className="take-quiz-container">
      <h1>{quiz.title}</h1>
      <div className="question-container">
        <h2>Question {currentQuestionIndex + 1} of {quiz.questions.length}</h2>
        <p>{formatMessage(currentQuestion.questionText)}</p> {/* Format question text */}
        <div className="answers-container">
          {currentQuestion.answers.map((answer, index) => (
            <label key={index} className="answer-label">
              <input
                type={currentQuestion.questionType === 'select-all-that-apply' ? 'checkbox' : 'radio'}
                name={`question-${currentQuestionIndex}`}
                checked={userAnswers[currentQuestionIndex]?.includes(index)}
                onChange={() => handleAnswerChange(index)}
              />
              {formatMessage(answer)} {/* Format each answer */}
            </label>
          ))}
        </div>
      </div>
      <button onClick={handleNextQuestion}>
        {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </button>
    </div>
  );
};

export default TakeQuizPage; // Export the component
