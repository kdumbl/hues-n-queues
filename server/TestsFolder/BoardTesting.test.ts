import { Board } from '../src/domain/Board';
import { Player } from '../src/domain/Player';

describe('Board', () => {
  let board: Board;
  let testPlayer: Player;

  beforeEach(() => {
    // A fresh board and player are created before each test
    board = new Board();
    testPlayer = new Player('user123', 'TestPlayer', 'socket123', 'RED', 'http://example.com/avatar.jpg'); 
  });

  describe('Initialization', () => {
    test('should initialize a grid with exactly 16 rows', () => {
      expect(board.grid.length).toBe(16);
    });

    test('should initialize a grid with exactly 30 columns', () => {
      expect(board.grid[0].length).toBe(30);
    });

    test('should initialize an empty board with 0 occupied spaces', () => {
      expect(board.toDocument().occupiedSpaces.length).toBe(0);
    });
  });

  describe('placePiece()', () => {
    test('should return true when a piece is placed within valid bounds (e.g., 0, 0)', () => {
      const success = board.placePiece(0, 0, testPlayer.userId);
      expect(success).toBe(true);
    });

    test('should update the grid cell with the correct player ID upon valid placement', () => {
      board.placePiece(0, 0, testPlayer.userId);
      expect(board.grid[0][0]).toBe(testPlayer.userId);
    });

    test('should return false for an invalid negative coordinate', () => {
      const success = board.placePiece(-1, 5, testPlayer.userId);
      expect(success).toBe(false);
    });

    test('should return false for an x-coordinate out of bounds (>= 30)', () => {
      const success = board.placePiece(30, 5, testPlayer.userId);
      expect(success).toBe(false);
    });

    test('should return false for a y-coordinate out of bounds (>= 16)', () => {
      const success = board.placePiece(10, 16, testPlayer.userId);
      expect(success).toBe(false);
    });

    test('should not add to occupied spaces if placement is out of bounds', () => {
      board.placePiece(99, 99, testPlayer.userId);
      expect(board.toDocument().occupiedSpaces.length).toBe(0);
    });
  });

  describe('resetBoard()', () => {
    test('should clear all previously occupied spaces back to null', () => {
      
      board.placePiece(0, 0, testPlayer.userId); // x=0, y=0
      board.placePiece(2, 1, testPlayer.userId); // x=2, y=1
      board.resetBoard();

      // 3. Assert: Verify the specific spots are null again
      expect(board.grid[0][0]).toBeNull();
      expect(board.grid[1][2]).toBeNull(); 
    });

    test('should result in exactly 0 occupied spaces in the document output', () => {
    
      board.placePiece(5, 5, testPlayer.userId);
      board.resetBoard();
      expect(board.toDocument().occupiedSpaces.length).toBe(0);
    });
  });
});