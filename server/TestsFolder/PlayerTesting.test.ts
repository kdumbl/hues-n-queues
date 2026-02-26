import {Player} from '../src/Models/Player';
import {ColorCard} from '../src/Models/ColorCard';

describe('Player', () => {
  let player: Player;

  beforeEach(() => {
    player = new Player('Alice');
  });

  test('should initialize with correct default values', () => {
    expect(player.playerName).toBe('Alice');
    expect(player.score).toBe(0);
    expect(player.isClueGiver).toBe(false);
    expect(player.piecesRemaining).toBe(2);
  });

  test('placePiece should decrement piecesRemaining', () => {
    player.placePiece();
    expect(player.piecesRemaining).toBe(1);
    player.placePiece();
    expect(player.piecesRemaining).toBe(0);
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
    expect(option).toBeDefined();
    expect(option?.optionID).toBe(0);
  });
});