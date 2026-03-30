import { useEffect, useRef, useState } from "react";
import BoardScreen from "./BoardScreen.tsx";
import GameScreen from "./GameScreen.tsx";
import type { Player, GameState, View } from "./types.ts";
import { io, Socket } from "socket.io-client";

import "./BoardScreen.css";
import "./GameScreen.css";
import "./App.css";

const gavin: Player = {
    name: "TheGooseMafia",
    socketId: "45",
    pieceColor: "RED",
    profileURL: "rgebrgbergbj",
    isClueGiver: false,
    yourTurn: true,
    score: 50,
    piece: {
      x: 12,
      y: 8
    },
    secondPiece: null
  };

const ruby: Player = {
    name: "GutsMan",
    socketId: "46",
    pieceColor: "YELLOW",
    profileURL: "rgebrgbergbj",
    isClueGiver: false,
    yourTurn: false,
    score: 27,
    piece: {
      x: 4,
      y: 4
    },
    secondPiece: null
  };

const jackson: Player = {
    name: "dather9",
    socketId: "47",
    pieceColor: "GREEN",
    profileURL: "rgebrgbergbj",
    isClueGiver: true,
    yourTurn: false,
    score: 9,
    piece: null,
    secondPiece: null
  };

const kurt: Player = {
    name: "DumblDum",
    socketId: "48",
    pieceColor: "BLUE",
    profileURL: "rgebrgbergbj",
    isClueGiver: false,
    yourTurn: false,
    score: 67,
    piece: {
      x: 8,
      y: 8
    },
    secondPiece: null
  };

let others: Player[] = [ruby, jackson, kurt];

const curr_game: GameState = {
    self: gavin,
    otherPlayers: others
  };


export default function App() {
  //global react variables
  const socketRef = useRef<Socket | null>(null);
  const [view, setView] = useState<View>("game");
  const [gameState, setGameState] = useState<GameState>(curr_game);

  //create socket only once on app render and store as a react ref
  useEffect(() => {
    const socket = io("http://localhost:5001");
    socketRef.current = socket;

    //all listeners must get put here so they are shared between all app subcomponents, board and game screen
    socket.on("connect", () => {
      console.log(`Client: Connected ${socket.id}`);
    });

    /**
    //initial state that server will send after connection
    //doesnt work rn cause we need db connection to pull that info
    socket.on("init", (newState: GameState) =>{
      setGameState(newState);
      console.log("Client state initialized")
    })
    */

    socket.on("update_pieces2", (images)=>{
      set_images(images);
    })

    //might listen for a new gamestate
    //ideally we can make this the only game related thing the server ever sends. Keep it simple.
    socket.on("test_gamestate", (newState: GameState) => {
      setGameState(newState);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  //now to pass down the socket and state to both boardscreen and gamescreen; known as props
  const gameSharedProps = {
    socket: socketRef.current,
    gameState,
    switchView: (v: View) => setView(v),
  };
  const boardSharedProps = {
    socket: socketRef.current,
    gameState,
    switchView: (v: View) => setView(v),
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
