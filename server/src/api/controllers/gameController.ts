import { GameState, Player } from "../types";
import { GameManager } from "../../domain/GameManager";
import { GameRepository } from "../../persistence/repositories/GameRepository";
import { UserRepository } from "../../persistence/repositories/UserRepository";

import { GameMapper } from "../../persistence/mappers/GameMapper";

import { getGame, createGame, deleteGame } from "../../gameStore";

import { GameDoc, PlayerDoc } from "../../persistence/docs";

//Will use the domain logic to actually execute functionality
//can be used by sockets and http if needed
//take master game state and convert to local

export class gameController {
  public static initializeGame(gameId: string) {
    createGame(gameId);
    const game: GameManager = getGame(gameId);
  }

  //takes a game and and a user and converts to a local gamestate
  //may need to chage this to userid
  public static gameManagerToLocalGameState(gameId: string, socketId: string) {
    const masterDoc: GameDoc = GameMapper.toDocument(getGame(gameId));
    const localDoc: GameState = {} as GameState;
    //converts
    for (let i = 0; i < masterDoc.players.length; i++) {
      let masterPlayer: PlayerDoc = masterDoc.players[i];

      let pieces = pieceFinder(masterDoc.board.grid, masterPlayer.userId);

      //we need to rework this state. We should not include socketID in player object.s
      const localPlayer: Player = {
        name: masterPlayer.playerName,
        socketId: masterPlayer.socketId,
        pieceColor: `${i}`,
        profileURL: "",
        isClueGiver: masterPlayer.isClueGiver,
        yourTurn: true,
        score: masterPlayer.score,
        clue: masterDoc.currentTurnManager?.currentClues[0],
        piece: pieces[0],
        secondPiece: pieces[1],
      };
      localDoc.players[i] = localPlayer;
    }
  }
}

//board is 16*30 array of null or userid
//this find and returns a list of two pieces objects if they exist and a null if not
function pieceFinder(board, userId): any {
  let pieces: (number | null)[] = [null, null, null, null];

  let first = true;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] == userId && first) {
        pieces[0] = col;
        pieces[1] = row;
        first = false;
      } else if (board[row][col] == userId && !first) {
        pieces[2] = col;
        pieces[3] = row;
      }
    }
  }

  let piece1;
  if (pieces[0] == null) {
    piece1 = null;
  } else {
    piece1 = {
      x: pieces[0],
      y: pieces[1],
    };
  }

  let piece2;
  if (pieces[2] == null) {
    piece2 = null;
  } else {
    piece2 = {
      x: pieces[2],
      y: pieces[3],
    };
  }

  return [piece1, piece2];
}
