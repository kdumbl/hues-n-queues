//convert domain models to mongo models and vice versa
//"two functions, one to convert a Game domain model to a Game document for MongoDB, and another to convert a Game document back to a Game domain model.";

import { GameModel } from "../schemas/game.schema";
import { GameDoc, GameState } from "../docs";
import { GameManager } from "../../domain/GameManager";
import { Player } from "../../domain/Player";
import { Board } from "../../domain/Board";
import { TurnManager } from "../../domain/TurnManager";
import { GameState as enumGameState } from "../../domain/GameManager";

export class GameMapper {
  /**
   * Converts a GameManager instance into a plain MongoDB document.
   */
  public static toDocument(game: GameManager): GameDoc {
    return {
      players: game.players.map((p) => p.toDocument()),
      board: game.board.toDocument(),
      currentTurnManager: game.currentTurnManager
        ? game.currentTurnManager.toDocument() // convert if it exists
        : undefined, // leave as undefined otherwise,
      gameState: game.gameState,
      roundsHosted: Object.fromEntries(game["roundsHosted"]), // Map -> object
      currentClueGiverIndex: game["currentClueGiverIndex"],
    };
  }

  /**
   * Reconstructs a GameManager instance from a MongoDB document.
   */
  public static fromDocument(doc: GameDoc): GameManager {
    // First, recreate players
    const players = doc.players.map(Player.fromDocument);

    // Build a map for userId -> Player (needed for TurnManager reconstruction)
    const playerMap = new Map(players.map((p) => [p.userId, p]));

    // Recreate the board
    const board = Board.fromDocument(doc.board);

    // Initialize GameManager with players
    const game = new GameManager(players);

    // Restore internal trackers
    game["roundsHosted"] = new Map(Object.entries(doc.roundsHosted));
    game["currentClueGiverIndex"] = doc.currentClueGiverIndex;
    game.gameState = doc.gameState as enumGameState;
    game.board = board;

    // Restore TurnManager if present
    if (doc.currentTurnManager) {
      game.currentTurnManager = TurnManager.fromDocument(
        doc.currentTurnManager,
        playerMap,
      );
    }

    return game;
  }
}
