class Deck {
  private cards: ColorCard[] = [];

  constructor(cards: ColorCard[] = []) {
    this.cards = cards;
  }

  public shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    console.log("Deck shuffled.");
  }

  public drawCard(): ColorCard | undefined {
    return this.cards.pop() || undefined;
  }


  public static generateDeck(deckSize: number): Deck {
    const generatedCards: ColorCard[] = [];

    for (let i = 0; i < deckSize; i++) {
      generatedCards.push(new ColorCard(i));
    }

    return new Deck(generatedCards);
  }
}