import { useEffect, useRef, useState } from "react";
import BoardScreen from "./BoardScreen.tsx";
import GameScreen from "./GameScreen.tsx";
import Login from "./Login.tsx";
import type { Player, GameState, View } from "./types.ts";
import { io, Socket } from "socket.io-client";

import "./BoardScreen.css";
import "./GameScreen.css";
import "./App.css";
import "./Login.css";

// Keeps the shifting logic intact
function masterToIndividualGameState(
  masterGameState: GameState,
  connectionOrder: number,
): GameState {
  if (
    !masterGameState ||
    !masterGameState.players ||
    masterGameState.players.length < 4
  )
    return masterGameState;

  if (connectionOrder === 0) return masterGameState;

  const p = masterGameState.players;
  if (connectionOrder === 1) return { players: [p[1], p[2], p[3], p[0]] };
  if (connectionOrder === 2) return { players: [p[2], p[3], p[0], p[1]] };
  if (connectionOrder === 3) return { players: [p[3], p[0], p[1], p[2]] };

  return masterGameState;
}

export default function App() {
  const socketRef = useRef<Socket | null>(null);
  const [view, setView] = useState<View>("login");

  // We start with null until the server gives us our first real state
  const [gameState, setGameState] = useState<GameState | undefined>(undefined);
  const [connectionNumber, setConnectionNumber] = useState<number | null>(null);

  useEffect(() => {
    // Initialize socket connection only once when the component mounts
    socketRef.current = io("http://localhost:5001");
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log(`Client: Connected ${socket.id}`);
      socket.emit("new user");
    });

    socket.on("new user accepted", (connectionNum: number) => {
      setConnectionNumber(connectionNum);
    });

    socket.on("gameState updated", (newGameState: GameState) => {
      // Store the MASTER game state from the server
      setGameState(newGameState);
    });

    // Cleanup function when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // Derive the shifted layout cleanly during the render phase
  const individualGameState: GameState | undefined =
    connectionNumber !== null && gameState
      ? masterToIndividualGameState(gameState, connectionNumber)
      : gameState;

  // Don't try to render the game until we have an assigned connection and game state
  /*
  if (!socketRef.current || connectionNumber === null || !individualGameState) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "20vh" }}>
        <h2>Waiting for players...</h2>
        <p>Open 4 windows in total to start the game!</p>
      </div>
    );
  }
*/
  const sharedProps = {
    socket: socketRef.current,
    gameState: individualGameState,
    switchView: (v: View) => setView(v),
    connectionNumber,
  };

  const [currentUser, setCurrentUser] = useState<{
    token: string;
    userId: string;
    username: string;
  } | null>(null);

  return (
    <div>
      {view === "login" ? (
        <Login
          onSuccess={(token, userId, username) => {
            setCurrentUser({ token, userId, username });
            setView("game");
          }}
        />
      ) : view === "game" ? (
        <GameScreen {...sharedProps} />
      ) : (
        <BoardScreen {...sharedProps} />
      )}
    </div>
  );
}
