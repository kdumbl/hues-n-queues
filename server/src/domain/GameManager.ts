import { Player } from "./Player";
import { Board } from "./Board";
import { ColorCard } from "./ColorCard";
import { TurnManager } from "./TurnManager";
// Enum to track the overarching state of the game
enum GameState {
  SETUP,
  ACTIVE,
  END,
}

export class GameManager {
  public players: Player[];
  public board: Board;
  public currentTurnManager: TurnManager | null = null;
  public gameState: GameState;

  // Internal trackers for game flow
  private currentClueGiverIndex: number = 0;
  private roundsHosted: Map<Player, number>;

  constructor(players: Player[]) {
    if (players.length < 3 || players.length > 10) {
      console.warn("The game is designed for 3 to 10 players.");
    }
    this.players = players;
    this.board = new Board();
    this.gameState = GameState.SETUP;

    // Initialize the tracker for how many times each player has been the clue giver
    this.roundsHosted = new Map();
    for (const player of players) {
      this.roundsHosted.set(player, 0);
    }
  }

  /**
   * Starts the game and kicks off the very first round.
   */
  public startGame(): void {
    console.log("Starting Hues and Cues!");
    this.gameState = GameState.ACTIVE;

    // Per the rules, the player with the most colorful outfit goes first.
    // In our digital version, we'll just start with the first player in the array.
    this.currentClueGiverIndex = 0;

    this.startNewRound();
  }

  /**
   * Creates a new TurnManager, rotates the Clue Giver role, and handles round resets.
   */
  public startNewRound(): void {
    // First, check if the game is over before starting a new round
    if (this.checkGameOverCondition()) {
      this.gameState = GameState.END;
      this.announceWinner();
      return;
    }

    // Clear board and return pieces to players for the new round
    this.board.resetBoard();
    for (const player of this.players) {
      player.resetPieces();
      player.isClueGiver = false; // Reset role for everyone
    }

    // Assign the new Clue Giver
    const clueGiver = this.players[this.currentClueGiverIndex];
    clueGiver.isClueGiver = true;

    // Update how many times this player has hosted
    const hostedCount = this.roundsHosted.get(clueGiver) || 0;
    this.roundsHosted.set(clueGiver, hostedCount + 1);

    console.log(`Starting new round. Clue giver is ${clueGiver.playerName}.`);

    // Draw a random card
    const newCard = ColorCard.drawRandomCard();

    // Initialize the turn manager for this round
    this.currentTurnManager = new TurnManager(clueGiver, newCard);

    // Advance the index so the next person hosts next round (clockwise rotation)
    this.currentClueGiverIndex =
      (this.currentClueGiverIndex + 1) % this.players.length;
  }

  /**
   * Called at the end of a round to update the master scoreboard.
   */
  public updateTotalScores(roundScores: Map<Player, number>): void {
    for (const [player, points] of roundScores.entries()) {
      player.score += points;
      console.log(
        `${player.playerName} earned ${points} points. Total score: ${player.score}`,
      );
    }
  }

  /**
   * Checks if the game is over based on the official rulebook.
   */
  public checkGameOverCondition(): boolean {
    // Rules: 4-6 players, play continues until each player has been cue giver twice.
    // 7 or more players, each person is cue giver once.
    const requiredRounds = this.players.length >= 7 ? 1 : 2;

    for (const player of this.players) {
      if ((this.roundsHosted.get(player) || 0) < requiredRounds) {
        return false; // Someone still needs to meet the requirement
      }
    }

    return true; // Everyone has hosted the required amount of times
  }

  /**
   * Helper method to determine and announce the winner.
   */
  private announceWinner(): void {
    console.log("The game has ended!");

    // Sort players descending by their total score
    const sortedPlayers = [...this.players].sort((a, b) => b.score - a.score);

    // In the event of a tie, the rules state the most recent cue giver wins,
    // which would require slightly more complex tie-breaker logic,
    // but for now we just take the top score.
    console.log(
      `The winner is ${sortedPlayers[0].playerName} with ${sortedPlayers[0].score} points!`,
    );
  }
}
