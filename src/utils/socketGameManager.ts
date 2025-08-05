import { io, Socket } from 'socket.io-client';
import { VotingSession, Player, Issue, VotingSystem } from '../types';

class SocketGameManager {
  private socket: Socket | null = null;
  private session: VotingSession | null = null;
  private listeners: Set<(session: VotingSession | null) => void> = new Set();
  private currentPlayerId: string = '';

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    // Use environment-specific URL
    const socketUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:3001'
      : window.location.origin; // Use same origin for production
      
    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Socket event listeners
    this.socket.on('connect', () => {
      console.log('✅ Connected to server:', this.socket?.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('⚠️ Disconnected from server:', reason);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('session-updated', (session: VotingSession) => {
      console.log('Session updated:', session);
      this.session = session;
      this.notifyListeners();
    });

    this.socket.on('game-created', ({ session, playerId }) => {
      console.log('Game created:', session);
      this.session = session;
      this.currentPlayerId = playerId;
      this.notifyListeners();
    });

    this.socket.on('join-success', ({ session, playerId }) => {
      console.log('Joined successfully:', session);
      this.session = session;
      this.currentPlayerId = playerId;
      this.notifyListeners();
    });

    this.socket.on('voting-started', () => {
      console.log('Voting started!');
      // Could add toast notification here
    });

    this.socket.on('all-players-voted', () => {
      console.log('All players have voted!');
      // Could add notification for moderator
    });

    this.socket.on('votes-revealed', () => {
      console.log('Votes revealed!');
      // Could add reveal animation trigger
    });

    this.socket.on('estimate-set', ({ estimate }) => {
      console.log('Final estimate set:', estimate);
      // Could add success notification
    });

    this.socket.on('session-not-found', () => {
      console.log('Session not found');
      this.session = null;
      this.notifyListeners();
    });
  }

  // Session Management
  createSession(roomCode: string, moderatorName: string, votingSystem: VotingSystem = 'fibonacci'): Promise<VotingSession> {
    return new Promise((resolve, reject) => {
      console.log('Creating session:', { roomCode, moderatorName, votingSystem });
      
      if (!this.socket) {
        console.error('Socket is null');
        reject(new Error('Socket not connected'));
        return;
      }

      // Function to attempt creating the game
      const attemptCreate = () => {
        console.log('Socket connected:', this.socket?.connected);
        console.log('Socket ID:', this.socket?.id);
        
        if (!this.socket?.connected) {
          console.error('Socket not connected');
          reject(new Error('Socket not connected'));
          return;
        }

        console.log('Emitting create-game event...');
        this.socket.emit('create-game', { roomCode, moderatorName, votingSystem });

        const timeout = setTimeout(() => {
          console.error('Timeout creating game after 10 seconds');
          reject(new Error('Timeout creating game'));
        }, 10000);

        this.socket.once('game-created', ({ session, playerId }) => {
          console.log('Received game-created event:', { session, playerId });
          clearTimeout(timeout);
          this.session = session;
          this.currentPlayerId = playerId;
          resolve(session);
        });
      };

      // If already connected, create immediately
      if (this.socket.connected) {
        attemptCreate();
      } else {
        // Wait for connection
        console.log('Waiting for socket connection...');
        const connectHandler = () => {
          console.log('Socket connected, attempting to create game...');
          attemptCreate();
        };
        
        const errorHandler = (error: any) => {
          console.error('Connection failed:', error);
          reject(new Error('Failed to connect to server'));
        };

        this.socket.once('connect', connectHandler);
        this.socket.once('connect_error', errorHandler);
        
        // Timeout for connection
        setTimeout(() => {
          this.socket?.off('connect', connectHandler);
          this.socket?.off('connect_error', errorHandler);
          reject(new Error('Connection timeout'));
        }, 15000);
      }
    });
  }

  joinSession(roomCode: string, playerName: string, isSpectator = false): Promise<Player> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      const playerId = `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const player: Player = {
        id: playerId,
        name: playerName,
        vote: null,
        isReady: true,
        isSpectator
      };

      this.currentPlayerId = playerId;
      this.socket.emit('join-room', { roomCode, player });

      const timeout = setTimeout(() => {
        reject(new Error('Timeout joining game'));
      }, 5000);

      this.socket.once('join-success', ({ session, playerId: returnedPlayerId }) => {
        clearTimeout(timeout);
        this.session = session;
        this.currentPlayerId = returnedPlayerId;
        const joinedPlayer = session.players.find((p: Player) => p.id === returnedPlayerId);
        if (joinedPlayer) {
          resolve(joinedPlayer);
        } else {
          reject(new Error('Player not found in session'));
        }
      });

      this.socket.once('session-not-found', () => {
        clearTimeout(timeout);
        reject(new Error('Room not found'));
      });
    });
  }

  leaveSession(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.connect(); // Reconnect for future use
    }
    this.session = null;
    this.currentPlayerId = '';
    this.notifyListeners();
  }

  // Issue Management
  setCurrentIssue(issue: Issue): void {
    if (!this.socket) return;
    this.socket.emit('set-issue', { issue });
  }

  // Voting Management
  startVoting(): void {
    if (!this.socket) return;
    this.socket.emit('start-voting');
  }

  submitVote(playerId: string, vote: string): void {
    if (!this.socket || playerId !== this.currentPlayerId) return;
    this.socket.emit('submit-vote', { vote });
  }

  revealVotes(): void {
    if (!this.socket) return;
    this.socket.emit('reveal-votes');
  }

  resetVotes(): void {
    if (!this.socket) return;
    this.socket.emit('reset-votes');
  }

  setFinalEstimate(estimate: string): void {
    if (!this.socket) return;
    this.socket.emit('set-final-estimate', { estimate });
  }

  // Utility Methods
  getAllPlayersVoted(): boolean {
    if (!this.session) return false;
    
    const votingPlayers = this.session.players.filter(p => !p.isSpectator);
    return votingPlayers.length > 0 && votingPlayers.every(p => p.vote !== null);
  }

  getVoteStatistics() {
    if (!this.session || !this.session.isRevealed) return null;

    const votes = this.session.players
      .filter(p => p.vote && !p.isSpectator && p.vote !== '?' && p.vote !== '☕')
      .map(p => p.vote!)
      .map(vote => {
        const num = parseFloat(vote);
        return isNaN(num) ? 0 : num;
      });

    if (votes.length === 0) return null;

    const sum = votes.reduce((a, b) => a + b, 0);
    const average = sum / votes.length;
    const sortedVotes = votes.sort((a, b) => a - b);
    const median = sortedVotes.length % 2 === 0
      ? (sortedVotes[sortedVotes.length / 2 - 1] + sortedVotes[sortedVotes.length / 2]) / 2
      : sortedVotes[Math.floor(sortedVotes.length / 2)];

    return {
      average: Math.round(average * 10) / 10,
      median,
      min: Math.min(...votes),
      max: Math.max(...votes),
      consensus: sortedVotes.every(v => v === sortedVotes[0])
    };
  }

  // Event Handling
  subscribe(callback: (session: VotingSession | null) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.session));
  }

  getSession(): VotingSession | null {
    return this.session;
  }

  getCurrentPlayerId(): string {
    return this.currentPlayerId;
  }

  // Room code generation
  static generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export const socketGameManager = new SocketGameManager();
