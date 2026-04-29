import { useEffect, useRef, useState } from "react";
import GameScreen from "./GameScreen.tsx";
import Lobby from "./Lobby.tsx";
import Login from "./Login.tsx";
import LobbyRoom from "./LobbyRoom.tsx";
import EndScreen from "./EndScreen.tsx";
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
  const [socket, setSocket] = useState<Socket | null> (null);

  // We start with null until the server gives us our first real state
  const [gameState, setGameState] = useState<GameState | undefined>(undefined);
  const [connectionNumber, setConnectionNumber] = useState<number | null>(null);
  const [gameId, setgameId] = useState<string |null>(null);

  const [currentUser, setCurrentUser] = useState<{
    token: string;
    userId: string;
    username: string;
  } | null>(null);

  //runs on site load
  useEffect(() => {
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId") ?? "";
  const username = sessionStorage.getItem("username") ?? "";
  if (token) {
    setCurrentUser({
      token,
      userId: userId,
      username: username,
    });
    setView("lobby");
  } else {
    console.log("failed reauth")
  }
}, []);

  //runs anytime a change to currentUser is made
  useEffect(() => {
    //stops a connection if user isnt logged in.
    if (!currentUser) return;

    // Initialize socket connection only once and auth it using JWT
    const socket = io("http://localhost:5001", {
      auth: {
        token: currentUser.token,
      },
    });
    socketRef.current = socket;
    setSocket(socket);
    
    socket.on("connect", () => {
      console.log(`Client: Connected ${socket.id}`);
    });

    socket.on("game created", (gameId) =>{
      setConnectionNumber(0);
      setgameId(gameId);
      setView("lobbyroom");
    })

    socket.on("game joined", (gameId, connectionNum) =>{
      setgameId(gameId);
      setConnectionNumber(connectionNum);
      setView("lobbyroom");
    })

    socket.on("gameState updated", (newGameState: GameState) => {
      setGameState(newGameState);
    });

    socket.on("game finished", (newGameState: GameState) => {
      setGameState(newGameState);
      setView("end");
      
      console.log("GAMEOVER");
    })

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  // Derive the shifted layout cleanly during the render phase
  const individualGameState: GameState | undefined =
    connectionNumber !== null && gameState
      ? masterToIndividualGameState(gameState, connectionNumber)
      : gameState;

  const sharedProps = {
    socket: socketRef.current,
    gameState: individualGameState,
    connectionNumber,
  };

  const LobbyProp = {
    socket: socket,
    currentUser: currentUser,
    onCreateGame: () => {socketRef.current?.emit("create game")},
    onJoinGame: (code: string) => {socketRef.current?.emit("join game", code)},
    onLogOut: () => {setCurrentUser(null); sessionStorage.clear();},
  };

  const LobbyRoomProp = {
    socket: socketRef.current,
    gameId: gameId,
    currentUser: currentUser,
    players: gameState?.players,
    onLeave: () => {setView("lobby")},
    onStart: () => {setView("game")}
  };

  const EndScreenProp ={
    players: gameState?.players ?? [],
    currentUser: currentUser,
    onReturnToLobby: () => {setView("lobby"); socket?.emit("leave game", gameId);}
  };

  if(!currentUser) { return <Login
          onSuccess={(token, userId, username) => {
            sessionStorage.setItem("userId", userId);
            sessionStorage.setItem("username", username);
            setCurrentUser({ token, userId, username });
            setView("lobby");
          }}
        />
        } else {
  return (
    <div>
      {view === "game" ? (
        <GameScreen {...sharedProps} />
      ) : view === "lobby" ? (
        <Lobby {...LobbyProp} />
      ) : view === "lobbyroom" ? (
        <LobbyRoom {...LobbyRoomProp} />
      ) : (
        <EndScreen{...EndScreenProp}/>
      )}
    </div>
  );
}
}
