import React from 'react';
import { VotingSession } from '../types';
import { Copy, Users, LogOut, Plus } from 'lucide-react';

interface GameHeaderProps {
  session: VotingSession;
  isModerator: boolean;
  onLeaveGame: () => void;
  onShowIssueForm: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  session, 
  isModerator, 
  onLeaveGame, 
  onShowIssueForm 
}) => {
  const copyRoomCode = () => {
    navigator.clipboard.writeText(session.roomCode);
    // You could add a toast notification here
  };

  return (
    <header className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">Scrum Poker</h1>
          
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
            <span className="text-sm">{session.players.length} players</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isModerator && (
            <button
              onClick={onShowIssueForm}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Issue</span>
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
    </header>
  );
};

export default GameHeader;
