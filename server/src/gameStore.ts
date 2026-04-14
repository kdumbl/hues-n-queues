import { GameManager } from "./domain/GameManager";
import { Player } from "./domain/Player";

const games = new Map<string, GameManager>();

// Create the temporary game instance
export const tempGame = new GameManager();

/**
 * PLACEHOLDER LOGIC:
 * Initialize the game with 4 dummy players so you can test transitions.
 */
const placeholderPlayers = [
  new Player("user-1", "Red Player", "socket-1", "RED"),
  new Player("user-2", "Yellow Player", "socket-2", "YELLOW"),
  new Player("user-3", "Green Player", "socket-3", "GREEN"),
  new Player("user-4", "Blue Player", "socket-4", "BLUE")
];

// Set up the game with these players
tempGame.setUpGame(placeholderPlayers);

// Start the game immediately for testing (optional, or call this via a socket event)
tempGame.startGame();

export function createGame(gameId: string) {
  // Existing placeholder
}

export function getGame(gameId: string) {
  return tempGame;
}

export function deleteGame(gameId: string) {
  games.delete(gameId);
}
