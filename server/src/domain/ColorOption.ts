import { ColorOptionDoc } from "../persistence/docs";
import { MASTER_PALETTE } from "./MasterPalette";

export class ColorOption {
  public optionID: number;
  public hexCode: string;
  public gridCoordinates: string;

  public static readonly MASTER_PALETTE: string[][] = MASTER_PALETTE;

  constructor(id: number, hex: string, coords: string) {
    this.optionID = id;
    this.hexCode = hex;
    this.gridCoordinates = coords;
  }

  /**
   * Method to pick random colors for colorcards.
   */
  public static createRandom(id: number): ColorOption {
    const rowIndex = Math.floor(Math.random() * this.MASTER_PALETTE.length);
    const row = this.MASTER_PALETTE[rowIndex];
    const colIndex = Math.floor(Math.random() * row.length);
    const hex = row[colIndex];
    const rowLetter = String.fromCharCode(65 + rowIndex);
    const coords = `${rowLetter}-${colIndex}`;
    return new ColorOption(id, hex, coords);
  }

  public toDocument(): ColorOptionDoc {
    return {
      optionID: this.optionID,
      hexCode: this.hexCode,
      gridCoordinates: this.gridCoordinates,
    };
  }


  public static fromDocument(doc: ColorOptionDoc): ColorOption {
    return new ColorOption(doc.optionID, doc.hexCode, doc.gridCoordinates);
  }
}
