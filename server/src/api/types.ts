export interface ClientGameState {
  //client described state of game
  self: Player;
  otherPlayers: Player[] | null;
  correctColorIndex: number;
}

export interface Player {
  name: string;
  socketId: string;
  pieceAddress: string;
  profileURL: string;
  isClueGiver: boolean;
  yourTurn: boolean
  score: number;
  piece: {
    x: number | null;
    y: number | null;
  };
  secondPiece: {
    x: number | null;
    y: number | null;
  };
}
