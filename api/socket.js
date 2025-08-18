import { Server } from 'socket.io';

// Store game sessions in memory
const gameSessions = new Map();

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Handle health check
    if (req.url.includes('/health')) {
      return res.status(200).json({ 
        status: 'OK', 
        activeSessions: gameSessions.size,
        timestamp: new Date().toISOString()
      });
    }
    
    // Handle sessions endpoint
    if (req.url.includes('/sessions')) {
      const sessions = Array.from(gameSessions.entries()).map(([code, session]) => ({
        roomCode: code,
        players: session.players.length,
        isActive: session.isVotingActive,
        currentIssue: session.currentIssue?.title || 'None'
      }));
      return res.status(200).json(sessions);
    }
  }

  if (!res.socket.server.io) {
    console.log('🚀 Initializing Socket.IO server for Vercel...');
    
    const io = new Server(res.socket.server, {
      path: '/socket.io/',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['polling'],
      allowEIO3: true
    });
    
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log(`✅ User connected: ${socket.id}`);

      // Join a game room
      socket.on('join-room', ({ roomCode, player }) => {
        console.log(`👤 Player ${player.name} joining room: ${roomCode}`);
        
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
        
        // Add or update player
        const existingPlayerIndex = session.players.findIndex(p => p.id === player.id);
        if (existingPlayerIndex >= 0) {
          session.players[existingPlayerIndex] = { ...player, isConnected: true };
        } else {
          session.players.push({ ...player, isConnected: true });
        }

        // Send session data to joining player
        socket.emit('session-joined', session);
        
        // Notify all players in room about player list update
        io.to(roomCode).emit('players-updated', session.players);
        
        console.log(`🎯 Room ${roomCode} now has ${session.players.length} players`);
      });

      // Submit vote
      socket.on('submit-vote', ({ vote }) => {
        if (socket.roomCode && socket.playerId) {
          const session = gameSessions.get(socket.roomCode);
          if (session && session.isVotingActive) {
            const player = session.players.find(p => p.id === socket.playerId);
            if (player) {
              player.vote = vote;
              player.hasVoted = true;
              
              // Notify all players about vote submission (without revealing the vote)
              io.to(socket.roomCode).emit('vote-submitted', {
                playerId: socket.playerId,
                hasVoted: true
              });
              
              console.log(`🗳️ Player ${player.name} voted: ${vote}`);
            }
          }
        }
      });

      // Start voting
      socket.on('start-voting', ({ issue, votingSystem }) => {
        if (socket.roomCode) {
          const session = gameSessions.get(socket.roomCode);
          if (session && session.moderatorId === socket.playerId) {
            session.currentIssue = issue;
            session.isVotingActive = true;
            session.isRevealed = false;
            session.votingSystem = votingSystem || session.votingSystem;
            
            // Reset all votes
            session.players.forEach(player => {
              player.vote = null;
              player.hasVoted = false;
            });
            
            io.to(socket.roomCode).emit('voting-started', {
              issue,
              votingSystem: session.votingSystem
            });
            
            console.log(`🚀 Voting started for issue: ${issue.title}`);
          }
        }
      });

      // Reveal votes
      socket.on('reveal-votes', () => {
        if (socket.roomCode) {
          const session = gameSessions.get(socket.roomCode);
          if (session && session.moderatorId === socket.playerId && session.isVotingActive) {
            session.isRevealed = true;
            
            const votes = session.players
              .filter(p => p.hasVoted)
              .map(p => ({ playerId: p.id, playerName: p.name, vote: p.vote }));
            
            io.to(socket.roomCode).emit('votes-revealed', { votes });
            
            console.log(`🎭 Votes revealed for room: ${socket.roomCode}`);
          }
        }
      });

      // Set final estimate
      socket.on('set-final-estimate', ({ estimate }) => {
        if (socket.roomCode) {
          const session = gameSessions.get(socket.roomCode);
          if (session && session.moderatorId === socket.playerId && session.currentIssue) {
            session.currentIssue.finalEstimate = estimate;
            session.isVotingActive = false;
            
            // Add to history
            session.gameHistory.push({
              issue: { ...session.currentIssue },
              votes: session.players
                .filter(p => p.hasVoted)
                .map(p => ({ playerId: p.id, playerName: p.name, vote: p.vote })),
              finalEstimate: estimate,
              timestamp: new Date()
            });
            
            io.to(socket.roomCode).emit('estimate-finalized', {
              issue: session.currentIssue,
              estimate
            });
            
            console.log(`✅ Final estimate set: ${estimate} for issue: ${session.currentIssue.title}`);
          }
        }
      });

      // Update voting system
      socket.on('update-voting-system', ({ votingSystem }) => {
        if (socket.roomCode) {
          const session = gameSessions.get(socket.roomCode);
          if (session && session.moderatorId === socket.playerId) {
            session.votingSystem = votingSystem;
            
            io.to(socket.roomCode).emit('voting-system-updated', { votingSystem });
            
            console.log(`🔄 Voting system updated to: ${votingSystem}`);
          }
        }
      });

      // Get session data
      socket.on('get-session-data', ({ roomCode }) => {
        if (gameSessions.has(roomCode)) {
          socket.emit('session-data', gameSessions.get(roomCode));
        } else {
          socket.emit('session-not-found');
        }
      });

      // Disconnect handler
      socket.on('disconnect', (reason) => {
        console.log(`❌ User disconnected: ${socket.id}, reason: ${reason}`);
        
        if (socket.roomCode && socket.playerId) {
          const session = gameSessions.get(socket.roomCode);
          if (session) {
            const player = session.players.find(p => p.id === socket.playerId);
            if (player) {
              player.isConnected = false;
            }
            
            io.to(socket.roomCode).emit('players-updated', session.players);
          }
        }
      });
    });
  }

  res.end();
}
