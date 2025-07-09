const express = require('express');
const router = express.Router();

// Store active rooms in memory
const rooms = new Map();

module.exports = (io) => {

    //   const multiplayer = io.of('/multiplayer'); // 💥 Create namespace
    io.on('connection', (socket) => {
    // ✅ This is where you can use `socket`
    console.log(`🎮 New connection: ${socket.id}`);

    // Log any event the server receives from this socket
    socket.onAny((event, ...args) => {
      console.log(`📨 Received event: ${event}`, args);
    });
    });
  io.on('connection', (socket) => {
    console.log(`New multiplayer connection: ${socket.id}`);

    // Create Room
    socket.on('createRoom', ({ name, roomCode }, callback) => {
      try {
        const normalizedCode = roomCode.trim().toUpperCase();

        if (rooms.has(normalizedCode)) {
          return callback({ error: 'Room already exists' });
        }

        const newRoom = {
          players: [{ id: socket.id, name, isHost: true, score: 0, ready: false }],
          questions: [],
          currentQuestion: 0,
          gameState: 'waiting',
          leaderboard: []
        };

        rooms.set(normalizedCode, newRoom);
        socket.join(normalizedCode);

        console.log(`Room ${normalizedCode} created by ${name}`);

        io.to(normalizedCode).emit('playerJoined', newRoom.players);

        callback({
          success: true,
          players: newRoom.players,
          isHost: true,
          roomCode: normalizedCode
        });
      } catch (err) {
        console.error('Create room error:', err);
        callback({ error: 'Failed to create room' });
      }
    });

    // Join Room
    // Join Room
socket.on('joinRoom', ({ name, roomCode }, callback) => {
  console.log(`🔁 joinRoom from ${name} to ${roomCode}`);

  const normalizedCode = roomCode.trim().toUpperCase();

  if (!rooms.has(normalizedCode)) {
    return callback({ error: 'Room does not exist' });
  }

  const room = rooms.get(normalizedCode);

  if (room.gameState !== 'waiting') {
    return callback({ error: 'Game has already started' });
  }

  room.players.push({ id: socket.id, name, isHost: false, score: 0, ready: false });
  socket.join(normalizedCode);

  io.to(normalizedCode).emit('playerJoined', room.players);

  console.log(`${name} joined room ${normalizedCode}`);

  // ✅ This is the response sent back to the frontend
  callback({
    success: true,
    players: room.players,
    isHost: false,
    roomCode: normalizedCode
  });
});



    // Leave Room on Disconnect
    socket.on('disconnect', () => {
      console.log(`Player disconnected: ${socket.id}`);

      for (const [code, room] of rooms.entries()) {
        const index = room.players.findIndex(p => p.id === socket.id);
        if (index !== -1) {
          const player = room.players[index];
          room.players.splice(index, 1);

          if (room.players.length === 0) {
            rooms.delete(code);
            console.log(`Room ${code} deleted (empty)`);
          } else {
            io.to(code).emit('playerLeft', room.players);
            console.log(`${player.name} left room ${code}`);
          }
          break;
        }
      }
    });

    // Start Game
    socket.on('startGame', ({ roomCode, questions }) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      room.questions = questions;
      room.currentQuestion = 0;
      room.gameState = 'playing';

      room.players.forEach(player => {
        player.score = 0;
        player.timeTaken = 0;
      });

      const sanitizedQuestions = questions.map(q => ({
        question: q.question,
        options: q.options,
        answer: q.answer
      }));

      io.to(roomCode).emit('gameStarted', sanitizedQuestions);
      console.log(`Game started in room ${roomCode}`);
    });

    // Submit Answer
    socket.on('submitAnswer', ({ roomCode, questionIndex, option, points, timeLeft }) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      const player = room.players.find(p => p.id === socket.id);
      if (!player) return;

      player.score += points;
      player.timeTaken += (30 - timeLeft);

      console.log(`${player.name} answered Q${questionIndex + 1} for ${points} pts`);
    });

    // Next Question
    socket.on('nextQuestion', ({ roomCode }) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      if (room.currentQuestion + 1 < room.questions.length) {
        room.currentQuestion++;
        io.to(roomCode).emit('nextQuestion', room.currentQuestion);
        console.log(`Next question sent to room ${roomCode}`);
      } else {
        room.gameState = 'finished';

        const leaderboard = room.players
          .map(p => ({ name: p.name, score: p.score, timeTaken: p.timeTaken, isHost: p.isHost }))
          .sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken);

        io.to(roomCode).emit('gameFinished', leaderboard);
        console.log(`Game finished in room ${roomCode}`);
      }
    });

    // Get Players (optional debugging)
    socket.on('getPlayers', ({ roomCode }, callback) => {
      const room = rooms.get(roomCode);
      callback(room ? room.players : []);
    });
  });

  // REST Endpoint: Get all active rooms (for lobby screen)
  router.get('/rooms', (req, res) => {
    try {
      const activeRooms = Array.from(rooms.entries())
        .filter(([_, room]) => room.gameState === 'waiting')
        .map(([code, room]) => ({
          code,
          playerCount: room.players.length,
          host: room.players.find(p => p.isHost)?.name || 'Unknown'
        }));

      res.json({ rooms: activeRooms });
    } catch (err) {
      console.error('Get rooms error:', err);
      res.status(500).json({ error: 'Failed to get rooms' });
    }
  });

  return router;
};
