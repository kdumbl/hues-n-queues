import { Player } from "./Player";
import { ColorCard } from "./ColorCard";
import { ColorOption } from "./ColorOption";
import { ScoringCalc } from "./ScoringCalc";

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
   * Evaluates all guesses, calculates points for guessers and the clue giver,
   * and returns a Map to be consumed by the GameManager.
   */
  private calculateScores(): Map<Player, number> {
    const roundScores = new Map<Player, number>();
    let clueGiverPoints = 0;

    if (!this.targetOption) {
      console.error("Cannot score: No target option was set.");
      return roundScores;
    }

    const targetCoord = this.targetOption.gridCoordinates;

    for (const [player, guesses] of this.roundGuesses.entries()) {
      let playerTotal = 0;

      for (const guess of guesses) {
        const pts = ScoringCalc.calculate(targetCoord, guess);
        playerTotal += pts;

        // If a guess scores 2 or 3 points, it is inside the 3x3 frame.
        // The clue giver gets 1 point for each of these pieces.
        if (pts >= 2) {
          clueGiverPoints += 1;
        }
      }
      roundScores.set(player, playerTotal);
    }

    // Enforce the max of 9 points for the clue giver
    if (clueGiverPoints > 9) {
      clueGiverPoints = 9;
    }

    roundScores.set(this.clueGiver, clueGiverPoints);
    console.log(
      `[Scoring] ${this.clueGiver.playerName} (Clue Giver) earned ${clueGiverPoints} points.`,
    );

    return roundScores;
  }

  /**
   * Advances the phase or triggers scoring based on the current state.
   * Returns a Map of scores ONLY when the phase shifts to SCORING, otherwise null.
   */
  public resolveRound(): Map<Player, number> | null {
    switch (this.currentPhase) {
      case TurnPhase.CLUE_ONE:
        this.currentPhase = TurnPhase.GUESS_ONE;
        console.log("Moving to first guess phase.");
        return null;
      case TurnPhase.GUESS_ONE:
        this.currentPhase = TurnPhase.CLUE_TWO;
        console.log("Moving to second clue phase.");
        return null;
      case TurnPhase.CLUE_TWO:
        this.currentPhase = TurnPhase.GUESS_TWO;
        console.log("Moving to second guess phase.");
        return null;
      case TurnPhase.GUESS_TWO:
        this.currentPhase = TurnPhase.SCORING;
        console.log("Round over! Calculating scores...");
        const scores = this.calculateScores();
        this.clueGiver.isClueGiver = false; // Clean up role
        return scores;
      case TurnPhase.SCORING:
        console.log("Scoring is complete. Ready for next round.");
        return null;
    }
  }
}
