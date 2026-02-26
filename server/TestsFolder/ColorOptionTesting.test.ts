import { ColorOption } from '../src/Models/ColorOption';

describe('ColorOption', () => {
  test('should initialize with correct id, hexCode, and gridCoordinates', () => {
    const option = new ColorOption(1, '#612b0f', 'A-0');
    expect(option.optionID).toBe(1);
    expect(option.hexCode).toBe('#612b0f');
    expect(option.gridCoordinates).toBe('A-0');
  });

  test('createRandom should return a valid ColorOption from the MASTER_PALETTE', () => {
    const randomOption = ColorOption.createRandom(99);
    
    expect(randomOption).toBeInstanceOf(ColorOption);
    expect(randomOption.optionID).toBe(99);
    
    // Verify that the generated coordinate format is valid (e.g., A-12)
    expect(randomOption.gridCoordinates).toMatch(/^[A-P]-\d+$/);
    
    // Verify that the hex code is a string starting with '#'
    expect(randomOption.hexCode).toMatch(/^#[0-9a-fA-F]{6}$/);
  });
});