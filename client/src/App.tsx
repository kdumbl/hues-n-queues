import { useEffect, useRef, useState } from "react";
import BoardScreen from "./BoardScreen.tsx";
import GameScreen from "./GameScreen.tsx";
import type { GameState, View } from "./types.ts";
import { io, Socket } from "socket.io-client";

import "./BoardScreen.css";
import "./GameScreen.css";
import "./App.css";


export default function App() {
  //global react variables
  const socketRef = useRef<Socket | null>(null);
  const [view, setView] = useState<View>("game");
  const [gameState, setGameState] = useState<GameState>();

  //Initializes each space to initially lack a game piece image
  const[images, set_images] = useState(Array(480).fill(null));
  

  //create socket only once on app render and store as a react ref
  useEffect(() => {
    const socket = io("http://localhost:5001");
    socketRef.current = socket;

    //all listeners must get put here so they are shared between all app subcomponents, board and game screen
    socket.on("connect", () => {
      console.log(`Client: Connected ${socket.id}`);
    });

    //initial state that server will send after connection
    //doesnt work rn cause we need db connection to pull that info
    socket.on("init", (newState: GameState) =>{
      setGameState(newState);
      console.log("Client state initialized")
    })

    socket.on("update_pieces2", (images)=>{
      set_images(images);
    })

    //might listen for a new gamestate
    //ideally we can make this the only game related thing the server ever sends. Keep it simple.
    socket.on("gamestate", (newState: GameState) => {
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
    images,
    set_images,
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
