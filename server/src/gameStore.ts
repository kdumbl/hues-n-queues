import { GameManager } from "./domain/GameManager";

const games = new Map<string, GameManager>();

//for testing just one game instance at a time.
export const tempGame = new GameManager();

//will need to add a game id to gamemanager class
export function createGame(gameId: string) {
  //const game = new GameManager();
  //does nothing for now just uses tempGame
}

export function getGame(gameId: string) {
  //return games.get(gameId);
  return tempGame;
}

export function deleteGame(gameId: string) {
  games.delete(gameId);
}
