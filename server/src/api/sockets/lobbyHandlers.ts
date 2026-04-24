import { Server, Socket } from "socket.io";
import { getGame, createGame } from "../../gameStore";
import { Player } from "../../domain/Player";
import { GameMapper } from "../../persistence/mappers/GameMapper";
import { registerGameHandlers } from "./gameHandlers";
import { create } from "node:domain";
import { GameManager } from "../../domain/GameManager";


export function registerLobbyHandlers(io: Server, socket: Socket) {

  socket.on("join game", (gameId: string) => {
    const game = getGame(gameId)
    socket.join(gameId);
    socket.data.gameId = gameId;
    
    io.to(gameId).emit("gameState updated", GameMapper.toDTO(game));
    socket.emit("game joined", gameId);
  });

  socket.on("create game", () => {
    const gameId = createGame();
    const game = getGame(gameId);
    const newPlayer = new Player(socket.data.user.userId, socket.data.user.username, socket.id, "RED");
    game.players.push(newPlayer);
    addrandys(game);
    socket.join(gameId);
    socket.data.gameId = gameId;
    io.to(gameId).emit("gameState updated", GameMapper.toDTO(game));
    socket.emit("game created");
  });

  socket.on("start game", () => {
    const gameId = socket.data.gameId;
    const game = getGame(socket.data.gameId);
    game.setUpGame(game.players);
    game.startGame();
    io.to(gameId).emit("gameState updated", GameMapper.toDTO(game));
  });

  function addrandys(game: GameManager){
    const newPlayer1 = new Player("1", "Ab", "123", "YELLOW");
    game.players.push(newPlayer1);
    const newPlayer2 = new Player("2", "Bo", "231", "GREEN");
    game.players.push(newPlayer2);
    const newPlayer3 = new Player("3", "Ca", "312", "BLUE");
    game.players.push(newPlayer3);
  }

  /*

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

  */
}