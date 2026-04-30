import React, { useEffect } from 'react';
import './Lobby.css';
import { Socket } from "socket.io-client";
import ProfileButton from './components/ProfileButton';

interface LobbyProps {
  socket: Socket | null;
  currentUser: { token: string; userId: string; username: string } | null;
  onCreateGame: () => void;
  onJoinGame: (code: string) => void;
  onLogOut: () => void;
}

export default function Lobby({socket, currentUser, onCreateGame, onJoinGame, onLogOut }: LobbyProps) {
  const [joinCode, setJoinCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  

  useEffect(() => {
    if (!socket) return;
    socket?.on("lobby error", (message) => {
      setError(message);
    });
    return () => {
     socket?.off("lobby error");
    };
  }, [socket]);

  const handleJoin = () => {
    if (!joinCode.trim()) {
      setError('Please enter a room code.');
      return;
    }
    setError(null);
    onJoinGame(joinCode);
  };

  return (
    <div className="lb-stage">
      <div className="lb-wall" />
      <div className="lb-floor" />
      <div className="lb-floorLip" />
      <div className="lb-spotlight" />

      <div className="lb-lampCord" />
      <div className="lb-lampShade" />
      <div className="lb-lampRim" />
      <div className="lb-lampBulb" />

      <ProfileButton currentUser={currentUser} onLogOut = {onLogOut}/>

      <div className="lb-card">
        <div className="lb-brand">HUES & CUES</div>
        <div className="lb-welcome">Welcome, {currentUser ? currentUser.username : ""}</div>

        <div className="lb-section">
          <div className="lb-sectionTitle">New Game</div>
          <div className="lb-sectionDesc">Start a fresh lobby and invite friends with a room code.</div>
          <button type="button" className="lb-submit lb-submit--primary" onClick={onCreateGame}>
            Create Game
          </button>
        </div>

        <div className="lb-divider"><span>or</span></div>

        <div className="lb-section">
          <div className="lb-sectionTitle">Join Game</div>
          <div className="lb-sectionDesc">Have a code? Enter it below to jump in.</div>
          <div className="lb-field">
            <input
              type="text"
              className="lb-input"
              placeholder="ENTER CODE"
              value={joinCode}
              onChange={e => { setJoinCode(e.target.value); setError(null); }}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              maxLength={6}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          {error && <div className="lb-error">{error}</div>}
          <button type="button" className="lb-submit lb-submit--secondary" onClick={handleJoin}>
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
}
