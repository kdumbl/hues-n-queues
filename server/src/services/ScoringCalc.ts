class ScoringCalc {
  
  /**
   * Calculates the points a player earns for a specific piece.
   * @param target The grid coordinate of the target color (e.g., "H-14")
   * @param guess The grid coordinate where the player placed their piece (e.g., "I-15")
   * @returns The integer score (3, 2, 1, or 0)
   */
  public static calculate(target: string, guess: string): number {
    const [targetRowStr, targetColStr] = target.split("-");
    const targetRow = targetRowStr.charCodeAt(0); // Convert letter to ASCII number
    const targetCol = parseInt(targetColStr, 10);

    // Parse the guess coordinate
    const [guessRowStr, guessColStr] = guess.split("-");
    const guessRow = guessRowStr.charCodeAt(0);
    const guessCol = parseInt(guessColStr, 10);

    // Calculate the absolute distance in rows and columns
    const rowDiff = Math.abs(targetRow - guessRow);
    const colDiff = Math.abs(targetCol - guessCol);

    // Chebyshev distance: the maximum of the two differences defines the "ring" the guess is in
    const distance = Math.max(rowDiff, colDiff);

    // Assign points based on the distance from the target
    if (distance === 0) {
      // Exact match
      return 3;
    } else if (distance === 1) {
      // Inside the 3x3 scoring frame (but not exact)
      return 2;
    } else if (distance === 2) {
      // Adjacent to the outside of the 3x3 scoring frame (the 5x5 outer ring)
      return 1;
    } else {
      // Too far away
      return 0;
    }
  }
}