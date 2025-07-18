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
  const [pdfFile, setPdfFile] = useState(null);

  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const generateQuizFromPDF = async () => {
    if (!pdfFile) {
      setError("Please upload a PDF file");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);
    setQuestions([]);
    setAnswers({});
    setCurrentQuestionIndex(0);

    const formData = new FormData();
    formData.append("pdf", pdfFile);

    try {
      const res = await axios.post("http://localhost:5000/api/quiz/extract", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      if (!res.data?.questions?.length) {
        throw new Error("No questions generated from PDF.");
      }

      setQuestions(res.data.questions);
    } catch (err) {
      console.error("PDF Quiz Error:", err);
      setError(err.response?.data?.error || "Failed to generate quiz from PDF.");
    } finally {
      setIsLoading(false);
    }
  };

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
          timeout: 30000,
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

  // Custom color palette
  const colors = {
    primary: {
      light: '#8cb3e9',
      DEFAULT: '#6a85c4',
      dark: '#132780'
    },
    secondary: {
      light: '#e39dae',
      DEFAULT: '#e5496f'
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[${colors.primary.light}] to-[${colors.primary.dark}] py-8 px-4`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6a85c4] to-[#e5496f] mb-2">
            QuizUp Challenge
          </h1>
          <p className="text-lg text-black">
            Transform your study material into interactive quizzes
          </p>
        </div>

        {/* Input Area */}
        {!questions.length && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
            <div className="mb-6">
              <label className="block text-[#132780] text-sm font-medium mb-2">
                Paste your study material (minimum 20 characters)
              </label>
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setError(null);
                }}
                className="w-full h-40 p-4 border border-[#8cb3e9] rounded-lg focus:ring-2 focus:ring-[#6a85c4] focus:border-[#6a85c4]"
                placeholder="Example: Photosynthesis is the process by which plants convert sunlight into energy..."
              />
            </div>
            
            {/* PDF Upload Section */}
            <div className="mb-6">
              <label className="block text-[#132780] text-sm font-medium mb-2">
                Or upload a PDF file
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="block w-full text-sm text-[#132780] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8cb3e9] file:text-[#132780] hover:file:bg-[#6a85c4] hover:file:text-white"
              />
            </div>

            <button
              onClick={generateQuizFromPDF}
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold bg-[#e5496f] hover:bg-[#d43e64] transition-all duration-300 mb-4 ${isLoading ? 'opacity-75' : ''}`}
            >
              {isLoading ? "Processing PDF..." : "Generate Quiz from PDF"}
            </button>
            
            {error && (
              <div className="mb-4 p-3 bg-[#e39dae] text-[#132780] rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={generateQuiz}
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold bg-[#6a85c4] hover:bg-[#5a75b4] transition-all duration-300 ${isLoading ? 'opacity-75' : ''}`}
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
            <div className="bg-[#8cb3e9] h-2">
              <div 
                className="bg-[#6a85c4] h-2 transition-all duration-500" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length * 100)}%` }}
              ></div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-[#6a85c4]">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-[#132780]">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
                </span>
              </div>

              <h2 className="text-xl font-semibold text-[#132780] mb-6">
                {questions[currentQuestionIndex].question}
              </h2>

              <div className="space-y-3 mb-8">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <div 
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      answers[currentQuestionIndex] === option 
                        ? 'border-[#6a85c4] bg-[#8cb3e9] text-white' 
                        : 'border-[#8cb3e9] hover:border-[#6a85c4] text-[#132780]'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                        answers[currentQuestionIndex] === option 
                          ? 'border-white bg-white' 
                          : 'border-[#132780]'
                      }`}>
                        {answers[currentQuestionIndex] === option && (
                          <div className="w-2 h-2 rounded-full bg-[#6a85c4]"></div>
                        )}
                      </div>
                      <span>{option}</span>
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
                      : 'bg-[#8cb3e9] text-white hover:bg-[#6a85c4]'
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
                        : 'bg-[#6a85c4] text-white hover:bg-[#5a75b4]'
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
                        : 'bg-[#e5496f] text-white hover:bg-[#d43e64]'
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
<<<<<<< HEAD
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#132780] mb-2">Quiz Results</h2>
                <div className={`inline-block rounded-full px-6 py-2 ${
                  results.percentage >= 70 ? 'bg-[#8cb3e9] text-[#132780]' : 'bg-[#e39dae] text-[#132780]'
                }`}>
                  Score: {results.score}/{results.total} ({results.percentage}%)
                </div>
                <p className={`text-xl font-semibold mt-4 ${
                  results.percentage >= 70 ? 'text-[#6a85c4]' : 'text-[#e5496f]'
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
                        ? 'bg-[#e8f0fe] border-[#8cb3e9]' 
                        : 'bg-[#fde8ec] border-[#e39dae]'
                    }`}
                  >
                    <h3 className="font-medium text-[#132780] mb-2">{item.question}</h3>
                    <p className="text-sm text-[#132780] mb-1">
                      <span className="font-medium">Your answer:</span> {item.userAnswer || 'Not answered'}
                    </p>
                    <p className="text-sm text-[#132780]">
                      <span className="font-medium">Correct answer:</span> {item.correctOption}
                    </p>
                    {item.explanation && (
                      <div className="mt-2 p-2 bg-[#f0f7ff] rounded text-sm text-[#132780]">
                        💡 {item.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={resetQuiz}
                  className={`py-2 px-6 rounded-lg font-medium text-white bg-[#6a85c4] hover:bg-[#5a75b4]`}
                >
                  Create New Quiz
                </button>
              </div>
            </div>
=======
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#132780] mb-2">Quiz Results</h2>
        <div className={`inline-block rounded-full px-6 py-2 ${
          results.percentage >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          Score: {results.score}/{results.total} ({results.percentage}%)
        </div>
        <p className={`text-xl font-semibold mt-4 ${
          results.percentage >= 70 ? 'text-green-600' : 'text-red-600'
        }`}>
          {results.percentage >= 70 ? '🎉 Congratulations! You passed!' : 'Keep practicing! You got this!'}
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {results.correctAnswers.map((item, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg ${
              item.userAnswer === item.correctOption 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-blue-50 border border-red-200'
            }`}
          >
            <h3 className="font-medium text-gray-800 mb-2">{item.question}</h3>
            <p className={`text-sm mb-1 ${
              item.userAnswer === item.correctOption ? 'text-green-700' : 'text-red-700'
            }`}>
              <span className="font-medium">Your answer:</span> {item.userAnswer || 'Not answered'}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Correct answer:</span> {item.correctOption}
            </p>
            {item.explanation && (
              <div className={`mt-2 p-2 rounded text-sm ${
                item.userAnswer === item.correctOption ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                💡 {item.explanation}
              </div>
            )}
>>>>>>> version2
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={resetQuiz}
          className="py-2 px-6 rounded-lg font-medium text-white bg-[#6a85c4] hover:bg-[#5a75b4] transition-colors"
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