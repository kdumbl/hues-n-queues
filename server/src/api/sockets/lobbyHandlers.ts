import { Server, Socket } from "socket.io";
import { getGame } from "../../gameStore";
import { Player } from "../../domain/Player";
import { GameMapper } from "../../persistence/mappers/GameMapper";

// The 4 dummy profiles to assign to the 4 windows
const DUMMY_PROFILES = [
  { userId: "u1", name: "TheGooseMafia", color: "RED" },
  { userId: "u2", name: "GutsMan", color: "YELLOW" },
  { userId: "u3", name: "dather9", color: "GREEN" },
  { userId: "u4", name: "DumblDum", color: "BLUE" },
];

export function registerLobbyHandlers(io: Server, socket: Socket) {
  socket.on("new user", () => {
    // Grab the singleton instance we defined in gameStore.ts
    const game = getGame("default-game");
    
    // Check if this socket is already registered (helps with hot-reloads)
    let playerIndex = game.players.findIndex(p => p.socketId === socket.id);
    
    if (playerIndex === -1 && game.players.length < 4) {
      // Assign the next available dummy profile
      const profile = DUMMY_PROFILES[game.players.length];
      const newPlayer = new Player(profile.userId, profile.name, socket.id, profile.color);
      game.players.push(newPlayer);
      playerIndex = game.players.length - 1;
      
      console.log(`Assigned socket ${socket.id} to ${profile.name} (Player ${playerIndex})`);
    }

    if (playerIndex !== -1) {
      // Tell the client which player they are (0, 1, 2, or 3)
      socket.emit("new user accepted", playerIndex);
      
      // If 4 players have joined and the game hasn't started, initialize the round
      if (game.players.length === 4 && game.gameState === "SETUP") {
        console.log("4 players connected, starting game!");
        game.setUpGame(game.players);
        game.startGame();
        io.emit("gameState updated", GameMapper.toDTO(game));
      } else if (game.players.length === 4) {
        // If the game already started (e.g. someone refreshed), just send them the current state
        socket.emit("gameState updated", GameMapper.toDTO(game));
      }
    } else {
       socket.emit("error", "Game is full");
    }
  });
}