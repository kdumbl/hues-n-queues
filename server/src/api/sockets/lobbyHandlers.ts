import { Server, Socket } from "socket.io";
import { getGame, createGame, deleteGame } from "../../gameStore";
import { Player } from "../../domain/Player";
import { GameMapper } from "../../persistence/mappers/GameMapper";
import { registerGameHandlers } from "./gameHandlers";
import { create } from "node:domain";
import { GameManager } from "../../domain/GameManager";


export function registerLobbyHandlers(io: Server, socket: Socket) {

  socket.on("join game", (gameId: string) => {
    const game = getGame(gameId)
      if(game.players.length >= 4) {
        socket.emit("lobby error", "Lobby full");
        console.log("error Lobby full");
      } else if(alreadyJoined(game, socket.data.user.userId)){
        socket.emit("lobby error", "User already in lobby");
        console.log("error user already in lobby");
      } else if(game.gameState == "ACTIVE" || game.gameState == "END") {
        socket.emit("lobby error", "Game already started");
        console.log("error game already started");
      } else {
        socket.join(gameId);
        socket.data.gameId = gameId;
        const newPlayer = new Player(socket.data.user.userId, socket.data.user.username, socket.id, getColor(game));
        game.players.push(newPlayer);
        io.to(gameId).emit("gameState updated", GameMapper.toDTO(game));
        socket.emit("game joined", gameId, game.players.length - 1);

        console.log(`game joined ${game.gameId} by ${socket.data.user.username}`);
    }
  });

  socket.on("create game", () => {
    const gameId = createGame();
    const game = getGame(gameId);
    const newPlayer = new Player(socket.data.user.userId, socket.data.user.username, socket.id, getColor(game));
    game.players.push(newPlayer);
    //addrandys(game);
    socket.join(gameId);
    socket.data.gameId = gameId;
    io.to(gameId).emit("gameState updated", GameMapper.toDTO(game));
    socket.emit("game created", gameId);

    console.log(`game created ${game.gameId} by ${socket.data.user.username}`);
  });

  socket.on("start game", () => {
    const gameId = socket.data.gameId;
    const game = getGame(socket.data.gameId);
    game.setUpGame(game.players);
    game.startGame();
    io.to(gameId).emit("gameState updated", GameMapper.toDTO(game));
    io.to(gameId).emit("game started");

    console.log(`game started ${game.gameId} by ${socket.data.user.username}`);
  });

  socket.on("leave lobby", (gameId: string) => {
    const game = getGame(socket.data.gameId);
    socket.leave(gameId);
    socket.data.gameId = null;
    game.players = game.players.filter (
      (player) => player.socketId !== socket.id
    );
    io.to(gameId).emit("gameState updated", GameMapper.toDTO(game));

    console.log(`game left ${game.gameId} by ${socket.data.user.username}`);
    if(game.players.length < 1){
      deleteGame(gameId);
      console.log(`deleted game ${gameId}`)
    }
  });

  socket.on("leave game", (gameId: string) => {
    const game = getGame(socket.data.gameId);
    socket.leave(gameId);
    socket.data.gameId = null;
    game.players = game.players.filter (
      (player) => player.socketId !== socket.id
    );
    console.log(`game left ${game.gameId} by ${socket.data.user.username}`);
    if(game.players.length < 1){
      deleteGame(gameId);
      console.log(`deleted game ${gameId}`)
    }
  });

  function getColor(game: GameManager){
    const colors = ["RED", "GREEN", "BLUE", "YELLOW"];
    const playerColors = game.players.map(p => p.pieceColor);
    const availableColors = colors.filter(
    (color) => !playerColors.includes(color)
    );

    return availableColors[0];
  }

  function alreadyJoined(game: GameManager, userId: string): boolean{
    const ids = game.players.map(p => p.userId);
    return ids.includes(userId);
  }


  // Handle profile picture URL update
  socket.on("update pfp", ({ gameId, url }) => {
    const game = getGame(gameId);
    if (!game) return;
    // Find the player by socketId
    const player = game.players.find(p => p.socketId === socket.id);
    if (player) {
      player.profileURL = url;
      io.to(gameId).emit("gameState updated", GameMapper.toDTO(game));
    }
  });

}