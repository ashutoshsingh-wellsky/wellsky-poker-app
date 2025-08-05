import React, { useState } from 'react';
import { VotingSystem, VOTING_SYSTEMS } from '../types';

interface HomePageProps {
  onCreateGame: (moderatorName: string, votingSystem: VotingSystem) => Promise<string>;
}

const HomePage: React.FC<HomePageProps> = ({ onCreateGame }) => {
  const [organizerName, setOrganizerName] = useState('');
  const [selectedVotingSystem, setSelectedVotingSystem] = useState<VotingSystem>('fibonacci');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (organizerName.trim()) {
      // Create the game and get the room code
      const roomCode = await onCreateGame(organizerName.trim(), selectedVotingSystem);
      
      // Generate the shareable link
      const sessionLink = `${window.location.origin}?room=${roomCode}`;
      
      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(sessionLink);
        setShowCopiedMessage(true);
        
        // Hide the message after 3 seconds
        setTimeout(() => {
          setShowCopiedMessage(false);
        }, 3000);
      } catch (err) {
        console.error('Failed to copy link:', err);
        // Fallback for browsers that don't support clipboard API
        alert(`Session link: ${sessionLink}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full p-8">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-md border">
            <img 
              src="/wellsky-logo.png" 
              alt="WellSky Logo" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">WellSky Scrum Poker</h1>
          <p className="text-gray-600">Internal team story point estimation tool</p>
        </div>



        {/* Create Session Form */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Session</h2>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name (Organizer)
              </label>
              <input
                type="text"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Point System
              </label>
              <select
                value={selectedVotingSystem}
                onChange={(e) => setSelectedVotingSystem(e.target.value as VotingSystem)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800"
              >
                {Object.entries(VOTING_SYSTEMS).map(([key, system]) => (
                  <option key={key} value={key}>
                    {system.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {VOTING_SYSTEMS[selectedVotingSystem].description}
              </p>
            </div>

            <button
              type="submit"
              disabled={!organizerName.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Session & Get Link
            </button>
          </form>
          
          {/* Success Message */}
          {showCopiedMessage && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
              ✅ Session link copied to clipboard!
            </div>
          )}
        </div>

        {/* Simple Features */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">🏢 WellSky Internal Tool</p>
          <div className="text-xs text-gray-500">
            Agile Planning → Team Collaboration → Story Estimation
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
