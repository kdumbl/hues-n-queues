import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import type { Player } from "./types";

interface LobbyRoomProps {
  socket: Socket | null;
  gameId: string | null;
  currentUser: {
    userId: string;
    username: string;
  } | null;
  players: Player[] | undefined,
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
  const [hostId, setHostId] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;


    socket.on("game started", () => {
      console.log("Game starting...");
      // switch view to game here
      onStart();
    });

    return () => {
      socket.off("lobby update");
      socket.off("game started");
    };
  }, [socket, gameId]);

  const handleStart = () => {
    socket?.emit("start game", gameId);
  };

  const handleLeave = () => {
    socket?.emit("leave lobby", gameId);
    onLeave();
  };


  return (
    <div style={{ padding: 20 }}>
      <h2>Lobby: {gameId}</h2>

      <h3>Players</h3>
      <ul>
        {players?.map((p) => (
          <li key={p.socketId}>
            {p.name}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 20 }}>
        {players?.length == 4 && (
          <button onClick={handleStart}>
            Start Game
          </button>
        )}

        <button onClick={handleLeave} style={{ marginLeft: 10 }}>
          Leave Lobby
        </button>
      </div>
    </div>
  );
}