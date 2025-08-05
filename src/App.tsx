import { useState, useEffect } from 'react';
import { socketGameManager } from './utils/socketGameManager';
import { gameManager } from './utils/gameManager';
import { VotingSession } from './types';
import HomePage from './components/HomePage';
import GameRoom from './components/GameRoom';
import './index.css';

// Helper function to generate room code
const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Try to use Socket.IO, fallback to localStorage
const useSocketIO = window.location.hostname === 'localhost';
const selectedGameManager = useSocketIO ? socketGameManager : gameManager;

function App() {
  const [session, setSession] = useState<VotingSession | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');

  useEffect(() => {
    // Subscribe to game manager updates
    const unsubscribe = selectedGameManager.subscribe((newSession) => {
      setSession(newSession);
    });

    // Load initial session
    setSession(selectedGameManager.getSession());

    // Load current player ID
    const playerId = useSocketIO 
      ? socketGameManager.getCurrentPlayerId()
      : ''; // For localStorage version, we'll handle player ID differently
    if (playerId) {
      setCurrentPlayerId(playerId);
    }

    // Check for room code in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const roomFromUrl = urlParams.get('room');
    if (roomFromUrl && !session) {
      // Room code will be handled by HomePage component
      console.log('Room code from URL:', roomFromUrl);
    }

    return unsubscribe;
  }, []);

  const handleCreateGame = async (moderatorName: string, votingSystem: any): Promise<string> => {
    try {
      const roomCode = generateRoomCode();
      
      if (useSocketIO) {
        const newSession = await socketGameManager.createSession(roomCode, moderatorName, votingSystem);
        setCurrentPlayerId(newSession.moderatorId);
      } else {
        const newSession = gameManager.createSession(roomCode, moderatorName, votingSystem);
        setCurrentPlayerId(newSession.moderatorId);
      }
      
      return roomCode;
    } catch (error) {
      console.error('Failed to create game:', error);
      alert('Failed to create game. Please try again.');
      throw error;
    }
  };

  const handleLeaveGame = () => {
    if (useSocketIO) {
      socketGameManager.leaveSession();
    } else {
      gameManager.clearSession();
    }
    setCurrentPlayerId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      {!session ? (
        <HomePage 
          onCreateGame={handleCreateGame}
        />
      ) : (
        <GameRoom 
          session={session}
          currentPlayerId={currentPlayerId}
          onLeaveGame={handleLeaveGame}
        />
      )}
    </div>
  );
}

export default App;
