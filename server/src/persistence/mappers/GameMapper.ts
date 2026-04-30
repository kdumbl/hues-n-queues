import { GameManager } from "../../domain/GameManager";
import { Player } from "../../domain/Player";
import { Board } from "../../domain/Board";
import { TurnManager } from "../../domain/TurnManager";
import { GameState as ClientGameState, Player as ClientPlayer } from "../../api/types";
import { GameDoc } from "../docs";

export class GameMapper {
  public static toDTO(game: GameManager): ClientGameState {
    return {
      players: game.players.map((player) => {
        const pieces = this.pieceFinder(game.board.grid, player.userId);
        return {
          name: player.playerName,
          socketId: player.socketId,
          pieceColor: player.pieceColor,
          profileURL: player.profileUrl,
          isClueGiver: player.isClueGiver,
          yourTurn: player.yourTurn,
          score: player.score,
          clue: game.currentTurnManager?.currentClues[0] || "",
          secondClue: game.currentTurnManager?.currentClues[1] || "",
          piece: pieces[0],
          secondPiece: pieces[1],
        };
      })
    };
  }

  private static pieceFinder(grid: (string | null)[][], userId: string): [any, any] {
    let pieces: {x: number, y: number}[] = [];
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === userId) pieces.push({ x: col, y: row });
      }
    }
    return [pieces[0] || null, pieces[1] || null];
  }

  public static toPersistence(game: GameManager): GameDoc {
    return game.toDocument();
  }

  public static toDomain(doc: GameDoc): GameManager {
    const game = new GameManager();
    const colors = ["RED", "YELLOW", "GREEN", "BLUE", "ORANGE", "PURPLE"];
    game.players = doc.players.map((p, i) => Player.fromDocument(p, colors[i]));
    const playerMap = new Map(game.players.map(p => [p.userId, p]));
    game.board = Board.fromDocument(doc.board);
    if (doc.currentTurnManager) game.currentTurnManager = TurnManager.fromDocument(doc.currentTurnManager, playerMap);
    return game;
  }
}