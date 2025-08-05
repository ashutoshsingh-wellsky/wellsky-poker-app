import React from 'react';
import { Issue } from '../types';
import { Play, AlertCircle } from 'lucide-react';

interface IssuePanelProps {
  issue: Issue;
  isModerator: boolean;
  isVotingActive: boolean;
  onStartVoting: () => void;
}

const IssuePanel: React.FC<IssuePanelProps> = ({ 
  issue, 
  isModerator, 
  isVotingActive, 
  onStartVoting 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-xl font-bold text-white">{issue.title}</h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(issue.priority)}`}>
              {issue.priority.toUpperCase()}
            </span>
          </div>
          
          <p className="text-white/80 mb-4">{issue.description}</p>

          {issue.acceptanceCriteria && issue.acceptanceCriteria.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white font-medium mb-2">Acceptance Criteria:</h4>
              <ul className="space-y-1">
                {issue.acceptanceCriteria.map((criteria, index) => (
                  <li key={index} className="text-white/70 text-sm flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    {criteria}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {issue.labels && issue.labels.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {issue.labels.map((label, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-500/30 text-blue-200 text-xs rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {isModerator && !isVotingActive && (
          <button
            onClick={onStartVoting}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors ml-4"
          >
            <Play className="w-4 h-4" />
            <span>Start Voting</span>
          </button>
        )}
      </div>

      {isVotingActive && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-green-200">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Voting is now active!</span>
          </div>
          <p className="text-green-200/80 text-sm mt-1">
            Players can now submit their estimates for this issue.
          </p>
        </div>
      )}
    </div>
  );
};

export default IssuePanel;
