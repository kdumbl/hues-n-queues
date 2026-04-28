import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import type { Player } from "./types";
import "./LobbyRoom.css";

interface LobbyRoomProps {
  socket: Socket | null;
  gameId: string | null;
  currentUser: {
    userId: string;
    username: string;
  } | null;
  players: Player[] | undefined;
  onLeave: () => void;
  onStart: () => void;
}

export default function LobbyRoom({
  socket,
  gameId,
  currentUser,
  players,
  onLeave,
  onStart,
}: LobbyRoomProps) {
  const [pfpUrl, setPfpUrl] = useState("");

  useEffect(() => {
    if (!socket) return;

    socket.on("game started", () => {
      console.log("Game starting...");
      onStart();
    });

    return () => {
      socket.off("game started");
    };
  }, [socket, onStart]);

  const handleStart = () => {
    socket?.emit("start game", gameId);
  };

  const handleLeave = () => {
    socket?.emit("leave lobby", gameId);
    onLeave();
  };

  // Find the current player object
  const currentPlayer = players?.find(p => currentUser && (p.name === currentUser.username || p.socketId === (socket?.id || "")));
  // Set initial pfpUrl if available
  useEffect(() => {
    if (currentPlayer && currentPlayer.profileURL && !pfpUrl) {
      setPfpUrl(currentPlayer.profileURL);
    }
  }, [currentPlayer]);

  const handlePfpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPfpUrl(e.target.value);
    // Emit to server
    socket?.emit("update pfp", { gameId, url: e.target.value });
  };

  return (
    <div className="lr-stage">
      <div className="lr-wall" />
      <div className="lr-floor" />
      <div className="lr-floorLip" />
      <div className="lr-spotlight" />

      <div className="lr-lampCord" />
      <div className="lr-lampShade" />
      <div className="lr-lampRim" />
      <div className="lr-lampBulb" />

      <div className="lr-card">
        <div className="lr-brand">HUES & CUES</div>

        <div className="lr-welcome">
          Lobby Room {currentUser ? `• ${currentUser.username}` : ""}
        </div>

        <div className="lr-section">
          {/* Profile Picture URL input for current user */}
          {currentUser && (
            <div className="lr-pfpInput">
              <label htmlFor="pfp-url">Profile Picture URL:</label>
              <input
                id="pfp-url"
                type="text"
                value={pfpUrl}
                onChange={handlePfpChange}
                placeholder="Paste image URL..."
                style={{ width: '80%' }}
              />
              {pfpUrl && (
                <img src={pfpUrl} alt="Preview" style={{ width: 40, height: 40, borderRadius: '50%', marginLeft: 8 }} />
              )}
            </div>
          )}
          <div className="lr-sectionTitle">Room Code</div>
          <div className="lr-roomCode">{gameId}</div>
          <div className="lr-sectionDesc">
            Share this code with friends so they can join your lobby.
          </div>
        </div>

        <div className="lr-divider">
          <span>players</span>
        </div>

        <div className="lr-section">
          <div className="lr-playerList">
            {players && players.length > 0 ? (
              players.map((p) => (
                <div className="lr-player" key={p.socketId}>
                  {p.name}
                </div>
              ))
            ) : (
              <div className="lr-empty">Waiting for players...</div>
            )}
          </div>

          <div className="lr-count">
            {players?.length ?? 0} / 4 players
          </div>

          {players?.length === 4 && (
            <button
              type="button"
              className="lr-submit lr-submit--primary"
              onClick={handleStart}
            >
              Start Game
            </button>
          )}

          <button
            type="button"
            className="lr-submit lr-submit--secondary"
            onClick={handleLeave}
          >
            Leave Lobby
          </button>
        </div>
      </div>
    </div>
  );
}