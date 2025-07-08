import React, { useState } from 'react';
import axios from 'axios';

const QuizGenerator = () => {
  const [text, setText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const generateQuiz = async () => {
    if (!text.trim() || text.length < 20) {
      setError("Please enter at least 20 characters");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);
    setCurrentQuestionIndex(0);

    try {
      const res = await axios.post('http://localhost:5000/api/quiz/generate', 
        { text: text.substring(0, 2000) },
        {
          timeout: 60000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!res.data?.questions?.length) {
        throw new Error("No questions were generated");
      }

      setQuestions(res.data.questions);
      setAnswers({});
      
    } catch (err) {
      console.error("Generation error:", err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        err.message || 
        "Failed to generate quiz. Please try again."
      );
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (option) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = () => {
    if (questions.length === 0) return;
    
    const score = questions.reduce((acc, q, i) => {
      const userAnswerLetter = answers[i]?.split(')')[0];
      const correctAnswerLetter = q.answer?.split(')')[0];
      return acc + (userAnswerLetter === correctAnswerLetter ? 1 : 0);
    }, 0);
      
    setResults({
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      correctAnswers: questions.map((q, i) => ({
        question: q.question,
        correctOption: q.answer,
        userAnswer: answers[i]
      }))
    });
  };

  const resetQuiz = () => {
    setQuestions([]);
    setAnswers({});
    setResults(null);
    setError(null);
    setCurrentQuestionIndex(0);
  };

  // Color themes for different states
  const themeColors = {
    primary: 'bg-indigo-600 hover:bg-indigo-700',
    secondary: 'bg-purple-600 hover:bg-purple-700',
    success: 'bg-emerald-500 hover:bg-emerald-600',
    danger: 'bg-rose-500 hover:bg-rose-600',
    warning: 'bg-amber-500 hover:bg-amber-600',
    info: 'bg-sky-500 hover:bg-sky-600'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            QuizUp Challenge
          </h1>
          <p className="text-lg text-gray-600">
            Transform your study material into interactive quizzes
          </p>
        </div>

        {/* Input Area */}
        {!questions.length && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Paste your study material (minimum 20 characters)
              </label>
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setError(null);
                }}
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Example: Photosynthesis is the process by which plants convert sunlight into energy..."
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={generateQuiz}
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold ${themeColors.primary} transition-all duration-300 ${isLoading ? 'opacity-75' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Quiz...
                </span>
              ) : (
                'Generate Quiz'
              )}
            </button>
          </div>
        )}

        {/* Quiz Display - Single Question */}
        {questions.length > 0 && !results && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            {/* Progress Bar */}
            <div className="bg-gray-200 h-2">
              <div 
                className="bg-indigo-600 h-2 transition-all duration-500" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length * 100)}%`
        }}
              ></div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-indigo-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
                </span>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {questions[currentQuestionIndex].question}
              </h2>

              <div className="space-y-3 mb-8">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <div 
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      answers[currentQuestionIndex] === option 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                        answers[currentQuestionIndex] === option 
                          ? 'border-indigo-500 bg-indigo-500' 
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQuestionIndex] === option && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-gray-700">{option}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={goToPrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`py-2 px-4 rounded-lg font-medium ${
                    currentQuestionIndex === 0 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : `${themeColors.secondary} text-white`
                  }`}
                >
                  Previous
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={goToNextQuestion}
                    disabled={!answers[currentQuestionIndex]}
                    className={`py-2 px-6 rounded-lg font-medium ${
                      !answers[currentQuestionIndex] 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : `${themeColors.primary} text-white`
                    }`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={calculateResults}
                    disabled={!answers[currentQuestionIndex]}
                    className={`py-2 px-6 rounded-lg font-medium ${
                      !answers[currentQuestionIndex] 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : `${themeColors.success} text-white`
                    }`}
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Results</h2>
                <div className={`inline-block rounded-full px-6 py-2 ${
                  results.percentage >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  Score: {results.score}/{results.total} ({results.percentage}%)
                </div>
                <p className={`text-xl font-semibold mt-4 ${
                  results.percentage >= 70 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {results.percentage >= 70 ? '🎉 Congratulations! You passed!' : 'Keep practicing! You got this!'}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {results.correctAnswers.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-4 border rounded-lg ${
                      item.userAnswer === item.correctOption 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : 'bg-rose-50 border-rose-200'
                    }`}
                  >
                    <h3 className="font-medium text-gray-800 mb-2">{item.question}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Your answer:</span> {item.userAnswer || 'Not answered'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Correct answer:</span> {item.correctOption}
                    </p>
                    {item.explanation && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                        💡 {item.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={resetQuiz}
                  className={`py-2 px-6 rounded-lg font-medium text-white ${themeColors.primary}`}
                >
                  Create New Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;