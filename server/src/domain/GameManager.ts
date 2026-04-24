import { Player } from "./Player";
import { Board } from "./Board";
import { ColorCard } from "./ColorCard";
import { TurnManager } from "./TurnManager";
import { GameDoc } from "../persistence/docs";

export enum GameState {
  SETUP = "SETUP",
  ACTIVE = "ACTIVE",
  END = "END",
}

export class GameManager {
  public gameId: string;
  public players: Player[];
  public board: Board;
  public currentTurnManager?: TurnManager;
  public gameState: GameState;
  private currentClueGiverIndex: number = 0;
  private roundsHosted: Map<string, number>;

  constructor(gameId: string) {
    this.gameId = gameId;
    this.players = [];
    this.board = new Board();
    this.roundsHosted = new Map();
    this.gameState = GameState.SETUP;
  }

  public setUpGame(players: Player[]): void {
    this.players = players;
    this.board = new Board();
    this.gameState = GameState.SETUP;
    this.roundsHosted = new Map();
    for (const player of players) {
      this.roundsHosted.set(player.userId, 0);
    }
  }

  public startGame(): void {
    this.gameState = GameState.ACTIVE;
    this.currentClueGiverIndex = 0;
    this.startNewRound();
  }

  public startNewRound(): void {
    if (this.checkGameOverCondition()) {
      this.gameState = GameState.END;
      return;
    }

    this.board.resetBoard();
    for (const player of this.players) {
      player.isClueGiver = false;
      player.yourTurn = false;
    }

    const clueGiver = this.players[this.currentClueGiverIndex];
    clueGiver.isClueGiver = true;
    clueGiver.yourTurn = true; // Clue giver starts the round by drawing/submitting

    const hostedCount = this.roundsHosted.get(clueGiver.userId) || 0;
    this.roundsHosted.set(clueGiver.userId, hostedCount + 1);

    const newCard = ColorCard.drawRandomCard();
    this.currentTurnManager = new TurnManager(clueGiver, newCard);

    this.currentClueGiverIndex = (this.currentClueGiverIndex + 1) % this.players.length;
  }

  public getPlayerBySocketId(socketId: string): Player | undefined {
    return this.players.find(p => p.socketId === socketId);
  }

  /**
   * Sequential Logic Change: When a clue is submitted, only the FIRST guesser 
   * following the clue giver is allowed to move.
   */
  public submitClue(socketId: string, clueText: string, colorIndex?: number) {
    if (!this.currentTurnManager) throw new Error("No active round");
    
    if (colorIndex !== undefined && this.currentTurnManager.currentPhase === "CLUE_ONE") {
      this.currentTurnManager.setTarget(colorIndex);
    }

    const isValid = this.currentTurnManager.validateClue(clueText);
    if (isValid) {
      this.currentTurnManager.resolveRound();
      
      // Reset everyone's turn
      this.players.forEach(p => p.yourTurn = false);
      
      // Find the first guesser after the current clue giver
      // (currentClueGiverIndex was already incremented at the start of the round,
      // so we use the clue giver's actual current index)
      const giverIndex = this.players.findIndex(p => p.isClueGiver);
      const firstGuesser = this.getNextGuesser(giverIndex + 1);
      if (firstGuesser) {
        firstGuesser.yourTurn = true;
      }
    }
    return isValid;
  }

  /**
   * Sequential Logic Change: After a successful guess, the turn is immediately
   * revoked from the current player and passed to the next guesser.
   */
  public submitGuess(socketId: string, positionIndex: number) {
    if (!this.currentTurnManager) throw new Error("No active round");
    const player = this.getPlayerBySocketId(socketId);
    
    if (!player || !player.yourTurn || player.isClueGiver) return;

    const x = positionIndex % 30;
    const y = Math.floor(positionIndex / 30);
    const coordString = `${y}-${x}`; 

    const success = this.board.placePiece(x, y, player.userId);
    if (success) {
      this.currentTurnManager.receiveGuess(player, coordString);
      
      // Revoke turn immediately after submission
      player.yourTurn = false; 

      if (this.currentTurnManager.allPlayersGuessed(this.players.length)) {
        // Capture the returned scores!
        const scores = this.currentTurnManager.resolveRound();
        
        if (scores) {
        }
        
        // Return turn to Clue Giver for Clue 2 or final scoring
        const giver = this.players.find(p => p.isClueGiver);
        if (giver) giver.yourTurn = true;
      } else {
        // Pass turn to the next player in the rotation
        const currentPlayerIndex = this.players.indexOf(player);
        const nextGuesser = this.getNextGuesser(currentPlayerIndex + 1);
        if (nextGuesser) {
          nextGuesser.yourTurn = true;
        }
      }
    }
  }

  /**
   * Helper to find the next player who is NOT the clue giver.
   */
  private getNextGuesser(startIndex: number): Player | undefined {
    for (let i = 0; i < this.players.length; i++) {
      const idx = (startIndex + i) % this.players.length;
      const p = this.players[idx];
      if (!p.isClueGiver) return p;
    }
    return undefined;
  }

  public endRoundAndScore() {
    if (!this.currentTurnManager) return;
    
    // Force scoring in case the button was clicked before everyone placed their final guess
    const scores = this.currentTurnManager.forceScoring();
    if (scores) {
      this.updateTotalScores(scores);
    }
    
    this.startNewRound();
  }

  public updateTotalScores(roundScores: Map<Player, number>): void {
    for (const [player, points] of roundScores.entries()) {
      player.score += points;
    }
  }

  private checkGameOverCondition(): boolean {
    const requiredRounds = this.players.length >= 7 ? 1 : 2;
    for (const player of this.players) {
      if ((this.roundsHosted.get(player.userId) || 0) < requiredRounds) return false;
    }
    return true;
  }

  public toDocument(): GameDoc {
    return {
      players: this.players.map(p => p.toDocument()),
      board: this.board.toDocument(),
      currentTurnManager: this.currentTurnManager?.toDocument(),
      gameState: this.gameState,
      currentClueGiverIndex: this.currentClueGiverIndex,
      roundsHosted: Object.fromEntries(this.roundsHosted)
    };
  }
}