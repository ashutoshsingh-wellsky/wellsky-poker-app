export interface Player {
  id: string;
  name: string;
  vote: string | null;
  isReady: boolean;
  avatar?: string;
  isSpectator?: boolean;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  labels?: string[];
}

export interface VotingSession {
  id: string;
  roomCode: string;
  currentIssue: Issue | null;
  players: Player[];
  isVotingActive: boolean;
  isRevealed: boolean;
  votingSystem: VotingSystem;
  createdAt: Date;
  moderatorId: string;
  gameHistory: VotingRound[];
}

export interface VotingRound {
  issueId: string;
  votes: Record<string, string>;
  finalEstimate: string | null;
  timestamp: Date;
  duration: number;
}

export type VotingSystem = 'fibonacci' | 'modified-fibonacci' | 'tshirt' | 'powers-of-2' | 'linear';

export interface VotingSystemConfig {
  name: string;
  values: string[];
  description: string;
}

export const VOTING_SYSTEMS: Record<VotingSystem, VotingSystemConfig> = {
  'fibonacci': {
    name: 'Fibonacci',
    values: ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕'],
    description: 'Classic Fibonacci sequence for story points'
  },
  'modified-fibonacci': {
    name: 'Modified Fibonacci',
    values: ['0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', '☕'],
    description: 'Modified Fibonacci with half points and larger estimates'
  },
  'tshirt': {
    name: 'T-Shirt Sizes',
    values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕'],
    description: 'T-shirt sizing for relative estimation'
  },
  'powers-of-2': {
    name: 'Powers of 2',
    values: ['1', '2', '4', '8', '16', '32', '64', '?', '☕'],
    description: 'Powers of 2 for technical complexity'
  },
  'linear': {
    name: 'Linear',
    values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '?', '☕'],
    description: 'Linear scale from 1 to 10'
  }
};

export interface GameStats {
  totalRounds: number;
  averageRoundTime: number;
  consensusRate: number;
  mostUsedCard: string;
  participationRate: number;
}
