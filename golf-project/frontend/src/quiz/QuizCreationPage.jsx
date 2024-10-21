import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pushData } from '../firebase/databaseUtils';
import { auth } from '../firebase/firebaseAuth';  
import './QuizCreationPage.css';

const formatMessage = (text) => {
  return text.split('```').map((part, index) => {
    if (index % 2 === 0) {
      return <span key={index}>{part}</span>;
    } else {
      return <pre key={index} className="code-block"><code>{part}</code></pre>;
    }
  });
};

const QuizCreationPage = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionType: 'multiple-choice', questionText: '', answers: ['', ''], correctAnswers: [false, false] }
  ]);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([...questions, { questionType: 'multiple-choice', questionText: '', answers: ['', ''], correctAnswers: [false, false] }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, key, value) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i === index) {
        if (key === 'questionType') {
          let newAnswers = value === 'true-false' ? ['True', 'False'] : ['', ''];
          return { ...q, [key]: value, answers: newAnswers, correctAnswers: [false, false] };
        }
        return { ...q, [key]: value };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleAddAnswer = (index) => {
    setQuestions((prevQuestions) => {
      const question = prevQuestions[index];
      const maxAnswers = question.questionType === 'true-false' ? 2 : 5;
      if (question.answers.length >= maxAnswers) return prevQuestions;

      const updatedAnswers = [...question.answers, ''];
      const updatedCorrectAnswers = [...(question.correctAnswers || []), false];
      return prevQuestions.map((q, i) => i === index ? { ...q, answers: updatedAnswers, correctAnswers: updatedCorrectAnswers } : q);
    });
  };

  const handleRemoveAnswer = (index) => {
    setQuestions((prevQuestions) => {
      const question = prevQuestions[index];
      if (question.answers.length <= 2) return prevQuestions;

      const updatedAnswers = question.answers.slice(0, -1);
      const updatedCorrectAnswers = question.correctAnswers.slice(0, -1);
      return prevQuestions.map((q, i) => i === index ? { ...q, answers: updatedAnswers, correctAnswers: updatedCorrectAnswers } : q);
    });
  };

  const handleCorrectAnswerChange = (index, answerIndex) => {
    const updatedQuestions = questions.map((q, i) => {
        if (i !== index) return q;
        const updatedCorrectAnswers = q.correctAnswers.map((isCorrect, j) => {
            if (q.questionType === 'select-all-that-apply') {
                return j === answerIndex ? !isCorrect : isCorrect; // Toggle the selected answer
            } else {
                return j === answerIndex; // For other types, only one can be correct
            }
        });
        return { ...q, correctAnswers: updatedCorrectAnswers };
    });
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i === questionIndex) {
        const updatedAnswers = q.answers.map((ans, j) => j === answerIndex ? value : ans);
        return { ...q, answers: updatedAnswers };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const validateQuiz = () => {
    const newErrors = {};

    if (!quizTitle.trim()) {
        newErrors.title = 'Quiz title is required.';
    }

    questions.forEach((question, index) => {
        if (!question.questionText.trim()) {
            newErrors[`question_${index}`] = 'Question text is required.';
        }

        if (question.questionType !== 'true-false') {
            question.answers.forEach((answer, ansIndex) => {
                if (!answer.trim()) {
                    newErrors[`question_${index}_answer_${ansIndex}`] = 'Answer text is required.';
                }
            });
        }

        if (question.questionType === 'select-all-that-apply') {
            const allCorrectAnswers = question.correctAnswers.every(isCorrect => isCorrect);
            const selectedAnswers = question.correctAnswers.filter((isCorrect, i) => isCorrect && question.correctAnswers[i]);
            // Check if the user selected all correct answers
            if (selectedAnswers.length !== question.correctAnswers.filter(Boolean).length) {
                newErrors[`question_${index}_correct`] = 'All correct answers must be selected.';
            }
        } else if (!question.correctAnswers.some(isCorrect => isCorrect)) {
            newErrors[`question_${index}_correct`] = 'At least one correct answer is required.';
        }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateQuiz()) {
      return;
    }

    const quizData = {
      title: quizTitle,
      questions: questions,
      createdBy: auth.currentUser.uid,
      createdAt: new Date().toISOString()
    };

    try {
      await pushData(`quiz/${auth.currentUser.uid}`, quizData);
      alert('Quiz created successfully!');
      navigate('/quiz');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz. Please try again.');
    }
  };

  return (
    <div className="quiz-creation-container">
      <h1 className="quiz-creation-title">Create a Quiz</h1>
      
      <button onClick={() => navigate('/quiz')} className="back-button">
        &larr; Back to Quizzes
      </button>

      <h2 className="quiz-title">Quiz Title</h2>
      <input
        type="text"
        placeholder="Enter Quiz Title"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        className="quiz-title-input"
      />
      {errors.title && <div className="error-message">{errors.title}</div>}
      
      {questions.map((question, index) => (
        <div key={index} className="quiz-creation-form">
          <h3 className="quiz-creation-question-title">Question {index + 1}</h3>
          <textarea
            placeholder="Question text"
            value={question.questionText}
            onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
            className="quiz-creation-input"
          />
          <div className="formatted-preview">
            {formatMessage(question.questionText)}
          </div>
          {errors[`question_${index}`] && <div className="error-message">{errors[`question_${index}`]}</div>}
          <select
            value={question.questionType}
            onChange={(e) => handleQuestionChange(index, 'questionType', e.target.value)}
            className="quiz-creation-select"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
            <option value="select-all-that-apply">Select All That Apply</option>
          </select>
          
          {question.answers.map((answer, answerIndex) => (
            <div key={answerIndex} className="answer-field">
              <div className="answer-input-container">
                <div className="correct-answer-selection">
                  <input
                    type={question.questionType === 'select-all-that-apply' ? 'checkbox' : 'radio'}
                    name={`correct-answer-${index}`}
                    checked={question.correctAnswers[answerIndex]}
                    onChange={() => handleCorrectAnswerChange(index, answerIndex)}
                  />
                </div>
                {question.questionType === 'true-false' ? (
                  <div className="true-false-question">
                    <span>{answer}</span>
                  </div>
                ) : (
                  <textarea
                    placeholder="Answer text"
                    value={answer}
                    onChange={(e) => handleAnswerChange(index, answerIndex, e.target.value)}
                    className="quiz-creation-answer-input"
                  />
                )}
              </div>
              {question.questionType !== 'true-false' && (
                <div className="formatted-preview">
                  {formatMessage(answer)}
                </div>
              )}
              {errors[`question_${index}_answer_${answerIndex}`] && 
                <div className="error-message">{errors[`question_${index}_answer_${answerIndex}`]}</div>}
            </div>
          ))}
          {errors[`question_${index}_correct`] && 
            <div className="error-message">{errors[`question_${index}_correct`]}</div>}

          {question.questionType !== 'true-false' && question.answers.length < 5 && (
            <button className="add-answer-button" onClick={() => handleAddAnswer(index)}>Add Answer</button>
          )}
          {question.answers.length > 2 && (
            <button className="remove-answer-button" onClick={() => handleRemoveAnswer(index)}>Remove Answer</button>
          )}
          <button className="remove-question-button" onClick={() => removeQuestion(index)}>Remove Question</button>
        </div>
      ))}
      <button className="add-question-button" onClick={addQuestion}>Add Question</button>
      <button className="create-quiz-button" onClick={handleSubmit}>Create Quiz</button>
    </div>
  );
};

export default QuizCreationPage;
