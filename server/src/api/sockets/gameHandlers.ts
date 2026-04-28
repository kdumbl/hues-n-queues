import { Server, Socket } from "socket.io";
import { GameController } from "../controllers/gameController";

export function registerGameHandlers(io: Server, socket: Socket) {

  socket.on("guess submitted", async (positionIndex: number) => {
    const gameId = socket.data.gameId;
    try {
      const updatedState = await GameController.handleGuess(gameId, socket.id, positionIndex);
      io.to(gameId).emit("gameState updated", updatedState);
    } catch (err) {
      socket.emit("error", "Failed to submit guess");
    }
  });

socket.on("clue submitted", async (colorIndexRaw: string | number, cueText: string, connectionNum?: number) => {
  const gameId = socket.data.gameId;
    try {
      // Ensure the index is a number before passing it to the controller
      const colorIndex = typeof colorIndexRaw === "string" ? parseInt(colorIndexRaw, 10) : colorIndexRaw;
      const updatedState = await GameController.handleClue(gameId, socket.id, cueText, colorIndex);
      io.to(gameId).emit("gameState updated", updatedState);
    } catch (err) {
      socket.emit("error", "Failed to submit clue");
    }
  });

socket.on("second clue submitted", async (cueText: string, connectionNum?: number) => {
  const gameId = socket.data.gameId;
    try {
      const updatedState = await GameController.handleClue(gameId, socket.id, cueText);
      io.to(gameId).emit("gameState updated", updatedState);
    } catch (err) {
      socket.emit("error", "Failed to submit second clue");
    }
  });

  socket.on("score with 3", async () => {
    const gameId = socket.data.gameId;
    const updatedState = await GameController.handleScoring(gameId);
    
    if(updatedState[1] == 0){
      io.to(gameId).emit("gameState updated", updatedState[0]);
    } else {
      io.to(gameId).emit("game finished", updatedState[0]);
    }
  });

  socket.on("score with 6", async () => {
    const gameId = socket.data.gameId;
    const updatedState = await GameController.handleScoring(gameId);

    if(updatedState[1] == 0){
      io.to(gameId).emit("gameState updated", updatedState[0]);
    } else {
      io.to(gameId).emit("game finished", updatedState[0]);
    }

  });
}