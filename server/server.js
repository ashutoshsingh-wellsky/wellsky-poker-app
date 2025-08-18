import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);

// Configure CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://your-app-name.vercel.app"] 
      : ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3003"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Store game sessions in memory (in production, use Redis or database)
const gameSessions = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a game room
  socket.on('join-room', ({ roomCode, player }) => {
    console.log(`Player ${player.name} joining room: ${roomCode}`);
    
    socket.join(roomCode);
    socket.roomCode = roomCode;
    socket.playerId = player.id;
    
    // Get or create session
    if (!gameSessions.has(roomCode)) {
      gameSessions.set(roomCode, {
        id: roomCode,
        roomCode,
        currentIssue: null,
        players: [],
        isVotingActive: false,
        isRevealed: false,
        votingSystem: 'fibonacci',
        createdAt: new Date(),
        moderatorId: player.id,
        gameHistory: []
      });
    }
    
    const session = gameSessions.get(roomCode);
    
    // Check if player already exists
    const existingPlayerIndex = session.players.findIndex(p => p.id === player.id || p.name === player.name);
    if (existingPlayerIndex >= 0) {
      // Update existing player
      session.players[existingPlayerIndex] = { ...player, isReady: true };
    } else {
      // Add new player
      session.players.push({ ...player, vote: null, isReady: true });
    }
    
    // Broadcast updated session to all players in room
    io.to(roomCode).emit('session-updated', session);
    
    socket.emit('join-success', { session, playerId: player.id });
  });

  // Create a new game
  socket.on('create-game', ({ roomCode, moderatorName, votingSystem = 'fibonacci' }) => {
    console.log(`🎮 Creating game: ${roomCode} by ${moderatorName} with system: ${votingSystem}`);
    console.log('📡 Socket ID:', socket.id);
    
    const moderatorId = `mod-${Date.now()}`;
    const session = {
      id: roomCode,
      roomCode,
      currentIssue: null,
      players: [{
        id: moderatorId,
        name: moderatorName,
        vote: null,
        isReady: true,
        isSpectator: false
      }],
      isVotingActive: false,
      isRevealed: false,
      votingSystem,
      createdAt: new Date(),
      moderatorId,
      gameHistory: []
    };
    
    gameSessions.set(roomCode, session);
    socket.join(roomCode);
    socket.roomCode = roomCode;
    socket.playerId = moderatorId;
    
    console.log('✅ Game created, sending response...');
    socket.emit('game-created', { session, playerId: moderatorId });
    console.log('📤 Response sent');
  });

  // Add/update issue
  socket.on('set-issue', ({ issue }) => {
    const roomCode = socket.roomCode;
    if (!roomCode || !gameSessions.has(roomCode)) return;
    
    const session = gameSessions.get(roomCode);
    session.currentIssue = issue;
    session.isVotingActive = false;
    session.isRevealed = false;
    
    // Reset all votes
    session.players.forEach(player => {
      player.vote = null;
      player.isReady = false;
    });
    
    io.to(roomCode).emit('session-updated', session);
  });

  // Start voting
  socket.on('start-voting', () => {
    const roomCode = socket.roomCode;
    if (!roomCode || !gameSessions.has(roomCode)) return;
    
    const session = gameSessions.get(roomCode);
    session.isVotingActive = true;
    session.isRevealed = false;
    
    // Reset votes
    session.players.forEach(player => {
      player.vote = null;
      player.isReady = false;
    });
    
    io.to(roomCode).emit('session-updated', session);
    io.to(roomCode).emit('voting-started');
  });

  // Submit vote
  socket.on('submit-vote', ({ vote }) => {
    const roomCode = socket.roomCode;
    const playerId = socket.playerId;
    
    if (!roomCode || !gameSessions.has(roomCode)) return;
    
    const session = gameSessions.get(roomCode);
    const player = session.players.find(p => p.id === playerId);
    
    if (!player || player.isSpectator || !session.isVotingActive) return;
    
    player.vote = vote;
    player.isReady = true;
    
    console.log(`Player ${player.name} voted: ${vote}`);
    
    io.to(roomCode).emit('session-updated', session);
    
    // Check if all players have voted
    const votingPlayers = session.players.filter(p => !p.isSpectator);
    const allVoted = votingPlayers.length > 0 && votingPlayers.every(p => p.vote !== null);
    
    if (allVoted) {
      io.to(roomCode).emit('all-players-voted');
    }
  });

  // Reveal votes
  socket.on('reveal-votes', () => {
    const roomCode = socket.roomCode;
    if (!roomCode || !gameSessions.has(roomCode)) return;
    
    const session = gameSessions.get(roomCode);
    session.isRevealed = true;
    session.isVotingActive = false;
    
    // Save round to history
    if (session.currentIssue) {
      const votes = {};
      session.players.forEach(player => {
        if (player.vote && !player.isSpectator) {
          votes[player.id] = player.vote;
        }
      });

      const round = {
        issueId: session.currentIssue.id,
        votes,
        finalEstimate: null,
        timestamp: new Date(),
        duration: 0
      };

      session.gameHistory.push(round);
    }
    
    io.to(roomCode).emit('session-updated', session);
    io.to(roomCode).emit('votes-revealed');
  });

  // Set final estimate
  socket.on('set-final-estimate', ({ estimate }) => {
    const roomCode = socket.roomCode;
    if (!roomCode || !gameSessions.has(roomCode)) return;
    
    const session = gameSessions.get(roomCode);
    if (session.gameHistory.length > 0) {
      const lastRound = session.gameHistory[session.gameHistory.length - 1];
      lastRound.finalEstimate = estimate;
    }
    
    io.to(roomCode).emit('session-updated', session);
    io.to(roomCode).emit('estimate-set', { estimate });
  });

  // Reset votes for new round
  socket.on('reset-votes', () => {
    const roomCode = socket.roomCode;
    if (!roomCode || !gameSessions.has(roomCode)) return;
    
    const session = gameSessions.get(roomCode);
    session.players.forEach(player => {
      player.vote = null;
      player.isReady = false;
    });
    session.isVotingActive = false;
    session.isRevealed = false;
    
    io.to(roomCode).emit('session-updated', session);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    const roomCode = socket.roomCode;
    const playerId = socket.playerId;
    
    if (roomCode && gameSessions.has(roomCode)) {
      const session = gameSessions.get(roomCode);
      
      // Remove player or mark as disconnected
      session.players = session.players.filter(p => p.id !== playerId);
      
      // If moderator leaves, assign to another player
      if (playerId === session.moderatorId && session.players.length > 0) {
        session.moderatorId = session.players[0].id;
      }
      
      // If no players left, remove session
      if (session.players.length === 0) {
        gameSessions.delete(roomCode);
        console.log(`Session ${roomCode} removed - no players left`);
      } else {
        io.to(roomCode).emit('session-updated', session);
      }
    }
  });

  // Get session data
  socket.on('get-session', ({ roomCode }) => {
    if (gameSessions.has(roomCode)) {
      socket.emit('session-data', gameSessions.get(roomCode));
    } else {
      socket.emit('session-not-found');
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    activeSessions: gameSessions.size,
    timestamp: new Date().toISOString()
  });
});

// Get active sessions (for debugging)
app.get('/sessions', (req, res) => {
  const sessions = Array.from(gameSessions.entries()).map(([code, session]) => ({
    roomCode: code,
    players: session.players.length,
    isActive: session.isVotingActive,
    currentIssue: session.currentIssue?.title || 'None'
  }));
  res.json(sessions);
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Scrum Poker server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Sessions info: http://localhost:${PORT}/sessions`);
});
