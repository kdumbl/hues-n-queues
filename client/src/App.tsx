import { useEffect, useRef, useState } from "react";
import BoardScreen from "./BoardScreen.tsx";
import GameScreen from "./GameScreen.tsx";
import type { Player, GameState, View } from "./types.ts";
import { io, Socket } from "socket.io-client";

import "./BoardScreen.css";
import "./GameScreen.css";
import "./App.css";

const gavin: Player = {
<<<<<<< Updated upstream
  name: "TheGooseMafia",
  socketId: "45",
  pieceColor: "RED",
  profileURL: "rgebrgbergbj",
  isClueGiver: true,
  yourTurn: true,
  score: 50,
  clue: "",
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
  piece: null,
  secondPiece: null,
};
=======
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
>>>>>>> Stashed changes

const curr_game: GameState = {
  players: [gavin, ruby, jackson, kurt],
};

function masterToIndividualGameState(masterGameState, connectionOrder) {
  console.log(connectionOrder);
  if (connectionOrder == 0) {
    console.log("Assigned as if connOrder was 0");
    return masterGameState;
  } else if (connectionOrder == 1) {
    let indGameState: GameState = {
      players: [
        masterGameState.players[1],
        masterGameState.players[2],
        masterGameState.players[3],
        masterGameState.players[0],
      ],
    };
    console.log("Assigned as if connOrder was 1");
    return indGameState;
  } else if (connectionOrder == 2) {
    let indGameState: GameState = {
      players: [
        masterGameState.players[2],
        masterGameState.players[3],
        masterGameState.players[0],
        masterGameState.players[1],
      ],
    };
    console.log("Assigned as if connOrder was 2");
    return indGameState;
  } else if (connectionOrder == 3) {
    let indGameState: GameState = {
      players: [
        masterGameState.players[3],
        masterGameState.players[0],
        masterGameState.players[1],
        masterGameState.players[2],
      ],
    };
    console.log("Assigned as if connOrder was 3");
    return indGameState;
  }
}

export default function App() {
  //global react variables
  const socketRef = useRef<Socket | null>(null);
  const [view, setView] = useState<View>("game");
  const [gameState, setGameState] = useState<GameState>(curr_game);
  const [connectionNumber, setConnectionNumber] = useState(null);

  if (socketRef.current == null) {
    const socket2 = io("http://localhost:5001");
    socketRef.current = socket2;
  }

  socketRef.current.once("connect", () => {
    console.log(`Client: Connected ${socketRef.current.id}`);
    socketRef.current.emit("new user");
  });

  socketRef.current.once("new user accepted", (connectionNum) => {
    if (connectionNumber == null) {
      setConnectionNumber(connectionNum);
      setGameState(masterToIndividualGameState(gameState, connectionNum));
    }
  });

  socketRef.current.on("gameState updated", (newGameState) => {
    setGameState(masterToIndividualGameState(newGameState, connectionNumber));
  });

  //now to pass down the socket and state to both boardscreen and gamescreen; known as props
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

  //html to be returned see how the props are passed down
  return (
    <div>
      {view === "game" ? (
        <GameScreen {...gameSharedProps} />
      ) : (
        <BoardScreen {...boardSharedProps} />
      )}
    </div>
  );
}
