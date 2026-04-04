import { Player } from "./Player";
import { ColorOption } from "./ColorOption";
import { BoardDoc } from "../persistence/docs";

export class Board {
  // 2D Array storing the userId of the occupying player, or null if empty
  //16 rows 30 columns
  public grid: (string | null)[][];
  public occupiedSpaces: string[];

  constructor() {
    this.grid = [];
    this.occupiedSpaces = [];
    this.initializeBoard();
  }

  /**
   * Helper method to parse a coordinate string like "A-0" into array indices.
   */
  private parseCoordinate(coordinate: string): { row: number; col: number } {
    const [rowStr, colStr] = coordinate.split("-");
    const row = rowStr.charCodeAt(0) - 65; // 'A' becomes 0, 'B' becomes 1, etc.
    const col = parseInt(colStr, 10);
    return { row, col };
  }

  /**
   * Populates the 2D grid array based on the dimensions of MASTER_PALETTE.
   */
  private initializeBoard(): void {
    const palette = ColorOption.MASTER_PALETTE;
    this.grid = [];

    for (let rowIndex = 0; rowIndex < palette.length; rowIndex++) {
      const rowArray: (string | null)[] = [];
      for (let colIndex = 0; colIndex < palette[rowIndex].length; colIndex++) {
        rowArray.push(null); // Null means unoccupied
      }
      this.grid.push(rowArray);
    }
  }

  /**
   * Returns the hex color string at a given coordinate directly from the palette.
   */
  public getCoordinateColor(coordinate: string): string | undefined {
    if (!this.isValidPlacement(coordinate)) return undefined;

    const { row, col } = this.parseCoordinate(coordinate);
    return ColorOption.MASTER_PALETTE[row][col];
  }

  /**
   * Checks if a coordinate is within the bounds of the 2D array.
   */
  public isValidPlacement(coordinate: string): boolean {
    // Basic regex check to ensure format is valid before parsing
    if (!/^[A-Z]-\d+$/.test(coordinate)) return false;

    const { row, col } = this.parseCoordinate(coordinate);
    return (
      row >= 0 &&
      row < this.grid.length &&
      col >= 0 &&
      col < this.grid[row].length
    );
  }

  /**
   * Places a player's piece on the board if the placement is valid and empty.
   */
  public placePiece(coordinate: string, player: Player): boolean {
    if (this.isValidPlacement(coordinate)) {
      const { row, col } = this.parseCoordinate(coordinate);

      if (this.grid[row][col] === null) {
        this.grid[row][col] = player.userId;
        this.occupiedSpaces.push(coordinate);
        return true;
      } else {
        console.warn(`Cannot place piece: ${coordinate} is already occupied.`);
        return false;
      }
    }
    console.warn(`Cannot place piece: ${coordinate} is invalid.`);
    return false;
  }

  /**
   * Clears the board for a new round.
   */
  public resetBoard(): void {
    for (const coord of this.occupiedSpaces) {
      if (this.isValidPlacement(coord)) {
        const { row, col } = this.parseCoordinate(coord);
        this.grid[row][col] = null;
      }
    }
    this.occupiedSpaces = [];
    console.log("Board cleared for the next round.");
  }

  public toDocument(): BoardDoc {
    return {
      grid: this.grid, // Now naturally serializes as a 2D array
      occupiedSpaces: [...this.occupiedSpaces],
    };
  }

  /**
   * Recreates a Board instance from a Mongo document.
   */
  public static fromDocument(doc: BoardDoc): Board {
    const board = new Board();

    // Deep copy the 2D array from the document to avoid reference mutations
    board.grid = doc.grid.map((row) => [...row]);
    board.occupiedSpaces = [...doc.occupiedSpaces];

    return board;
  }
}
