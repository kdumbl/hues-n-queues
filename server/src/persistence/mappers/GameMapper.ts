//convert domain models to mongo models and vice versa

//"two functions, one to convert a Game domain model to a Game document for MongoDB, and another to convert a Game document back to a Game domain model.";

// src/persistence/mappers/GameMapper.ts

import { GameManager } from "../../domain/GameManager";
import { Player } from "../../domain/Player";
// ... (other imports)

export class GameMapper {
  public static toDocument(game: GameManager): any {
    return {
      // ... (gameState, board, etc.)

      // Map domain players to mongoose player schema
      players: game.players.map((p) => ({
        userId: p.userId, // <-- Now we can populate this directly!
        playerName: p.playerName,
        score: p.score,
        isClueGiver: p.isClueGiver,
        _piecesRemaining: p.piecesRemaining,
      })),

      currentTurnManager: game.currentTurnManager
        ? {
            clueGiver: {
              userId: game.currentTurnManager.clueGiver.userId,
              playerName: game.currentTurnManager.clueGiver.playerName,
              score: game.currentTurnManager.clueGiver.score,
              isClueGiver: game.currentTurnManager.clueGiver.isClueGiver,
              _piecesRemaining:
                game.currentTurnManager.clueGiver.piecesRemaining,
            },
            // ... (activeCard, targetOption, currentPhase)
          }
        : null,
    };
  }

  public static toDomain(gameDoc: any): GameManager {
    // Reconstruct Players with their userId
    const players = gameDoc.players.map((pDoc: any) => {
      // Mongoose ObjectIds need to be converted to strings for the domain
      const player = new Player(pDoc.userId.toString(), pDoc.playerName);
      player.score = pDoc.score;
      player.isClueGiver = pDoc.isClueGiver;
      (player as any)._piecesRemaining = pDoc._piecesRemaining;
      return player;
    });

    const game = new GameManager(players);
    // ... (Reconstruct the rest of the game just like the previous example)

    return game;
  }
}
