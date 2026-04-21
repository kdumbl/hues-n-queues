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

const gavin: Player = {
  name: "TheGooseMafia",
  socketId: "45",
  pieceColor: "RED",
  profileURL: "rgebrgbergbj",
  isClueGiver: true,
  yourTurn: true,
  score: 50,
  clue: "",
  secondClue: "",
  piece: null,
  secondPiece: null,
};

const ruby: Player = {
  name: "GutsMan",
  socketId: "46",
  pieceColor: "YELLOW",
  profileURL: "rgebrgbergbj",
  isClueGiver: false,
  yourTurn: false,
  score: 27,
  clue: "",
  secondClue: "",
  piece: null,
  secondPiece: null,
};

const jackson: Player = {
  name: "dather9",
  socketId: "47",
  pieceColor: "GREEN",
  profileURL: "rgebrgbergbj",
  isClueGiver: false,
  yourTurn: false,
  score: 9,
  clue: "",
  secondClue: "",
  piece: null,
  secondPiece: null,
};

const kurt: Player = {
  name: "DumblDum",
  socketId: "48",
  pieceColor: "BLUE",
  profileURL: "rgebrgbergbj",
  isClueGiver: false,
  yourTurn: false,
  score: 67,
  clue: "",
  secondClue: "",
  piece: null,
  secondPiece: null,
};

const curr_game: GameState = {
  players: [gavin, ruby, jackson, kurt],
};

function masterToIndividualGameState(masterGameState, connectionOrder) {
  if (connectionOrder == 0) {
    return masterGameState;
  } else if (connectionOrder == 1) {
    return {
      players: [
        masterGameState.players[1],
        masterGameState.players[2],
        masterGameState.players[3],
        masterGameState.players[0],
      ],
    };
  } else if (connectionOrder == 2) {
    return {
      players: [
        masterGameState.players[2],
        masterGameState.players[3],
        masterGameState.players[0],
        masterGameState.players[1],
      ],
    };
  } else if (connectionOrder == 3) {
    return {
      players: [
        masterGameState.players[3],
        masterGameState.players[0],
        masterGameState.players[1],
        masterGameState.players[2],
      ],
    };
  }
}

export default function App() {
  const socketRef = useRef<Socket | null>(null);
  const [view, setView] = useState<View>("login");
  const [gameState, setGameState] = useState<GameState>(curr_game);
  const [connectionNumber, setConnectionNumber] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    token: string;
    userId: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    const socket2 = io("http://localhost:5001");
    socketRef.current = socket2;

    socket2.on("connect", () => {
      console.log(`Client: Connected ${socket2.id}`);
      socket2.emit("new user");
    });

    socket2.on("new user accepted", (connectionNum) => {
      setConnectionNumber(connectionNum);
      setGameState(prev => masterToIndividualGameState(prev, connectionNum));
    });

    socket2.on("gameState updated", (newGameState) => {
      setConnectionNumber(prev => {
        setGameState(masterToIndividualGameState(newGameState, prev));
        return prev;
      });
    });

    return () => { socket2.disconnect(); };
  }, []);

  const gameSharedProps = {
    socket: socketRef.current,
    gameState,
    switchView: (v: View) => setView(v),
    connectionNumber,
  };
  const boardSharedProps = {
    socket: socketRef.current,
    gameState,
    switchView: (v: View) => setView(v),
    connectionNumber,
  };

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
        <GameScreen {...gameSharedProps} />
      ) : (
        <BoardScreen {...boardSharedProps} />
      )}
    </div>
  );
}