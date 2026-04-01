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
    
    expect(board.grid.length).toBe(rows);
    expect(board.grid[0].length).toBe(cols);
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
    // 'A' is row 0, '0' is col 0
    expect(board.grid[0][0]).toBe(testPlayer.userId); 
  });

  test('placePiece should fail on an invalid coordinate', () => {
    const success = board.placePiece('Z-99', testPlayer);
    
    expect(success).toBe(false);
    expect(board.occupiedSpaces.length).toBe(0);
  });

  test('resetBoard should clear all occupied spaces', () => {
    board.placePiece('A-0', testPlayer); // row 0, col 0
    board.placePiece('B-2', testPlayer); // row 1, col 2
    
    expect(board.occupiedSpaces.length).toBe(2);
    
    board.resetBoard();
    
    expect(board.occupiedSpaces.length).toBe(0);
    expect(board.grid[0][0]).toBeNull();
    expect(board.grid[1][2]).toBeNull();
  });
});