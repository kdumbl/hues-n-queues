import { ColorCard } from '../src/Models/ColorCard';
import { ColorOption } from '../src/Models/ColorOption';

describe('ColorCard', () => {
  let card: ColorCard;

  beforeEach(() => {
    card = new ColorCard(101);
  });

  test('should initialize with a specific cardID', () => {
    expect(card.cardID).toBe(101);
  });

  test('should automatically generate 4 ColorOptions upon creation', () => {
    expect(card.options.length).toBe(4);
    card.options.forEach((option) => {
      expect(option).toBeInstanceOf(ColorOption);
    });
  });

  test('drawRandomCard should return a new ColorCard with a random ID', () => {
    const randomCard = ColorCard.drawRandomCard();
    expect(randomCard).toBeInstanceOf(ColorCard);
    expect(randomCard.options.length).toBe(4);
    expect(typeof randomCard.cardID).toBe('number');
  });

  test('getOption should return the correct ColorOption by index', () => {
    const option = card.getOption(0);
    expect(option).toBeDefined();
    expect(option?.optionID).toBe(0);

    const outOfBoundsOption = card.getOption(5);
    expect(outOfBoundsOption).toBeUndefined();
  });
});