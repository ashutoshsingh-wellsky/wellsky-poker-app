import React from 'react';
import { VotingSession } from '../types';
import { Crown, Eye, Check } from 'lucide-react';

interface PlayerListProps {
  session: VotingSession;
  currentPlayerId: string;
  isModerator: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({ session, currentPlayerId }) => {
  const votingPlayers = session.players.filter(p => !p.isSpectator);
  const spectators = session.players.filter(p => p.isSpectator);
  
  // Debug logging
  console.log('PlayerList render - session.isRevealed:', session.isRevealed);
  console.log('PlayerList render - voting players:', votingPlayers.map(p => ({ name: p.name, vote: p.vote })));

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
      <h3 className="text-white text-lg font-semibold mb-4">Players</h3>
      
      {/* Voting Players */}
      <div className="space-y-2 mb-4">
        {votingPlayers.map((player) => (
          <div
            key={player.id}
            className={`
              flex items-center justify-between p-3 rounded-lg
              ${player.id === currentPlayerId ? 'bg-blue-500/30' : 'bg-white/5'}
              ${session.isVotingActive && player.vote ? 'ring-2 ring-green-400' : ''}
            `}
          >
            <div className="flex items-center space-x-2">
              {player.id === session.moderatorId && (
                <Crown className="w-4 h-4 text-yellow-400" />
              )}
              <span className="text-white font-medium">{player.name}</span>
              {player.id === currentPlayerId && (
                <span className="text-blue-300 text-xs">(You)</span>
              )}
              {/* Show vote when revealed - simplified condition */}
              {session.isRevealed && (
                <span className="text-lg font-bold text-yellow-300 bg-yellow-600/30 px-3 py-1 rounded-md border border-yellow-400/50 ml-2">
                  {player.vote || 'No Vote'}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {session.isVotingActive && !session.isRevealed && (
                <span className="text-sm text-white/70">
                  {player.vote ? '✓' : '⏳'}
                </span>
              )}
              {session.isVotingActive && player.vote && !session.isRevealed && (
                <Check className="w-4 h-4 text-green-400" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Spectators */}
      {spectators.length > 0 && (
        <div>
          <h4 className="text-white/70 text-sm font-medium mb-2 flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            Spectators
          </h4>
          <div className="space-y-1">
            {spectators.map((spectator) => (
              <div
                key={spectator.id}
                className={`
                  flex items-center p-2 rounded text-sm
                  ${spectator.id === currentPlayerId ? 'bg-blue-500/20' : 'bg-white/5'}
                `}
              >
                <span className="text-white/70">{spectator.name}</span>
                {spectator.id === currentPlayerId && (
                  <span className="text-blue-300 text-xs ml-1">(You)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voting Progress */}
      {session.isVotingActive && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex justify-between text-sm text-white/70 mb-2">
            <span>Voting Progress</span>
            <span>{votingPlayers.filter(p => p.vote).length}/{votingPlayers.length}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-green-400 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(votingPlayers.filter(p => p.vote).length / votingPlayers.length) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerList;
