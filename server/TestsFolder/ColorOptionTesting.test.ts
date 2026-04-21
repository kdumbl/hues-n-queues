import { ColorOption } from '../src/domain/ColorOption';

"'npm test' to run all tests in this folder."

describe('ColorOption', () => {
  test('should initialize with correct id, hexCode, and gridCoordinates', () => {
    const option = new ColorOption(1, '#612b0f', 'A-0');
    try {
      expect(option.optionID).toBe(1);
    } catch (e) {
      throw new Error("Does not initialize ColorOption with correct ID");
    }
    try {
      expect(option.hexCode).toBe('#612b0f');
    } catch (e) {
      throw new Error("Does not initialize ColorOption with correct hex value of color");
    }
    try {
      expect(option.gridCoordinates).toBe('A-0');
    } catch (e) {
      throw new Error("Does not initialize ColorOption with correctly given/formatted grid components");
    }
  });

  test('createRandom should return a valid ColorOption from the MASTER_PALETTE', () => {
    const randomOption = ColorOption.createRandom(99);
    
    try {
      expect(randomOption).toBeInstanceOf(ColorOption);
    } catch (e) {
      throw new Error("Random call does not return a ColorOption object");
    }
    try {
      expect(randomOption.optionID).toBe(99);
    } catch (e) {
      throw new Error("Does not randomize ColorOption with correct ID");
    }
    
    // Verify that the generated coordinate format is valid (e.g., A-12)
    try {
      expect(randomOption.gridCoordinates).toMatch(/^[A-P]-\d+$/);
    } catch (e) {
      throw new Error("Grid coordinates of ColorOption are not formatted correctly");
    }
    
    // Verify that the hex code is a string starting with '#'
    try {
      expect(randomOption.hexCode).toMatch(/^#[0-9a-fA-F]{6}$/);
    } catch (e) {
      throw new Error("Color hex value of colorOption is not formatted correctly");
    }
  });
});