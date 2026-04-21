import {Player} from '../src/domain/Player';
import {ColorCard} from '../src/domain/ColorCard';

"'npm test' to run all tests in this folder."

describe('Player', () => {
  let player: Player;

  beforeEach(() => {
    player = new Player('1','Alice', "socket123");
  });

  test('should initialize with correct default values', () => {
    try {
      expect(player.playerName).toBe('Alice');
    } catch (e) {
      throw new Error("Does not correctly initialize player name");
    }
    try {
      expect(player.score).toBe(0);
    } catch (e) {
      throw new Error("Does not correctly initialize player score");
    }
    try {
      expect(player.isClueGiver).toBe(false);
    } catch (e) {
      throw new Error("Does not correctly initialize player's game status");
    }
    try {
      expect(player.piecesRemaining).toBe(2);
    } catch (e) {
      throw new Error("Does not correctly initialize player's pieces remaining");
    }
  });

  test('placePiece should decrement piecesRemaining', () => {
    player.placePiece();
    try {
      expect(player.piecesRemaining).toBe(1);
    } catch (e) {
      throw new Error("Does not correctly decrement player's pieces remaining after first placement");
    }
    player.placePiece();
    try {
      expect(player.piecesRemaining).toBe(0);
    } catch (e) {
      throw new Error("Does not correctly decrement player's pieces remaining after second placement");
    }
  });

  test('placePiece should not decrement below 0', () => {
    player.placePiece();
    player.placePiece();
    player.placePiece(); // 3rd attempt
    expect(player.piecesRemaining).toBe(0);
  });

  test('resetPieces should restore pieces to 2', () => {
    player.placePiece();
    player.resetPieces();
    expect(player.piecesRemaining).toBe(2);
  });

  test('giveClue should return the clue string', () => {
    const clue = player.giveClue('Ocean');
    expect(clue).toBe('Ocean');
  });

  test('pickColor should return undefined if not ClueGiver', () => {
    const card = new ColorCard(1);
    expect(player.pickColor(card, 0)).toBeUndefined();
  });

  test('pickColor should return an option if isClueGiver is true', () => {
    player.isClueGiver = true;
    const card = new ColorCard(1);
    const option = player.pickColor(card, 0);
    try {
       expect(option).toBeDefined();
    } catch (e) {
      throw new Error("Does not return properly initialized valid option when player is clue giver");
    }
    try {
      expect(option?.optionID).toBe(0);
    } catch (e) {
      throw new Error("Does not correctly assign option ID");
    }
  });
});