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
<<<<<<< Updated upstream
  clue: string | undefined;
=======
  clue: string;
  secondClue: string;
>>>>>>> Stashed changes
  piece: {
    x: number;
    y: number;
  } | null;
  secondPiece: {
    x: number;
    y: number;
  } | null;
}
