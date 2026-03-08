export interface ClientGameState {
  //client described state of game
  self: Player;
  otherPlayers: Player[] | null;
}

export interface Player {
  name: string;
  socketId: string;
  score: number;
  piece: {
    x: number | null;
    y: number | null;
  };
}
