import { VotingSession, Player, Issue, VotingRound, VotingSystem } from '../types';

class GameManager {
  private session: VotingSession | null = null;
  private storageKey = 'scrumPokerSession';
  private listeners: Set<(session: VotingSession | null) => void> = new Set();

  constructor() {
    this.loadSession();
  }

  // Session Management
  createSession(roomCode: string, moderatorName: string, votingSystem: VotingSystem = 'fibonacci'): VotingSession {
    const moderatorId = this.generateId();
    const moderator: Player = {
      id: moderatorId,
      name: moderatorName,
      vote: null,
      isReady: true,
      isSpectator: false
    };

    this.session = {
      id: this.generateId(),
      roomCode,
      currentIssue: null,
      players: [moderator],
      isVotingActive: false,
      isRevealed: false,
      votingSystem,
      createdAt: new Date(),
      moderatorId,
      gameHistory: []
    };

    this.saveSession();
    this.notifyListeners();
    return this.session;
  }

  joinSession(roomCode: string, playerName: string, isSpectator = false): Player | null {
    if (!this.session || this.session.roomCode !== roomCode) {
      return null;
    }

    // Check if player already exists
    const existingPlayer = this.session.players.find(p => p.name === playerName);
    if (existingPlayer) {
      return existingPlayer;
    }

    const player: Player = {
      id: this.generateId(),
      name: playerName,
      vote: null,
      isReady: true,
      isSpectator
    };

    this.session.players.push(player);
    this.saveSession();
    this.notifyListeners();
    return player;
  }

  leaveSession(playerId: string): void {
    if (!this.session) return;

    this.session.players = this.session.players.filter(p => p.id !== playerId);
    
    // If moderator leaves, assign to another player
    if (playerId === this.session.moderatorId && this.session.players.length > 0) {
      this.session.moderatorId = this.session.players[0].id;
    }

    // If no players left, clear session
    if (this.session.players.length === 0) {
      this.clearSession();
      return;
    }

    this.saveSession();
    this.notifyListeners();
  }

  // Issue Management
  setCurrentIssue(issue: Issue): void {
    if (!this.session) return;

    this.session.currentIssue = issue;
    this.resetVotes();
    this.session.isVotingActive = false;
    this.session.isRevealed = false;
    
    this.saveSession();
    this.notifyListeners();
  }

  // Voting Management
  startVoting(): void {
    if (!this.session || !this.session.currentIssue) return;

    this.session.isVotingActive = true;
    this.session.isRevealed = false;
    this.resetVotes();
    
    this.saveSession();
    this.notifyListeners();
  }

  submitVote(playerId: string, vote: string): void {
    if (!this.session || !this.session.isVotingActive) return;

    const player = this.session.players.find(p => p.id === playerId);
    if (!player || player.isSpectator) return;

    player.vote = vote;
    player.isReady = true;
    
    this.saveSession();
    this.notifyListeners();
  }

  revealVotes(): void {
    if (!this.session) return;

    this.session.isRevealed = true;
    this.session.isVotingActive = false;
    
    // Save round to history
    if (this.session.currentIssue) {
      const votes: Record<string, string> = {};
      this.session.players.forEach(player => {
        if (player.vote && !player.isSpectator) {
          votes[player.id] = player.vote;
        }
      });

      const round: VotingRound = {
        issueId: this.session.currentIssue.id,
        votes,
        finalEstimate: null,
        timestamp: new Date(),
        duration: 0 // Calculate this based on start time
      };

      this.session.gameHistory.push(round);
    }
    
    this.saveSession();
    this.notifyListeners();
  }

  resetVotes(): void {
    if (!this.session) return;

    this.session.players.forEach(player => {
      player.vote = null;
      player.isReady = false;
    });
    
    this.saveSession();
    this.notifyListeners();
  }

  setFinalEstimate(estimate: string): void {
    if (!this.session || this.session.gameHistory.length === 0) return;

    const lastRound = this.session.gameHistory[this.session.gameHistory.length - 1];
    lastRound.finalEstimate = estimate;
    
    this.saveSession();
    this.notifyListeners();
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

  // Storage
  private saveSession(): void {
    if (this.session) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.session));
    }
  }

  private loadSession(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.session = JSON.parse(stored);
        // Convert date strings back to Date objects
        if (this.session) {
          this.session.createdAt = new Date(this.session.createdAt);
          this.session.gameHistory.forEach(round => {
            round.timestamp = new Date(round.timestamp);
          });
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      this.clearSession();
    }
  }

  clearSession(): void {
    this.session = null;
    localStorage.removeItem(this.storageKey);
    this.notifyListeners();
  }

  getSession(): VotingSession | null {
    return this.session;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
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

export const gameManager = new GameManager();
