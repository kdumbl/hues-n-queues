export class ScoringCalc {
  /**
   * Calculates points based on Chebyshev distance.
   * Standardized to parse "y-x" numeric strings or letter-based rows.
   */
  public static calculate(target: { x: number; y: number }, guessStr: string): number {
    const parts = guessStr.split("-");
    const guessY = isNaN(parseInt(parts[0])) 
                   ? parts[0].toUpperCase().charCodeAt(0) - 65 
                   : parseInt(parts[0], 10);
    const guessX = parseInt(parts[1], 10);

    const dx = Math.abs(target.x - guessX);
    const dy = Math.abs(target.y - guessY);
    const distance = Math.max(dx, dy);

    if (distance === 0) return 3;
    if (distance === 1) return 2;
    if (distance === 2) return 1;
    return 0;
  }
}