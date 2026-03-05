import { ColorCard} from './ColorCard' ;
import { ColorOption } from './ColorOption';
export class Player {
  public playerName: string;
  public score: number = 0;
  public isClueGiver: boolean = false;
  private _piecesRemaining: number = 2;

  constructor(name: string) {
    this.playerName = name;
  }

  // Getter for piecesRemaining
  public get piecesRemaining(): number {
    return this._piecesRemaining;
  }
  
  /**
   * Called when a player provides a text clue.
   */
  public giveClue(clue: string): string {
    console.log(`${this.playerName} gives clue: ${clue}`);
    return clue;
  }

  /**
   * Logic for placing a guess piece on the board.
   */
  public placePiece(): void {
    if (this._piecesRemaining > 0) {
      this._piecesRemaining--;
      console.log(`${this.playerName} placed a piece. Remaining: ${this._piecesRemaining}`);
    } else {
      console.warn(`${this.playerName} has no pieces left!`);
    }
  }

  /**
   * Used by the ClueGiver to pick one of the 4 options from a ColorCard.
   */
  public pickColor(card: ColorCard, index: number): ColorOption | undefined {
    if (!this.isClueGiver) {
      console.error("Only the Clue Giver can pick the target color.");
      return undefined;
    }
    return card.getOption(index);
  }

  /**
   * Skips or finishes a turn.
   */
  public passTurn(): void {
    console.log(`${this.playerName} passed their turn.`);
  }

  /**
   * Helper to reset pieces at the start of a new round.
   */
  public resetPieces(): void {
    this._piecesRemaining = 2;
  }
}