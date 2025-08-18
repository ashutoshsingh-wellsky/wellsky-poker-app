import { useState, useEffect } from 'react';
import { socketGameManager } from './utils/socketGameManager';
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

function App() {
  const [session, setSession] = useState<VotingSession | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [roomCodeFromUrl, setRoomCodeFromUrl] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to socket game manager updates
    const unsubscribe = socketGameManager.subscribe((newSession) => {
      setSession(newSession);
    });

    // Load initial session
    setSession(socketGameManager.getSession());

    // Load current player ID from the socket manager
    const playerId = socketGameManager.getCurrentPlayerId();
    if (playerId) {
      setCurrentPlayerId(playerId);
    }

    // Check for room code in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const roomFromUrl = urlParams.get('room');
    if (roomFromUrl && !session) {
      console.log('Room code from URL:', roomFromUrl);
      setRoomCodeFromUrl(roomFromUrl);
      // Clear the URL parameter immediately to clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return unsubscribe;
  }, []);

  const handleCreateGame = async (moderatorName: string, votingSystem: any): Promise<string> => {
    try {
      const roomCode = generateRoomCode();
      const newSession = await socketGameManager.createSession(roomCode, moderatorName, votingSystem);
      setCurrentPlayerId(newSession.moderatorId);
      return roomCode;
    } catch (error) {
      console.error('Failed to create game:', error);
      alert('Failed to create game. Please try again.');
      throw error;
    }
  };

  const handleLeaveGame = () => {
    socketGameManager.leaveSession();
    setCurrentPlayerId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      {!session ? (
        <HomePage 
          onCreateGame={handleCreateGame}
          onJoinGame={async (roomCode: string, playerName: string) => {
            try {
              const player = await socketGameManager.joinSession(roomCode, playerName);
              setCurrentPlayerId(player.id);
            } catch (error) {
              console.error('Failed to join game:', error);
              throw error;
            }
          }}
          roomCodeFromUrl={roomCodeFromUrl || undefined}
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
