import { Player } from "./Player";
import { ColorCard } from "./ColorCard";
import { ColorOption } from "./ColorOption";
import { ScoringCalc } from "./ScoringCalc";
import { TurnDoc } from "../persistence/docs";

enum TurnPhase {
  CLUE_ONE = "CLUE_ONE",
  GUESS_ONE = "GUESS_ONE",
  CLUE_TWO = "CLUE_TWO",
  GUESS_TWO = "GUESS_TWO",
  SCORING = "SCORING",
}

export class TurnManager {
  public clueGiver: Player;
  public activeCard: ColorCard;
  public targetOption?: ColorOption;
  public currentPhase: TurnPhase;
  public currentClues: string[] = [];
  public roundGuesses: Map<Player, string[]> = new Map();

  constructor(clueGiver: Player, activeCard: ColorCard) {
    this.clueGiver = clueGiver;
    this.activeCard = activeCard;
    this.currentPhase = TurnPhase.CLUE_ONE;
    this.clueGiver.isClueGiver = true;
  }

  public allPlayersGuessed(totalPlayers: number): boolean {
    // If not everyone has guessed at least once, return false
    if (this.roundGuesses.size !== totalPlayers - 1) return false;
    
    // Determine how many guesses each player SHOULD have based on the phase
    const expectedGuesses = this.currentPhase === TurnPhase.GUESS_ONE ? 1 : 2;
    
    // Check if every guesser has reached the expected amount
    for (const guesses of this.roundGuesses.values()) {
      if (guesses.length < expectedGuesses) return false;
    }
    return true;
  }

public forceScoring(): Map<Player, number> | null {
    // If we already hit the scoring phase naturally, prevent double counting
    //if (this.currentPhase === TurnPhase.SCORING) {
    //  return null; 
    //}
    this.currentPhase = TurnPhase.SCORING;
    return this.calculateScores();
  }

  public getTargetIndex(): number | undefined {
    if (!this.targetOption) return undefined;
    // FIX: Parse numeric gridCoordinates string "y-x" or letter "A-x"
    const parts = this.targetOption.gridCoordinates.split("-");
    const y = isNaN(parseInt(parts[0])) ? parts[0].toUpperCase().charCodeAt(0) - 65 : parseInt(parts[0], 10);
    const x = parseInt(parts[1], 10);
    return y * 30 + x;
  }

public setTarget(boardIndex: number): void {
    // The frontend sends an absolute board index (0-479) instead of a card option index (0-3).
    // We calculate the Y and X coordinates directly to match the format calculateScores expects.
    const x = boardIndex % 30;
    const y = Math.floor(boardIndex / 30);
    
    // We mock a ColorOption object so calculateScores can read the gridCoordinates
    this.targetOption = {
      gridCoordinates: `${y}-${x}`
    } as any; 
  }

  public validateClue(cue: string): boolean {
    const lowerCue = cue.toLowerCase().trim();
    const forbiddenWords = ["red", "blue", "yellow", "green", "orange", "purple", "black", "white", "brown", "pink", "titty"];
    if (forbiddenWords.some((word) => lowerCue.includes(word))) return false;

    // FIX: Regex now allows numeric strings like "14-5"
    const coordinateRegex = /^([a-pA-P]|\d{1,2})-?\d{1,2}$/;
    if (coordinateRegex.test(lowerCue)) return false;

    this.currentClues.push(cue);
    return true;
  }

  public receiveGuess(player: Player, coordinate: string): void {
    if (player === this.clueGiver) return;
    if (!this.roundGuesses.has(player)) this.roundGuesses.set(player, []);
    this.roundGuesses.get(player)!.push(coordinate);
  }

  private calculateScores(): Map<Player, number> {
    const roundScores = new Map<Player, number>();
    let clueGiverPoints = 0;
    if (!this.targetOption) return roundScores;

    // Standardize target to object {x, y}
    const parts = this.targetOption.gridCoordinates.split("-");
    const targetY = isNaN(parseInt(parts[0])) ? parts[0].toUpperCase().charCodeAt(0) - 65 : parseInt(parts[0], 10);
    const targetObj = { y: targetY, x: parseInt(parts[1], 10) };

    for (const [player, guesses] of this.roundGuesses.entries()) {
      let playerTotal = 0;
      for (const guess of guesses) {
        const pts = ScoringCalc.calculate(targetObj, guess);
        playerTotal += pts;
        if (pts >= 2) clueGiverPoints += 1;
      }
      roundScores.set(player, playerTotal);
    }
    roundScores.set(this.clueGiver, Math.min(clueGiverPoints, 9));
    return roundScores;
  }

  public resolveRound(): Map<Player, number> | null {
    const phases = [TurnPhase.CLUE_ONE, TurnPhase.GUESS_ONE, TurnPhase.CLUE_TWO, TurnPhase.GUESS_TWO, TurnPhase.SCORING];
    const currentIndex = phases.indexOf(this.currentPhase);
    this.currentPhase = phases[currentIndex + 1] || TurnPhase.SCORING;

    if (this.currentPhase === TurnPhase.SCORING) {
      return this.calculateScores();
    }
    return null;
  }

  public toDocument(): TurnDoc {
    const guesses: Record<string, string[]> = {};
    this.roundGuesses.forEach((arr, player) => { guesses[player.userId] = [...arr]; });
    return {
      clueGiver: this.clueGiver.toDocument(),
      activeCard: this.activeCard.toDocument(),
      targetOption: this.targetOption?.toDocument(),
      currentPhase: this.currentPhase,
      currentClues: [...this.currentClues],
      roundGuesses: guesses,
    };
  }

  public static fromDocument(doc: TurnDoc, playerMap: Map<string, Player>): TurnManager {
    const tm = new TurnManager(playerMap.get(doc.clueGiver.userId)!, ColorCard.fromDocument(doc.activeCard));
    tm.currentPhase = doc.currentPhase as TurnPhase;
    tm.currentClues = [...doc.currentClues];
    tm.targetOption = doc.targetOption ? ColorOption.fromDocument(doc.targetOption) : undefined;
    for (const id in doc.roundGuesses) {
      if (playerMap.has(id)) tm.roundGuesses.set(playerMap.get(id)!, [...doc.roundGuesses[id]]);
    }
    return tm;
  }
}