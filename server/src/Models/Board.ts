class Board {
  // Maps a coordinate string (e.g., "A-0") to its hex color and occupation status
  public grid: Map<string, { hexCode: string; occupiedBy: Player | null }>;
  
  // Keeps track of which coordinates have been guessed this round
  public occupiedSpaces: string[];

  constructor() {
    this.grid = new Map<string, { hexCode: string; occupiedBy: Player | null }>();
    this.occupiedSpaces = [];
    this.initializeBoard();
  }

  /**
   * Populates the grid using the MASTER_PALETTE from ColorOption.
   * Generates coordinates like "A-0", "A-1", "B-0", etc.
   */
  private initializeBoard(): void {
    const palette = ColorOption.MASTER_PALETTE;
    
    for (let rowIndex = 0; rowIndex < palette.length; rowIndex++) {
      const row = palette[rowIndex];
      const rowLetter = String.fromCharCode(65 + rowIndex); 
      
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const hexCode = row[colIndex];
        const coordinate = `${rowLetter}-${colIndex}`;
        
        this.grid.set(coordinate, { hexCode: hexCode, occupiedBy: null });
      }
    }
  }

  /**
   * Returns the hex color string at a given coordinate.
   */
  public getCoordinateColor(coordinate: string): string | undefined {
    const space = this.grid.get(coordinate);
    return space ? space.hexCode : undefined;
  }

  /**
   * Checks if a coordinate is a valid placement.
   */
  public isValidPlacement(coordinate: string): boolean {
    const space = this.grid.get(coordinate);
    return space !== undefined;
  }

  /**
   * Places a player's piece on the board if the placement is valid.
   */
  public placePiece(coordinate: string, player: Player): boolean {
    if (this.isValidPlacement(coordinate)) {
      const space = this.grid.get(coordinate)!;
      space.occupiedBy = player;
      this.occupiedSpaces.push(coordinate);
      return true;
    }
    console.warn(`Cannot place piece: ${coordinate} is invalid or already occupied.`);
    return false;
  }

  /**
   * Clears the board for a new round.
   */
  public resetBoard(): void {
    for (const coord of this.occupiedSpaces) {
      const space = this.grid.get(coord);
      if (space) {
        space.occupiedBy = null;
      }
    }
    // Clear the list of occupied spaces
    this.occupiedSpaces = [];
    console.log("Board cleared for the next round.");
  }
}