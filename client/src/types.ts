export interface GameState {
  //client described state of gamef
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

export type View = "board" | "game";
