import { Player } from '../src/domain/Player';

describe('Player', () => {
  let player: Player;

  beforeEach(() => {
    // A fresh player is created before each test in this file
    player = new Player('1', 'Alice', 'socket123', 'RED', 'http://example.com/avatar.jpg');
  });

  describe('Initialization', () => {
    test('should properly assign the player name', () => {
      expect(player.playerName).toBe('Alice');
    });

    test('should properly assign the user ID', () => {
      expect(player.userId).toBe('1');
    });

    test('should properly assign the socket ID', () => {
      expect(player.socketId).toBe('socket123');
    });

    test('should default score to 0', () => {
      expect(player.score).toBe(0);
    });

    test('should default isClueGiver to false', () => {
      expect(player.isClueGiver).toBe(false);
    });

    test('should default yourTurn to false', () => {
      expect(player.yourTurn).toBe(false);
    });
  });

  describe('Database Serialization (toDocument)', () => {
    test('should export the correct document structure for the database', () => {
      const doc = player.toDocument();
      
      expect(doc).toEqual({
        userId: '1',
        playerName: 'Alice',
        socketId: 'socket123',
        score: 0,
        isClueGiver: false,
        _piecesRemaining: 2,
      });
    });
  });

  describe('Database Rehydration (fromDocument)', () => {
    test('should accurately reconstruct a Player from a database document', () => {
      const mockDoc = {
        userId: '1',
        playerName: 'Alice',
        socketId: 'socket123',
        score: 15,
        isClueGiver: true,
        _piecesRemaining: 2
      };

      const rehydratedPlayer = Player.fromDocument(mockDoc, 'BLUE', 'http://example.com/blue.jpg');
      
      // 3. Assert: Verify the player absorbed the database states and the new constructor args
      expect(rehydratedPlayer.userId).toBe('1');
      expect(rehydratedPlayer.score).toBe(15);
      expect(rehydratedPlayer.isClueGiver).toBe(true);
      expect(rehydratedPlayer.pieceColor).toBe('BLUE');
      expect(rehydratedPlayer.profileUrl).toBe('http://example.com/blue.jpg');
    });
  });
});