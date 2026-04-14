import { Server, Socket } from "socket.io";
import { GameController } from "../controllers/gameController";

export function registerGameHandlers(io: Server, socket: Socket) {
  // Replace with dynamic logic to retrieve actual gameId in production
  const gameId = "default-game"; 

  socket.on("guess submitted", async (positionIndex: number) => {
    try {
      const updatedState = await GameController.handleGuess(gameId, socket.id, positionIndex);
      io.emit("gameState updated", updatedState);
    } catch (err) {
      socket.emit("error", "Failed to submit guess");
    }
  });

  socket.on("clue submitted", async (selectedColorIndex: number, cueText: string) => {
    try {
      const updatedState = await GameController.handleClue(gameId, socket.id, cueText, selectedColorIndex);
      io.emit("gameState updated", updatedState);
    } catch (err) {
      socket.emit("error", "Failed to submit clue");
    }
  });

  socket.on("second clue submitted", async (cueText: string) => {
    try {
      const updatedState = await GameController.handleClue(gameId, socket.id, cueText);
      io.emit("gameState updated", updatedState);
    } catch (err) {
      socket.emit("error", "Failed to submit second clue");
    }
  });

  socket.on("score with 3", async () => {
    const updatedState = await GameController.handleScoring(gameId);
    io.emit("gameState updated", updatedState);
  });

  socket.on("score with 6", async () => {
    const updatedState = await GameController.handleScoring(gameId);
    io.emit("gameState updated", updatedState);
  });
}