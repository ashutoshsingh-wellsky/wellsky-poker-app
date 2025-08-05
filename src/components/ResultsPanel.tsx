import React, { useState } from 'react';
import { VotingSession } from '../types';
import { BarChart3, Users, RefreshCw } from 'lucide-react';

interface ResultsPanelProps {
  session: VotingSession;
  isModerator: boolean;
  onSetFinalEstimate: (estimate: string) => void;
  onNewRound: () => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  session, 
  isModerator, 
  onSetFinalEstimate, 
  onNewRound 
}) => {
  const [finalEstimate, setFinalEstimate] = useState('');

  const votingPlayers = session.players.filter(p => !p.isSpectator);
  const votes = votingPlayers.map(p => ({ player: p.name, vote: p.vote })).filter(v => v.vote);

  // Calculate statistics
  const numericVotes = votes
    .map(v => v.vote)
    .filter(vote => vote && vote !== '?' && vote !== '☕')
    .map(vote => parseFloat(vote!))
    .filter(vote => !isNaN(vote));

  const average = numericVotes.length > 0 
    ? Math.round((numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length) * 10) / 10 
    : 0;

  const sortedVotes = [...numericVotes].sort((a, b) => a - b);
  const median = sortedVotes.length > 0
    ? sortedVotes.length % 2 === 0
      ? (sortedVotes[sortedVotes.length / 2 - 1] + sortedVotes[sortedVotes.length / 2]) / 2
      : sortedVotes[Math.floor(sortedVotes.length / 2)]
    : 0;

  const consensus = votes.length > 0 && votes.every(v => v.vote === votes[0].vote);

  // Group votes by value for visualization
  const voteGroups = votes.reduce((groups: Record<string, number>, vote) => {
    const value = vote.vote || 'No vote';
    groups[value] = (groups[value] || 0) + 1;
    return groups;
  }, {});

  const maxCount = Math.max(...Object.values(voteGroups));

  const handleSetFinalEstimate = () => {
    if (finalEstimate.trim()) {
      onSetFinalEstimate(finalEstimate.trim());
      setFinalEstimate('');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 reveal-animation">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Voting Results
        </h3>
        
        {isModerator && (
          <button
            onClick={onNewRound}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Round</span>
          </button>
        )}
      </div>

      {/* Vote Distribution */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3">Vote Distribution</h4>
        <div className="space-y-2">
          {Object.entries(voteGroups).map(([vote, count]) => (
            <div key={vote} className="flex items-center space-x-3">
              <div className="w-12 text-center">
                <span className="text-white font-mono text-lg">{vote}</span>
              </div>
              <div className="flex-1 bg-white/20 rounded-full h-6 relative">
                <div
                  className="bg-blue-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                >
                  <span className="text-white text-sm font-medium">{count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      {numericVotes.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{average}</div>
            <div className="text-white/70 text-sm">Average</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{median}</div>
            <div className="text-white/70 text-sm">Median</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{Math.max(...numericVotes)}</div>
            <div className="text-white/70 text-sm">Highest</div>
          </div>
        </div>
      )}

      {/* Consensus Indicator */}
      <div className={`p-3 rounded-lg mb-4 ${consensus ? 'bg-green-500/20 border border-green-500/30' : 'bg-yellow-500/20 border border-yellow-500/30'}`}>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span className="font-medium text-white">
            {consensus ? '✓ Team Consensus Reached!' : 'Different opinions - Discussion needed'}
          </span>
        </div>
        <p className="text-white/70 text-sm mt-1">
          {consensus 
            ? `All team members agreed on: ${votes[0]?.vote}`
            : 'Consider discussing the differences before finalizing the estimate.'
          }
        </p>
      </div>

      {/* Final Estimate Input */}
      {isModerator && (
        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Set Final Estimate</h4>
          <div className="flex space-x-2">
            <input
              type="text"
              value={finalEstimate}
              onChange={(e) => setFinalEstimate(e.target.value)}
              className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter final estimate..."
            />
            <button
              onClick={handleSetFinalEstimate}
              disabled={!finalEstimate.trim()}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              Set
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.keys(voteGroups).map((vote) => (
              <button
                key={vote}
                onClick={() => setFinalEstimate(vote)}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded transition-colors"
              >
                {vote}
              </button>
            ))}
            {numericVotes.length > 0 && (
              <>
                <button
                  onClick={() => setFinalEstimate(average.toString())}
                  className="px-3 py-1 bg-blue-500/30 hover:bg-blue-500/50 text-white text-sm rounded transition-colors"
                >
                  Avg: {average}
                </button>
                <button
                  onClick={() => setFinalEstimate(median.toString())}
                  className="px-3 py-1 bg-blue-500/30 hover:bg-blue-500/50 text-white text-sm rounded transition-colors"
                >
                  Median: {median}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
