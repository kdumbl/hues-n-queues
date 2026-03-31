import { GameState } from "../types";
import { GameManager } from "../../domain/GameManager";
import { GameRepository } from "../../persistence/repositories/GameRepository";
import { UserRepository } from "../../persistence/repositories/UserRepository";

import { GameMapper } from "../../persistence/mappers/GameMapper";

import { getGame, createGame, deleteGame } from "../../gameStore";

import { GameDoc } from "../../persistence/docs";

//Will use the domain logic to actually execute functionality
//can be used by sockets and http if needed
//take master game state and convert to local

export class gameController {
  public static initializeGame(gameId: string) {
    createGame(gameId);
    const game: GameManager = getGame(gameId);
  }

  //takes a game and and a user and converts to a local gamestate
  public static gameManagerToLocalGameState(gameId: string, userId: string) {
    doc = GameMapper.toDocument(getGame(gameId));
  }
}
