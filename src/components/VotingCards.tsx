import React from 'react';
import { VotingSession, VOTING_SYSTEMS } from '../types';

interface VotingCardsProps {
  session: VotingSession;
  currentPlayerId: string;
  onVote: (vote: string) => void;
}

const VotingCards: React.FC<VotingCardsProps> = ({ session, currentPlayerId, onVote }) => {
  const currentPlayer = session.players.find(p => p.id === currentPlayerId);
  const votingSystem = VOTING_SYSTEMS[session.votingSystem];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4">Choose your estimate</h3>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {votingSystem.values.map((value) => {
          const isSelected = currentPlayer?.vote === value;
          
          return (
            <button
              key={value}
              onClick={() => onVote(value)}
              className={`
                aspect-[3/4] rounded-lg border-2 transition-all duration-200 font-bold
                ${isSelected 
                  ? 'bg-blue-500 border-blue-300 text-white shadow-lg scale-105' 
                  : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-800 hover:shadow-md hover:scale-102'
                }
                ${value === '?' ? 'text-orange-600' : ''}
                ${value === '☕' ? 'text-amber-600' : ''}
                flex items-center justify-center text-lg
              `}
            >
              {value}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <p className="text-white/70 text-sm">
          {votingSystem.description}
        </p>
        {currentPlayer?.vote && (
          <p className="text-green-300 text-sm mt-2">
            ✓ You voted: {currentPlayer.vote}
          </p>
        )}
      </div>
    </div>
  );
};

export default VotingCards;
