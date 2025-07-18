import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const MultiplayerQuiz = () => {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [quizText, setQuizText] = useState('');
  const [players, setPlayers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState('lobby'); // lobby, playing, finished
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [inputRoomCode, setInputRoomCode] = useState('');

  
  const socketRef = useRef();
  const timerRef = useRef();
  const navigate = useNavigate();

  // Color palette
  const colors = {
    primary: '#132780',
    secondary: '#6a85c4',
    accent: '#8cb3e9',
    highlight: '#e39dae',
    danger: '#e5496f'
  };

  useEffect(() => {
  socketRef.current = io('http://localhost:5000', {
    path: '/socket.io',
    transports: ['websocket'],
    withCredentials: true,
  });

   socketRef.current.on('connect', () => {
    console.log('✅ Socket connected:', socketRef.current.id);
  });

  socketRef.current.on('playerJoined', (playerList) => {
    console.log('Updated player list:', playerList);
    setPlayers(playerList);
    const currentPlayer = playerList.find(p => p.id === socketRef.current.id);
    if (currentPlayer?.isHost) {
      setIsHost(true);
    } else {
      setIsHost(false);
    }
  });

  // 🔥 Listen for game start
  socketRef.current.on('gameStarted', (questionsFromHost) => {
    console.log('Game started - questions received');
    setQuestions(questionsFromHost);
    setCurrentQuestionIndex(0);
    setGameState('playing');
    setSelectedOption(null);
    setScore(0);
    startTimer(); // Start timer for each player
  });

  // 🔥 Listen for next question
  socketRef.current.on('nextQuestion', (newIndex) => {
    console.log('Next question index:', newIndex);
    setCurrentQuestionIndex(newIndex);
    setSelectedOption(null);
    startTimer();
  });

  // 🔥 Listen for game finished
  socketRef.current.on('gameFinished', (leaderboardData) => {
    setLeaderboard(leaderboardData);
    setGameState('finished');
  });

  // Optional: Handle player left
  socketRef.current.on('playerLeft', (updatedPlayers) => {
    setPlayers(updatedPlayers);
  });

  return () => {
    socketRef.current.disconnect();
  };
}, []);



  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (selectedOption === null) {
      // Automatically submit no answer if time runs out
      submitAnswer(null);
    }
  };

const handleJoinRoom = (e) => {
  e.preventDefault();
    console.log('🔥 handleJoinRoom fired');
console.log('🧪 roomCode:', inputRoomCode);

  if (!inputRoomCode) {
    setError('Please enter your name and room code');
    return;
  }

  console.log('Attempting to join room:', inputRoomCode);
console.log('📡 socketRef.current:', socketRef.current);
  if (!socketRef.current) {
    console.error('🚨 socketRef is null! Connection not established yet.');
    return;
  }

  console.log('🔁 Emitting joinRoom with:', { name, roomCode });

  socketRef.current.emit('joinRoom', { name, roomCode:inputRoomCode }, (response) => {
    console.log('Join room response:', response);
    if (response.error) {
      setError(response.error);
    } else if (response.success) {
      setRoomCode(inputRoomCode); 
      setPlayers(response.players);
      setIsHost(false);
      setGameState('lobby');
      setError('');
    } else {
      setError('Unexpected response from server');
    }
  });
};

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!name) {
      setError('Please enter your name');
      return;
    }

    const newRoomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
setRoomCode(newRoomCode);
setInputRoomCode(newRoomCode); // 👈 this is important to keep UI in sync!

socketRef.current.emit('createRoom', { name, roomCode: newRoomCode }, (response) => {
  if (response.error) {
    setError(response.error);
  } else {
    setPlayers(response.players);
    setIsHost(true);
    setGameState('lobby');
  }
});
  };

  const startGame = async () => {
  if (!quizText || quizText.length < 20) {
    setError('Please enter at least 20 characters of text');
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/api/quiz/generate', {
      text: quizText.substring(0, 2000)
    });

    if (response.data?.questions?.length) {
      // Set for host immediately
      setQuestions(response.data.questions);
      setCurrentQuestionIndex(0);
      setGameState('playing');

      // Start timer for host
      startTimer();

      // Emit to others
      socketRef.current.emit('startGame', {
        roomCode,
        questions: response.data.questions
      });
    } else {
      setError('Failed to generate quiz questions');
    }
  } catch (err) {
    setError('Error generating quiz: ' + err.message);
  }
};


  const getOptionLabel = (option) => option.split(')')[0] + ')';

const submitAnswer = (option) => {
  if (selectedOption !== null) return; // Prevent multiple submissions

  const currentQuestion = questions[currentQuestionIndex];

  console.log('🧠 Selected Option:', option);
  console.log('🧠 Correct Answer:', currentQuestion.answer);

  // ✅ Fix: Compare by label (like "B)")
  const selectedLabel = getOptionLabel(option);
  const isCorrect = selectedLabel === currentQuestion.answer;

  const points = isCorrect ? Math.max(1, timeLeft) : 0;

  setSelectedOption(option);
  setScore(prev => prev + points);

  socketRef.current.emit('submitAnswer', {
    roomCode,
    questionIndex: currentQuestionIndex,
    option,
    points,
    timeLeft
  });
};


  const nextQuestion = () => {
    socketRef.current.emit('nextQuestion', { roomCode });
  };

  const endGame = () => {
    socketRef.current.emit('endGame', { roomCode });
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  const leaveRoom = () => {
    socketRef.current.emit('leaveRoom', { roomCode });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8cb3e9] to-[#132780] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Lobby Screen */}
        {gameState === 'lobby' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-center mb-6" style={{ color: colors.primary }}>
              {isHost ? 'Create Game' : 'Join Game'}
            </h1>

            {!roomCode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.primary }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:outline-none"
                    style={{ borderColor: colors.accent, focusRingColor: colors.secondary }}
                  />
                </div>

                <div className="flex flex-col space-y-4">
  <button
    onClick={handleCreateRoom}
    className="py-2 px-4 rounded-lg text-white font-semibold"
    style={{ backgroundColor: colors.secondary }}
  >
    Create Room
  </button>

  <div>
    <label className="block text-sm font-medium mb-1" style={{ color: colors.primary }}>
      Room Code
    </label>
    <input
  type="text"
  value={inputRoomCode}
  onChange={(e) => {
    console.log('📥 User typed room code:', e.target.value);
    setInputRoomCode(e.target.value.toUpperCase());
  }}
  placeholder="Enter Room Code"
/>
<button
  onClick={(e) => {
    setRoomCode(inputRoomCode); // This is what triggers actual joining
    handleJoinRoom(e);
  }}
>
  Join Room
</button>

  </div>
</div>

              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.primary }}>
                    Room Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={roomCode}
                      readOnly
                      className="flex-1 p-2 border rounded-l focus:outline-none"
                      style={{ borderColor: colors.accent }}
                    />
                    <button
                      onClick={copyRoomCode}
                      className="px-4 py-2 rounded-r text-white"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {isHost && (
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.primary }}>
                      Quiz Content
                    </label>
                    <textarea
                      value={quizText}
                      onChange={(e) => setQuizText(e.target.value)}
                      className="w-full h-32 p-2 border rounded focus:ring-2 focus:outline-none"
                      style={{ borderColor: colors.accent, focusRingColor: colors.secondary }}
                      placeholder="Paste the text to generate quiz from..."
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium mb-2" style={{ color: colors.primary }}>
                    Players ({players.length})
                  </h3>
                  <div className="space-y-2">
                    {players.map((player, index) => (
                      <div key={index} className="p-2 rounded" style={{ backgroundColor: colors.accent + '20' }}>
                        <span style={{ color: colors.primary }}>{player.name}</span>
                        {player.isHost && (
                          <span className="ml-2 text-xs px-2 py-1 rounded" style={{ backgroundColor: colors.highlight }}>
                            Host
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {isHost && (
                  <button
                    onClick={startGame}
                    disabled={players.length < 1}
                    className={`w-full py-3 px-6 rounded-lg text-white font-semibold ${players.length < 1 ? 'opacity-50' : ''}`}
                    style={{ backgroundColor: colors.secondary }}
                  >
                    Start Game
                  </button>
                )}

                <button
                  onClick={leaveRoom}
                  className="w-full py-2 px-4 rounded-lg border font-semibold"
                  style={{ borderColor: colors.danger, color: colors.danger }}
                >
                  Leave Room
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: colors.highlight + '40' }}>
                <p style={{ color: colors.danger }}>{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Game Screen */}
        {gameState === 'playing' && questions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Game Info Bar */}
            <div className="p-4 flex justify-between items-center" style={{ backgroundColor: colors.accent }}>
              <div>
                <span className="font-semibold text-white">Room: {roomCode}</span>
              </div>
              <div className="flex space-x-4">
                <div className="text-white">
                  <span className="font-semibold">Score:</span> {score}
                </div>
                <div className="text-white">
                  <span className="font-semibold">Time:</span> {timeLeft}s
                </div>
              </div>
            </div>

            {/* Question Area */}
            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: colors.primary }}>
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="text-sm font-medium" style={{ color: colors.primary }}>
                    {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
                  </span>
                </div>

                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(timeLeft / 30) * 100}%`,
                      backgroundColor: timeLeft > 10 ? colors.secondary : colors.danger
                    }}
                  ></div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-6" style={{ color: colors.primary }}>
                {questions[currentQuestionIndex].question}
              </h2>

              <div className="space-y-3 mb-8">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => selectedOption === null && submitAnswer(option)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedOption === option
                        ? 'border-[#6a85c4] bg-[#8cb3e9] text-white'
                        : selectedOption !== null && option === questions[currentQuestionIndex].answer
                        ? 'border-green-500 bg-green-100'
                        : 'border-[#8cb3e9] hover:border-[#6a85c4]'
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          selectedOption === option
                            ? 'border-white bg-white'
                            : 'border-[#132780]'
                        }`}
                      >
                        {selectedOption === option && (
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </div>
                ))}
              </div>

              {isHost && selectedOption !== null && (
                <div className="flex justify-end">
                  <button
                    onClick={nextQuestion}
                    className="py-2 px-6 rounded-lg text-white font-semibold"
                    style={{ backgroundColor: colors.secondary }}
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Game'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Screen */}
        {gameState === 'finished' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>
                  Game Results
                </h2>
                <div
                  className="inline-block rounded-full px-6 py-2 mb-4"
                  style={{ backgroundColor: colors.accent + '40' }}
                >
                  <span style={{ color: colors.primary }}>
                    Your Score: <span className="font-bold">{score}</span>
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.primary }}>
                  Leaderboard
                </h3>
                <div className="space-y-3">
                  {leaderboard.map((player, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg flex justify-between items-center ${
                        index === 0 ? 'bg-yellow-100' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`font-bold mr-3 ${
                            index === 0 ? 'text-yellow-600' : 'text-gray-600'
                          }`}
                        >
                          #{index + 1}
                        </span>
                        <span style={{ color: colors.primary }}>
                          {player.name} {player.isHost && '(Host)'}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold" style={{ color: colors.primary }}>
                          {player.score} pts
                        </span>
                        <span className="text-sm ml-2" style={{ color: colors.secondary }}>
                          ({player.timeTaken}s)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={leaveRoom}
                  className="py-2 px-6 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: colors.secondary }}
                >
                  Return to Lobby
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiplayerQuiz;