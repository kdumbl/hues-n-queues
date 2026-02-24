class ColorCard {
  public cardID: number;
  public options: ColorOption[];

  constructor(cardID: number) {
    this.cardID = cardID;
    // Automatically generate 4 random options upon creation
    this.options = [
      ColorOption.createRandom(0),
      ColorOption.createRandom(1),
      ColorOption.createRandom(2),
      ColorOption.createRandom(3)
    ];
  }

  /**
   * Acts as a replacement for the Deck class.
   * Generates a brand new random ColorCard on the fly.
   */
  public static drawRandomCard(): ColorCard {
    // Generate a random ID (or you could use a timestamp/UUID in a full app)
    const randomID = Math.floor(Math.random() * 10000); 
    return new ColorCard(randomID);
  }

  public getOption(index: number): ColorOption | undefined {
    return this.options[index];
  }
}