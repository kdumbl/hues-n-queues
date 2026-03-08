//interfaces for the mongoose docs
export interface ColorOptionDoc {
  optionID: number;
  hexCode: string;
  gridCoordinates: string;
}

export interface ColorCardDoc {
  cardID: number;
  options: ColorOptionDoc[];
}

export interface PlayerDoc {
  playerName: string;
  userId: string;
  socketId: string;
  score: number;
  isClueGiver: boolean;
  _piecesRemaining: number;
}

export interface BoardDoc {
  grid: Record<string, GridCellDoc>;
  occupiedSpaces: string[];
}

export interface GridCellDoc {
  hexCode: string;
  occupiedBy: string | null;
}

export type TurnPhase =
  | "CLUE_ONE"
  | "GUESS_ONE"
  | "CLUE_TWO"
  | "GUESS_TWO"
  | "SCORING";

export interface TurnDoc {
  clueGiver: PlayerDoc;
  activeCard: ColorCardDoc;
  targetOption: ColorOptionDoc | undefined;
  currentPhase: TurnPhase;
  currentClues: string[];
  roundGuesses: Record<string, string[]>; //userId -> guesses
}

export type GameState = "SETUP" | "ACTIVE" | "END";

export interface GameDoc {
  players: PlayerDoc[];
  board: BoardDoc;
  currentTurnManager: TurnDoc | undefined;
  gameState: GameState;
  currentClueGiverIndex: number;
  roundsHosted: Record<string, number>; //string is userId
}

export interface UserDoc {
  username: string;
  email: string;
  passwordhash: string;
}
