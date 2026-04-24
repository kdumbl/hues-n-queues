import { error } from "node:console";
import { GameManager } from "./domain/GameManager";

const games = new Map<string, GameManager>();

export const tempGame = new GameManager("tempgame");

export function createGame(): string {
  const gameId = generateGameId();
  const game = new GameManager(gameId);
  games.set(gameId, game);
  return gameId;
}

export function getGame(gameId: string) {
  const game = games.get(gameId);
  if(game){
    return game;
  } else{
    throw new Error("no game found");
  }
}

export function deleteGame(gameId: string) {
  games.delete(gameId);
}

function generateGameId(): string {
  return Math.random().toString(36).substring(2, 8); 
}
