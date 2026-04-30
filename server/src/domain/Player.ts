import { PlayerDoc } from "../persistence/docs";

export class Player {
  public userId: string;
  public playerName: string;
  public socketId: string;
  public score: number = 0;
  public isClueGiver: boolean = false;
  
  // UI-specific attributes required by GameState DTO
  public pieceColor: string;
  public profileUrl: string = "";
  public yourTurn: boolean = false;

  constructor(userId: string, playerName: string, socketId: string, pieceColor: string, profileUrl: string) {
    this.userId = userId;
    this.playerName = playerName;
    this.socketId = socketId;
    this.pieceColor = pieceColor;
    this.profileUrl = profileUrl;
  }

  public resetPieces(): void {
  }

  /**
   * Converts domain player to a database document.
   */
  public toDocument(): PlayerDoc {
    return {
      userId: this.userId,
      playerName: this.playerName,
      socketId: this.socketId,
      score: this.score,
      isClueGiver: this.isClueGiver,
      _piecesRemaining: 2,
    };
  }

  /**
   * Rehydrates a Player from a document.
   */
  public static fromDocument(doc: PlayerDoc, pieceColor: string = "RED", profileUrl = ""): Player {
    const player = new Player(doc.userId, doc.playerName, doc.socketId, pieceColor, profileUrl);
    player.score = doc.score;
    player.isClueGiver = doc.isClueGiver;
    return player;
  }
}