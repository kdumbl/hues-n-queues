
import { BoardDoc } from "../persistence/docs";

export class Board {
  public grid: (string | null)[][];

  constructor() {
    this.grid = Array.from({ length: 16 }, () => Array(30).fill(null));
  }

  public placePiece(x: number, y: number, userId: string): boolean {
    if (x < 0 || x >= 30 || y < 0 || y >= 16) return false;

    // Optional: Logic to limit pieces per player can be added here or in TurnManager
    this.grid[y][x] = userId;
    return true;
  }

  public resetBoard(): void {
    this.grid = Array.from({ length: 16 }, () => Array(30).fill(null));
  }

  /**
   * Converts board to a database document.
   */
  public toDocument(): BoardDoc {
    return {
      grid: this.grid.map(row => [...row]),
      occupiedSpaces: this.grid.flat().filter(cell => cell !== null) as string[],
    };
  }

  /**
   * Rehydrates a board from a document.
   */
  public static fromDocument(doc: BoardDoc): Board {
    const board = new Board();
    board.grid = doc.grid.map(row => [...row]);
    return board;
  }
}