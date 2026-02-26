import { Board } from '../src/Models/Board';
import { Player } from '../src/Models/Player';
import { ColorOption } from '../src/Models/ColorOption';

describe('Board', () => {
  let board: Board;
  let testPlayer: Player;

  beforeEach(() => {
    board = new Board();
    testPlayer = new Player('TestPlayer');
  });

  test('should initialize a grid based on the MASTER_PALETTE dimensions', () => {
    const rows = ColorOption.MASTER_PALETTE.length;
    const cols = ColorOption.MASTER_PALETTE[0].length;
    const totalSpaces = rows * cols;
    
    expect(board.grid.size).toBe(totalSpaces);
    expect(board.isValidPlacement('A-0')).toBe(true);
  });

  test('getCoordinateColor should return correct hex code or undefined', () => {
    // A-0 corresponds to row 0, col 0 in the palette
    const expectedColor = ColorOption.MASTER_PALETTE[0][0];
    expect(board.getCoordinateColor('A-0')).toBe(expectedColor);
    expect(board.getCoordinateColor('Z-99')).toBeUndefined();
  });

  test('isValidPlacement should return true for valid coords and false for invalid', () => {
    expect(board.isValidPlacement('A-0')).toBe(true); // Valid
    expect(board.isValidPlacement('Z-99')).toBe(false); // Invalid
  });

  test('placePiece should successfully place a player on a valid coordinate', () => {
    const success = board.placePiece('A-0', testPlayer);
    
    expect(success).toBe(true);
    expect(board.occupiedSpaces).toContain('A-0');
    expect(board.grid.get('A-0')?.occupiedBy).toBe(testPlayer);
  });

  test('placePiece should fail on an invalid coordinate', () => {
    const success = board.placePiece('Z-99', testPlayer);
    
    expect(success).toBe(false);
    expect(board.occupiedSpaces.length).toBe(0);
  });

  test('resetBoard should clear all occupied spaces', () => {
    board.placePiece('A-0', testPlayer);
    board.placePiece('B-2', testPlayer);
    
    expect(board.occupiedSpaces.length).toBe(2);
    
    board.resetBoard();
    
    expect(board.occupiedSpaces.length).toBe(0);
    expect(board.grid.get('A-0')?.occupiedBy).toBeNull();
    expect(board.grid.get('B-2')?.occupiedBy).toBeNull();
  });
});