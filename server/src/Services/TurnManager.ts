import { Player } from "../domain/Player";
import { ColorCard } from "../domain/ColorCard";
import { ColorOption } from "../domain/ColorOption";

// Enum to track the current state of the round, exactly as specified in your UML
enum TurnPhase {
  CLUE_ONE,
  GUESS_ONE,
  CLUE_TWO,
  GUESS_TWO,
  SCORING,
}

export class TurnManager {
  public clueGiver: Player;
  public activeCard: ColorCard;
  public targetOption?: ColorOption;
  public currentPhase: TurnPhase;
  public currentClues: string[] = [];

  // Maps a Player to the list of coordinates they guessed this round (max 2)
  public roundGuesses: Map<Player, string[]> = new Map();

  constructor(clueGiver: Player, activeCard: ColorCard) {
    this.clueGiver = clueGiver;
    this.activeCard = activeCard;
    this.currentPhase = TurnPhase.CLUE_ONE;

    // Initialize the clue giver
    this.clueGiver.isClueGiver = true;
  }

  /**
   * Sets the target color based on the option the clue giver chose from the card.
   */
  public setTarget(optionIndex: number): void {
    if (this.currentPhase !== TurnPhase.CLUE_ONE) {
      console.warn("Target color can only be set during the initial phase.");
      return;
    }

    this.targetOption = this.activeCard.getOption(optionIndex);
    if (this.targetOption) {
      console.log(
        `${this.clueGiver.playerName} has selected their target color.`,
      );
    } else {
      console.error("Invalid option index selected.");
    }
  }

  /**
   * Checks to make sure the clue does not include bad words.
   * According to the rules, cues cannot be common color names, or board coordinates
   */
  public validateClue(cue: string): boolean {
    const lowerCue = cue.toLowerCase().trim();

    // Basic forbidden words (Common colors) [cite: 51]
    const forbiddenWords = [
      "red",
      "blue",
      "yellow",
      "green",
      "orange",
      "purple",
      "black",
      "white",
      "brown",
      "pink",
      "titty",
    ];

    if (forbiddenWords.some((word) => lowerCue.includes(word))) {
      console.warn("Invalid clue: Cannot use common color names.");
      return false;
    }

    // Check for coordinate patterns (e.g., A1, B-12) [cite: 52]
    const coordinateRegex = /^[a-pA-P]-?\d{1,2}$/;
    if (coordinateRegex.test(lowerCue)) {
      console.warn("Invalid clue: Cannot refer to board positions.");
      return false;
    }

    // Ensure it's strictly a 1-word or 2-word cue based on the phase [cite: 49, 57]
    const wordCount = lowerCue.split(/\s+/).length;
    if (this.currentPhase === TurnPhase.CLUE_ONE && wordCount !== 1) {
      console.warn("Invalid clue: The first clue must be exactly one word.");
      return false;
    }
    if (this.currentPhase === TurnPhase.CLUE_TWO && wordCount > 2) {
      console.warn("Invalid clue: The second clue can be up to two words.");
      return false;
    }

    this.currentClues.push(cue);
    return true;
  }

  /**
   * Records the player's guess with an input of both a player and a coordinate.
   */
  public receiveGuess(player: Player, coordinate: string): void {
    if (player === this.clueGiver) {
      console.warn("The clue giver cannot guess!");
      return;
    }

    if (
      this.currentPhase !== TurnPhase.GUESS_ONE &&
      this.currentPhase !== TurnPhase.GUESS_TWO
    ) {
      console.warn("It is not currently a guessing phase.");
      return;
    }

    // Initialize player in map if they don't exist yet
    if (!this.roundGuesses.has(player)) {
      this.roundGuesses.set(player, []);
    }

    const playerGuesses = this.roundGuesses.get(player)!;

    if (playerGuesses.length >= 2) {
      console.warn(
        `${player.playerName} has already placed all their pieces for this round.`,
      );
      return;
    }

    playerGuesses.push(coordinate);
    console.log(`${player.playerName} guessed coordinate ${coordinate}.`);
  }

  /**
   * Advances the phase or triggers scoring based on the current state.
   */
  public resolveRound(): void {
    switch (this.currentPhase) {
      case TurnPhase.CLUE_ONE:
        this.currentPhase = TurnPhase.GUESS_ONE;
        console.log("Moving to first guess phase.");
        break;
      case TurnPhase.GUESS_ONE:
        this.currentPhase = TurnPhase.CLUE_TWO;
        console.log("Moving to second clue phase.");
        break;
      case TurnPhase.CLUE_TWO:
        this.currentPhase = TurnPhase.GUESS_TWO;
        console.log("Moving to second guess phase.");
        break;
      case TurnPhase.GUESS_TWO:
        this.currentPhase = TurnPhase.SCORING;
        console.log("Round over! Moving to scoring.");
        // We'll return results to GameManager from here in the future
        break;
      case TurnPhase.SCORING:
        console.log("Scoring is complete. Ready for next round.");
        this.clueGiver.isClueGiver = false; // Reset clue giver status
        break;
    }
  }
}
