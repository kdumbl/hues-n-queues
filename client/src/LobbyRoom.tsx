import { useEffect } from "react";
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
          <div className="lr-sectionTitle">Room Code:</div>
          <div className="lr-roomCode"
          onClick={() => gameId && navigator.clipboard.writeText(gameId)}>
            <span>{gameId}</span>
            <svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="lr-copyIcon"
            aria-hidden="true"> 
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
          </div>
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