export interface GameState {
  //client described state of game
  players: Player[];
}

export interface Player {
  name: string;
  socketId: string;
  pieceColor: string;
  profileURL: string;
  isClueGiver: boolean;
  yourTurn: boolean;
  score: number;
  clue: string;
  secondClue: string;
  piece: {
    x: number,
    y: number,
  } | null;
  secondPiece: {
    x: number,
    y: number,
  } | null;
}


export type View = "login" | "game" | "lobby" | "lobbyroom" | "end";
