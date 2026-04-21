import { Board } from '../src/domain/Board';
import { Player } from '../src/domain/Player';
import { ColorOption } from '../src/domain/ColorOption';

describe('Board', () => {
  let board: Board;
  let testPlayer: Player;

  beforeEach(() => {
    board = new Board();
    testPlayer = new Player('user123', 'TestPlayer', 'socket123'); 
  });

  test('should initialize a grid based on the MASTER_PALETTE dimensions', () => {
    const rows = ColorOption.MASTER_PALETTE.length;
    const cols = ColorOption.MASTER_PALETTE[0].length;
    
    try {
      expect(board.grid.length).toBe(rows);
    } catch (e) {
      throw new Error("Does not initialize board with correct number of rows");
    }
    try {
      expect(board.grid[0].length).toBe(cols);
    } catch (e) {
      throw new Error("Does not initialize board with correct number of columns");
    }
    try {
      expect(board.isValidPlacement('A-0')).toBe(true);
    } catch (e) {
      throw new Error("Does not recognize valid grid spaces");
    }
  });

  test('getCoordinateColor should return correct hex code or undefined', () => {
    // A-0 corresponds to row 0, col 0 in the palette
    const expectedColor = ColorOption.MASTER_PALETTE[0][0];
    try {
      expect(board.getCoordinateColor('A-0')).toBe(expectedColor);
    } catch (e) {
      throw new Error("Does not return correct hex value of valid colored space");
    }
    try {
      expect(board.getCoordinateColor('Z-99')).toBeUndefined();
    } catch (e) {
      throw new Error("Does not return undefined for invalid grid space");
    }
  });

  test('isValidPlacement should return true for valid coords and false for invalid', () => {
    try {
      expect(board.isValidPlacement('A-0')).toBe(true);
    } catch (e) {
      throw new Error("Does not recognize when a grid space is valid");
    }
    try {
      expect(board.isValidPlacement('Z-99')).toBe(false);
    } catch (e) {
      throw new Error("Does not recognize when a grid space is invalid");
    }
  });

  test('placePiece should successfully place a player on a valid coordinate', () => {
    const success = board.placePiece('A-0', testPlayer);

    try {
      expect(success).toBe(true);
    } catch (e) {
      throw new Error("Error occurs when placing piece in valid location");
    }
    try {
      expect(board.occupiedSpaces).toContain('A-0');
    } catch (e) {
      throw new Error("Does not recognize when a grid location currently has a piece on it");
    }
    try {
      expect(board.grid[0][0]).toBe(testPlayer.userId); 
    } catch (e) {
      throw new Error("Does not return correct player ID of occupied space");
    }
  });

  test('placePiece should fail on an invalid coordinate', () => {
    const success = board.placePiece('Z-99', testPlayer);

    try {
      expect(success).toBe(false);
    } catch (e) {
      throw new Error("Allows player to place piece in invalid location");
    }
    try {
      expect(board.occupiedSpaces.length).toBe(0);
    } catch (e) {
      throw new Error("Incorrectly registers chosen (invalid) location as occupied upon attempted placement");
    }
    
  });

  test('resetBoard should clear all occupied spaces', () => {
    board.placePiece('A-0', testPlayer); // row 0, col 0
    board.placePiece('B-2', testPlayer); // row 1, col 2

    try {
      expect(board.occupiedSpaces.length).toBe(2);
    } catch (e) {
      throw new Error("Does not correctly register placed pieces as occupied");
    }
    
    board.resetBoard();

    try {
      expect(board.occupiedSpaces.length).toBe(0);
    } catch (e) {
      throw new Error("Resetting board does not remove occupation of all spaces");
    }
    try {
      expect(board.grid[0][0]).toBeNull();
    } catch (e) {
      throw new Error("Resetting board does not remove piece associated with initial space");
    }
    try {
      expect(board.grid[1][2]).toBeNull();
    } catch (e) {
      throw new Error("Resetting board does not remove piece associated with later spaces");
    }

  });
});