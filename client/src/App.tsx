import { useEffect, useRef, useState } from "react";
import BoardScreen from "./BoardScreen.tsx";
import GameScreen from "./GameScreen.tsx";

import { io, Socket } from "socket.io-client";
//import { socket } from "./api/socket.tsx";

import "./BoardScreen.css";
import "./GameScreen.css";
import "./App.css";

type View = "board" | "game";

interface GameState {
  //client described state of gamef
  players: {
    name: string;
    score: number;
  }[],
  pieces_count: number
}

export default function App() {
  //global react variables
  const socketRef = useRef<Socket | null>(null);
  const [view, setView] = useState<View>("game");
  const [gameState, setGameState] = useState<GameState>({
    players: [
      {
        name: "Kurt",
        score: 10,
      },
      {
        name: "Gavin",
        score: 5,
      },
    ],
    pieces_count: 0
  });

  //create socket only once on app render and store as a react ref
  useEffect(() => {
    const socket = io("http://localhost:5001");
    socketRef.current = socket;

    //all listeners must get put here so they are shared between all app subcomponents, board and game screen
    socket.on("connect", () => {
      console.log(`Client: Connected ${socket.id}`);
    });

    //might listen for a new gamestate
    //ideally we can make this the only game related thing the server ever sends. Keep it simple.
    socket.on("gamestate", (newState: GameState) => {
      setGameState(newState);
    });

    //gavin here is your listener moved
    //we can stil have the emits in the components but all listeners need to be here
    socket?.on('update_pieces2', () => {
    console.log('oops! all gone!');
  });

    return () => {
      socket.disconnect();
    };
  }, []);

  //now to pass down the socket and state to both boardscreen and gamescreen; known as props
  const sharedProps = {
    socket: socketRef.current,
    gameState,
    switchView: (v: View) => setView(v),
  };

  //html to be returned see how the props are passed down
  return (
    <div>
      {view === "game" ? (
        <GameScreen {...sharedProps} />
      ) : (
        <BoardScreen {...sharedProps} />
      )}
    </div>
  );
}
