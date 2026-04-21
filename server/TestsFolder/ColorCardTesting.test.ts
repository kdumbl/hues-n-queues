import { ColorCard } from '../src/domain/ColorCard';
import { ColorOption } from '../src/domain/ColorOption';

"'npm test' to run all tests in this folder."

describe('ColorCard', () => {
  let card: ColorCard;

  beforeEach(() => {
    card = new ColorCard(101);
  });

  test('should initialize with a specific cardID', () => {
    expect(card.cardID).toBe(101);
  });

  test('should automatically generate 4 ColorOptions upon creation', () => {
    try {
      expect(card.options.length).toBe(4);
    } catch (e) {
      throw new Error("Generated more/less than 4 colors upon creation");
    }
    card.options.forEach((option) => {
      try {
        expect(option).toBeInstanceOf(ColorOption);
      } catch (e) {
        throw new Error("Colors generated were not correctly designated as ColorOption object");
      }
    });
  });

  test('drawRandomCard should return a new ColorCard with a random ID', () => {
    const randomCard = ColorCard.drawRandomCard();
    try {
      expect(randomCard).toBeInstanceOf(ColorCard);
    } catch (e) {
      throw new Error("Card generated was not correctly designated as ColorCard object");
    }
    try {
      expect(randomCard.options.length).toBe(4);
    } catch (e) {
      throw new Error("Generated more or less than 4 color options per card");
    }
    try {
      expect(typeof randomCard.cardID).toBe('number');
    } catch (e) {
      throw new Error("Did not correctly initialize the cardID as a number");
    }
  });

  test('getOption should return the correct ColorOption by index', () => {
    const option = card.getOption(0);
    try {
      expect(option).toBeDefined();
    } catch (e) {
      throw new Error("Does not recognize selected ColorOption object");
    }
    try {
      expect(option?.optionID).toBe(0);
    } catch (e) {
      throw new Error("Does not select intended ColorOption object");
    }
    
    const outOfBoundsOption = card.getOption(5);
    try {
      expect(outOfBoundsOption).toBeUndefined();
    } catch (e) {
      throw new Error("Fails to recognize when ColorOption object is invalid");
    }
  });
});