import React from 'react';
import { VotingSession } from '../types';
import { socketGameManager } from '../utils/socketGameManager';
import { Copy, Users, LogOut, Eye, Share, Play } from 'lucide-react';
import VotingCards from './VotingCards';
import PlayerList from './PlayerList';
import ResultsPanel from './ResultsPanel';

interface GameRoomProps {
  session: VotingSession;
  currentPlayerId: string;
  onLeaveGame: () => void;
}

const GameRoom: React.FC<GameRoomProps> = ({ session, currentPlayerId, onLeaveGame }) => {
  const currentPlayer = session.players.find(p => p.id === currentPlayerId);
  const isOrganizer = currentPlayerId === session.moderatorId;
  const allPlayersVoted = socketGameManager.getAllPlayersVoted();

  const shareableLink = `${window.location.origin}?room=${session.roomCode}`;

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareableLink);
    // Could add toast notification here
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(session.roomCode);
  };

  const startVoting = () => {
    socketGameManager.startVoting();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Scrum Points</h1>
              
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 px-3 py-1 rounded-lg">
                  <span className="text-white text-sm font-mono">{session.roomCode}</span>
                </div>
                <button
                  onClick={copyRoomCode}
                  className="p-1 text-white/70 hover:text-white transition-colors"
                  title="Copy room code"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-1 text-white/70">
                <Users className="w-4 h-4" />
                <span className="text-sm">{session.players.length} members</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {isOrganizer && (
                <button
                  onClick={copyShareLink}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  title="Copy shareable link"
                >
                  <Share className="w-4 h-4" />
                  <span>Share Link</span>
                </button>
              )}
              
              <button
                onClick={onLeaveGame}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Leave</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Voting Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome / Instructions */}
            {!session.isVotingActive && !session.isRevealed && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {isOrganizer ? "Ready to Start Voting?" : "Waiting for Organizer"}
                </h2>
                <p className="text-white/80 mb-6">
                  {isOrganizer 
                    ? "Click the button below to start the story point voting session"
                    : "The organizer will start the voting session when everyone is ready"
                  }
                </p>
                
                {isOrganizer && (
                  <button
                    onClick={startVoting}
                    className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105"
                  >
                    <Play className="w-5 h-5 inline mr-2" />
                    Start Point Voting
                  </button>
                )}
              </div>
            )}

            {/* Voting Instructions */}
            {session.isVotingActive && !session.isRevealed && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2">🗳️ Voting in Progress</h3>
                <p className="text-green-200 text-sm">
                  Select your story point estimate below. Your vote will be hidden until the organizer reveals all results.
                </p>
              </div>
            )}

            {/* Voting Cards */}
            {session.isVotingActive && currentPlayer && !currentPlayer.isSpectator && (
              <VotingCards 
                session={session}
                currentPlayerId={currentPlayerId}
                onVote={(vote: string) => socketGameManager.submitVote(currentPlayerId, vote)}
              />
            )}

            {/* Spectator Message */}
            {session.isVotingActive && currentPlayer?.isSpectator && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 text-center">
                <Eye className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                <p className="text-white">You're observing this session</p>
                <p className="text-yellow-200 text-sm">You can watch the voting but cannot submit points</p>
              </div>
            )}

            {/* Reveal Button */}
            {session.isVotingActive && isOrganizer && allPlayersVoted && !session.isRevealed && (
              <div className="text-center">
                <button
                  onClick={() => socketGameManager.revealVotes()}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg animate-pulse transition-all transform hover:scale-105"
                >
                  🎉 Reveal All Points
                </button>
              </div>
            )}

            {/* Waiting for All Votes */}
            {session.isVotingActive && !allPlayersVoted && !session.isRevealed && (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center">
                <p className="text-white font-medium">Waiting for all team members to vote...</p>
                <div className="mt-2">
                  <div className="text-blue-200 text-sm">
                    {session.players.filter(p => !p.isSpectator && p.vote).length} of {session.players.filter(p => !p.isSpectator).length} voted
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {session.isRevealed && (
              <div>
                <ResultsPanel 
                  session={session}
                  isModerator={isOrganizer}
                  onSetFinalEstimate={(estimate: string) => socketGameManager.setFinalEstimate(estimate)}
                  onNewRound={() => {
                    socketGameManager.resetVotes();
                  }}
                />
              </div>
            )}
          </div>

          {/* Sidebar - Team Members */}
          <div className="lg:col-span-1">
            <PlayerList 
              session={session}
              currentPlayerId={currentPlayerId}
              isModerator={isOrganizer}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
