import { Server, Socket } from "socket.io";
import { gameController } from "../controllers/gameController";
import { Player, GameState } from "../types";
import calculate from "../../domain/ScoringCalc";

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

let masterGameState: GameState = {
  players: [gavin, ruby, jackson, kurt],
};

let usersConnected = 0;
let usersSubmitted: number[] = [];
let selectedIndex: number = -1;

//this is where all the emit and on functionality for the live game will live
export function registerGameHandlers(io: Server, socket: Socket) {
  socket.once("new user", () => {
    usersConnected += 1;
    console.log(
      "Learned that a new user has appeared, assigned them the number " +
        (usersConnected - 1),
    );
    io.emit("new user accepted", usersConnected - 1);
  });

  socket.on("guess_submitted", (lastPlayed, connectionNumber) => {
    usersSubmitted.push(connectionNumber);
    let x = lastPlayed % 30;
    let y = Math.floor(lastPlayed / 30);
    if (masterGameState.players[connectionNumber].piece == null) {
      masterGameState.players[connectionNumber].piece = {
        x: x,
        y: y,
      };
    } else {
      masterGameState.players[connectionNumber].secondPiece = {
        x: x,
        y: y,
      };
    }
    masterGameState.players[connectionNumber].yourTurn = false;
    masterGameState.players[(connectionNumber + 1) % 4].yourTurn = true;
    io.emit("gameState updated", masterGameState);
  });

<<<<<<< Updated upstream
  socket.on(
    "clue_submitted",
    (selectedColorIndex, cueText, connectionNumber) => {
      console.log("The color they chose has index " + selectedColorIndex);
      for (let i = 0; i < 4; i++) {
        masterGameState.players[i].clue = cueText;
      }
      masterGameState.players[connectionNumber].yourTurn = false;
      masterGameState.players[(connectionNumber + 1) % 4].yourTurn = true;
      io.emit("gameState updated", masterGameState);
    },
  );

  // will have to add other listeners for other game events.
  //have piece added or player submitted, will need more instead of generic gameupdate
=======
  socket.on("score with 3", (connectionNumber) => {
    for (let i = 0; i < 3; i++){
      let target = "" + Math.floor(selectedIndex / 30) + "-" + selectedIndex % 30;
      let guess = "" + masterGameState.players[usersSubmitted[i]].piece?.y + "-" + masterGameState.players[usersSubmitted[i]].piece?.x;
      masterGameState.players[usersSubmitted[i]].score += calculate(target, guess);
      console.log("Score of user " + usersSubmitted[i] + " was increased by " + calculate(target, guess));
      masterGameState.players[usersSubmitted[i]].piece = null;
    }
    usersSubmitted = [];
    masterGameState.players[connectionNumber].yourTurn = false;
    masterGameState.players[connectionNumber].isClueGiver = false;
    masterGameState.players[(connectionNumber + 1) % 4].yourTurn = true;
    masterGameState.players[(connectionNumber + 1) % 4].isClueGiver = true;
    for (let i = 0; i < 4; i++){
      masterGameState.players[i].clue = "";
    }
    io.emit("gameState updated", masterGameState);
  })

  socket.on("score with 6", (connectionNumber) => {
    for (let i = 0; i < 3; i++){
      let target = "" + Math.floor(selectedIndex / 30) + "-" + selectedIndex % 30;
      let guess = "" + masterGameState.players[usersSubmitted[i]].piece?.y + "-" + masterGameState.players[usersSubmitted[i]].piece?.x;
      let secondGuess = "" + masterGameState.players[usersSubmitted[i]].secondPiece?.y + "-" + masterGameState.players[usersSubmitted[i]].secondPiece?.x;
      masterGameState.players[usersSubmitted[i]].score += calculate(target, guess);
      masterGameState.players[usersSubmitted[i]].score += calculate(target, secondGuess);
      console.log("Score of user " + usersSubmitted[i] + " was increased by " + calculate(target, guess));
      console.log("Score of user " + usersSubmitted[i] + " was increased by " + calculate(target, secondGuess));
      masterGameState.players[usersSubmitted[i]].piece = null;
      masterGameState.players[usersSubmitted[i]].secondPiece = null;
    }
    usersSubmitted = [];
    masterGameState.players[connectionNumber].yourTurn = false;
    masterGameState.players[connectionNumber].isClueGiver = false;
    masterGameState.players[(connectionNumber + 1) % 4].yourTurn = true;
    masterGameState.players[(connectionNumber + 1) % 4].isClueGiver = true;
    for (let i = 0; i < 4; i++){
      masterGameState.players[i].clue = "";
      masterGameState.players[i].secondClue = "";
    }
    io.emit("gameState updated", masterGameState);
  })

  socket.on("clue submitted", (selectedColorIndex, cueText, connectionNumber) => {
    console.log("The color they chose has index " + selectedColorIndex);
    selectedIndex = selectedColorIndex;
    for (let i = 0; i < 4; i++){
      masterGameState.players[i].clue = cueText;
    }
    masterGameState.players[connectionNumber].yourTurn = false;
    masterGameState.players[(connectionNumber + 1) % 4].yourTurn = true;
    io.emit("gameState updated", masterGameState);
  })
>>>>>>> Stashed changes

  socket.on("second clue submitted", (cueText, connectionNumber) => {
    for (let i = 0; i < 4; i++){
      masterGameState.players[i].secondClue = cueText;
    }
    masterGameState.players[connectionNumber].yourTurn = false;
    masterGameState.players[(connectionNumber + 1) % 4].yourTurn = true;
    io.emit("gameState updated", masterGameState);
  })

  //receive info from a client
  socket.on("game_update", async (data: any) => {
    //game controller processes move( uses game repository to getgame then save game)
    //const payload = await gameController.processMove(data);
    //io.to(data.gameId).emit("game_update", payload); //we will use controllers for this?
  });
}
