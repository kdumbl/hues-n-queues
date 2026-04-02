import { Server, Socket } from "socket.io";
import { gameController } from "../controllers/gameController";
import { Player, GameState } from "../types";

const gavin: Player = {
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

let masterGameState: GameState = {
  players: [gavin, ruby, jackson, kurt]
};

let usersConnected = 0;
let piecesPlaced = 0;

//this is where all the emit and on functionality for the live game will live
export function registerGameHandlers(io: Server, socket: Socket){

  socket.once("new user", () => {
    usersConnected += 1;
    console.log("Learned that a new user has appeared, assigned them the number " + (usersConnected - 1));
    io.emit("new user accepted", usersConnected - 1);
  })

  socket.on("guess_submitted", (lastPlayed, connectionNumber) => {
    let x = lastPlayed % 30;
    let y = Math.floor(lastPlayed / 30);
    if (masterGameState.players[connectionNumber].piece == null){
      masterGameState.players[connectionNumber].piece = {
        x: x,
        y: y
      };
    } else {
      masterGameState.players[connectionNumber].secondPiece = {
        x: x,
        y: y
      };
    }
    masterGameState.players[connectionNumber].yourTurn = false;
    masterGameState.players[(connectionNumber + 1) % 4].yourTurn = true;
    piecesPlaced += 1;
    io.emit("gameState updated", masterGameState);
  })

  socket.on("clue_submitted", (selectedColorIndex, cueText, connectionNumber) => {
    console.log("The color they chose has index " + selectedColorIndex);
    for (let i = 0; i < 4; i++){
      masterGameState.players[i].clue = cueText;
    }
    masterGameState.players[connectionNumber].yourTurn = false;
    masterGameState.players[(connectionNumber + 1) % 4].yourTurn = true;
    io.emit("gameState updated", masterGameState);
  })

  //receive info from a client
  socket.on("game_update", async (data: any) => {
    //game controller processes move( uses game repository to getgame then save game)
    const payload = await gameController.processMove(data);

    io.to(data.gameId).emit("game_update", payload); //we will use controllers for this?
  });
}
