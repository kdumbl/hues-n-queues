import { PlayerDoc } from "../persistence/docs";

export class Player {
  public userId: string;
  public playerName: string;
  public socketId: string;
  public score: number = 0;
  public isClueGiver: boolean = false;
  
  // UI-specific attributes required by GameState DTO
  public pieceColor: string;
  public profileURL: string = "";
  public yourTurn: boolean = false;

  constructor(userId: string, playerName: string, socketId: string, pieceColor: string) {
    this.userId = userId;
    this.playerName = playerName;
    this.socketId = socketId;
    this.pieceColor = pieceColor;
  }

  public resetPieces(): void {
    // Logic for clearing local state if necessary
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
      _piecesRemaining: 2, // This is a transient field for game logic, not stored in DB but required by the interface
    };
  }

  /**
   * Rehydrates a Player from a document.
   * Note: Since pieceColor isn't in the DB PlayerDoc, we provide a default 
   * or allow the Mapper to assign it during game load.
   */
  public static fromDocument(doc: PlayerDoc, pieceColor: string = "RED"): Player {
    const player = new Player(doc.userId, doc.playerName, doc.socketId, pieceColor);
    player.score = doc.score;
    player.isClueGiver = doc.isClueGiver;
    return player;
  }
}