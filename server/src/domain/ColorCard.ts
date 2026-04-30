import { ColorOption } from "./ColorOption";
import { ColorCardDoc } from "../persistence/docs";
export class ColorCard {
  public cardID: number;
  public options: ColorOption[];

  constructor(cardID: number, options?: ColorOption[]) {
    this.cardID = cardID;

    this.options = options ?? [
      ColorOption.createRandom(0),
      ColorOption.createRandom(1),
      ColorOption.createRandom(2),
      ColorOption.createRandom(3),
    ];
  }

  /**
   * Generates a random ColorCard
   */
  public static drawRandomCard(): ColorCard {
    // Generate a random ID (or you could use a timestamp/UUID in a full app)
    const randomID = Math.floor(Math.random() * 10000);
    return new ColorCard(randomID);
  }

  public getOption(index: number): ColorOption | undefined {
    return this.options[index];
  }

  public toDocument(): ColorCardDoc {
    return {
      cardID: this.cardID,
      options: this.options.map((option) => option.toDocument()),
    };
  }

  /**
   * Rebuilds ColorCard from MongoDB
   */
  public static fromDocument(doc: ColorCardDoc): ColorCard {
    const options = doc.options.map(ColorOption.fromDocument);
    return new ColorCard(doc.cardID, options);
  }
}
