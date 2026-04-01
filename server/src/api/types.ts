export interface GameState {
  //client described state of game
  self: Player;
  otherPlayers: Player[];
}

export interface Player {
  name: string;
  socketId: string;
  pieceColor: string;
  profileURL: string;
  isClueGiver: boolean;
  yourTurn: boolean
  score: number;
  piece: {
    x: number;
    y: number;
  } | null;
  secondPiece: {
    x: number;
    y: number;
  } | null;
}
