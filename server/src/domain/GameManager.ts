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
  public players: Player[];
  public board: Board;
  public currentTurnManager?: TurnManager;
  public gameState: GameState;
  private currentClueGiverIndex: number = 0;
  private roundsHosted: Map<string, number>;

  constructor() {
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

    // CRITICAL FIX: Reset ALL players before assigning the new Clue Giver
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

  public submitClue(socketId: string, clueText: string, colorIndex?: number) {
    console.log(`submitClue called with clueText: "${clueText}" and colorIndex: ${colorIndex}`);
    if (!this.currentTurnManager) throw new Error("No active round");
    
    if (colorIndex !== undefined && this.currentTurnManager.currentPhase === "CLUE_ONE") {
      this.currentTurnManager.setTarget(colorIndex);
    }

    const isValid = this.currentTurnManager.validateClue(clueText);
    if (isValid) {
      this.currentTurnManager.resolveRound();
      // CRITICAL FIX: Pass the turn from Clue Giver to all Guessers
      this.players.forEach(p => {
        p.yourTurn = !p.isClueGiver;
      });
    }
    return isValid;
  }

  public submitGuess(socketId: string, positionIndex: number) {
    if (!this.currentTurnManager) throw new Error("No active round");
    const player = this.getPlayerBySocketId(socketId);
    
    // Safety check: ensure it is actually this player's turn
    if (!player || !player.yourTurn || player.isClueGiver) return;

    const x = positionIndex % 30;
    const y = Math.floor(positionIndex / 30);
    const coordString = `${y}-${x}`; // Using numeric string format

    const success = this.board.placePiece(x, y, player.userId);
    if (success) {
      this.currentTurnManager.receiveGuess(player, coordString);
      
      // Check if this player has used both pieces
      const playerGuesses = this.currentTurnManager.roundGuesses.get(player);
      if (playerGuesses && playerGuesses.length >= 2) {
        player.yourTurn = false; 
      }

      if (this.currentTurnManager.allPlayersGuessed(this.players.length)) {
        this.currentTurnManager.resolveRound();
        // Return turn to Clue Giver for Clue 2 or final scoring
        const giver = this.players.find(p => p.isClueGiver);
        if (giver) giver.yourTurn = true;
      }
    }
  }

  public endRoundAndScore() {
    if (!this.currentTurnManager) return;
    const scores = this.currentTurnManager.resolveRound();
    if (scores) {
      this.updateTotalScores(scores);
      this.startNewRound();
    }
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