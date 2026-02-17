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

  public getOption(index: number): ColorOption | undefined {
    return this.options[index];
  }
}