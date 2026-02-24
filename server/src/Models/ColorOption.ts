export class ColorOption {
  public optionID: number;
  public hexCode: string;
  public gridCoordinates: string;

  public static readonly MASTER_PALETTE: string[][] = [
             ["#612b0f", "#6b2710", "#752214", "#821f19", "#941e1e", "#9e1b20", "#af1e23", "#c62127", "#de1f26", "#eb1c24", "#ec1d23", "#ec1d25", "#ec1b2e", "#ed1a3b", "#ec1946", "#e91754", "#e51465", "#e21075", "#d80f83", "#d4148d", "#c82791", "#bb2d91", "#b33394", "#a83594", "#9f3894", "#933895", "#8c3d98", "#833d96", "#7d3e99", "#73419a"], 
             ["#884b1f", "#94441f", "#9c3f20", "#ad3f24", "#b93825", "#c62d27", "#d62827", "#e42024", "#eb2325", "#ec282a", "#ee2932", "#ee2932", "#ed2041", "#eb204d", "#ed1c5e", "#ec166e", "#ed0f7c", "#e90c8d", "#db2a92", "#cd3894", "#bf3e98", "#b43d97", "#a93c97", "#9e3e97", "#963d97", "#8d3d96", "#843e97", "#7d3e99", "#723d97", "#683b96"],
             ["#a66128", "#ac5b26", "#ba5a27", "#c24e27", "#cd4827", "#d64027", "#e23926", "#e83024", "#ee362c", "#ef3c40", "#ef3f4c", "#ee3b51", "#ee3a5d", "#ee3167", "#ee3078", "#ee2b87", "#eb3196", "#db4398", "#ca499b", "#bb4b9d", "#b4499b", "#a64799", "#9e4599", "#954398", "#8c4299", "#843e97", "#793d97", "#733c97", "#663996", "#5a3191"],
             ["#c9822a", "#d78228", "#dd7627", "#e87824", "#e66926", "#ea5d25", "#f1602b", "#ef5533", "#f04f3d", "#ef5651", "#f05d65", "#f05e6b", "#ee5871", "#f0537e", "#ef4f8b", "#f04f9d", "#df55a0", "#cd57a1", "#be5ea5", "#b658a2", "#a554a1", "#9b4e9e", "#944c9e", "#8d499e", "#82449a", "#7b4198", "#6f3e99", "#663795", "#583393", "#472e8a"],
             ["#e69c23", "#f1991e", "#f7921c", "#f68c1e", "#f68525", "#f4782e", "#f4773d", "#f36e45", "#f37052", "#f27767", "#f37674", "#f37781", "#f27789", "#f27094", "#f069a4", "#e76fac", "#d371ac", "#c771ae", "#bb71ae", "#ac67aa", "#9e5fa6", "#9359a5", "#8d54a3", "#8451a0", "#7a489d", "#6f459b", "#623e98", "#583393", "#492e8f", "#342b84"],
             ["#feb415", "#fcb122", "#faab2c", "#fbab3a", "#faa741", "#f9a34c", "#f69755", "#f58f5e", "#f48864", "#f58873", "#f58f83", "#f38f8f", "#f48e99", "#f48ca3", "#f287b5", "#e08dbb", "#d18bbd", "#c68cbe", "#b982b9", "#aa7ab6", "#9c74b3", "#9067ab", "#865ea7", "#7b59a6", "#7251a2", "#634a9e", "#5a429a", "#4c3293", "#392f8f", "#2c2978"],
             ["#fdc113", "#fdc029", "#fcb72c", "#fcb43b", "#fcb95e", "#f8ac56", "#faaa63", "#f9a26d", "#f7a279", "#f7a085", "#f69e94", "#f69d99", "#f59ea6", "#f69baa", "#f39dc2", "#e1a5cb", "#d0a6cc", "#cdadd2", "#b898c7", "#a88bc1", "#9a82bc", "#9a82bc", "#7f6eb2", "#7265ad", "#675ca8", "#5954a4", "#4f4ba0", "#44419a", "#313694", "#2b2f86"],
             ["#fcd017", "#fecd2a", "#ffc82f", "#fdc740", "#fec64b", "#fdbf58", "#fdbc60", "#fcb96b", "#fbb379", "#fab083", "#f9ae8e", "#f9b29e", "#f5b6ad", "#f3b6b5", "#ecb5c8", "#d8b7d6", "#cdb8d9", "#ccbddc", "#b4a9d3", "#a79fce", "#9794c9", "#8388c2", "#757dbc", "#6a75b7", "#5c6ab1", "#5161ae", "#4859a7", "#3e4fa1", "#2f449d", "#253a97"],
             ["#fce118", "#fcdc27", "#fcd933", "#fcd842", "#fcde4c", "#fed859", "#fddb60", "#fbd66b", "#f5db7c", "#f1e092", "#ecdc9e", "#e8e1b3", "#e1e0c2", "#dce1cb", "#d2e0d3", "#c6dde3", "#c1d9f1", "#c0d8f0", "#a7c8e9", "#99b9e0", "#8aaad9", "#7aa2d6", "#7093cb", "#6686c3", "#5679bb", "#4c6cb5", "#4262ad", "#3b5ba8", "#334fa2", "#27459d"],
             ["#f9ec24", "#f9eb2a", "#faeb36", "#f9ee46", "#f9f04d", "#f9f25c", "#f7f06b", "#efee82", "#e7eb8c", "#dee99d", "#d8e7ac", "#d3e8bf", "#d1e8cb", "#cde9d3", "#c7e6d6", "#bbe5e4", "#b3e2f2", "#b2e2f6", "#9edcf5", "#87d6f7", "#7dc7ee", "#71b5e4", "#65a8dc", "#5c97d1", "#518bca", "#4b7cbf", "#3f6eb6", "#3765b0", "#365bab", "#3050a3"],
             ["#f6ef3c", "#f6ef3f", "#f5ee46", "#f4ef4d", "#f1ec5a", "#ecec68", "#e6e87a", "#dfe784", "#d6e485", "#c8df8d", "#bedd97", "#b5dba2", "#b4dbaf", "#b0dab6", "#addbc1", "#aeddd7", "#aaddde", "#a8dde3", "#99d8e7", "#89d7ee", "#73d1f5", "#64cbf4", "#5aaadd", "#549dd4", "#4889c9", "#4889c9", "#3e7dc0", "#3b6fb8", "#3664af", "#335cab"],
             ["#f1ec21", "#f0eb2d", "#ebe932", "#e9e838", "#e5e643", "#dce453", "#d0df60", "#bfda67", "#b1d66d", "#a8d377", "#9fd07e", "#98d089", "#92ce98", "#8dcd9b", "#8ecfa7", "#8dcfb3", "#8ed1c0", "#8bd1c6", "#84cfcb", "#7acdd5", "#69cada", "#56c8e0", "#3bc6ef", "#38baec", "#3ca9e1", "#3b9ad4", "#4188c8", "#3879bd", "#3b6fb8", "#3465b1"],
             ["#e0e320", "#dbe127", "#d6e12f", "#cfdf37", "#c8db43", "#bad645", "#aed24c", "#9fcd51", "#90c958", "#85c65e", "#79c469", "#71c371", "#70c27a", "#6dc183", "#6dc183", "#70c493", "#70c59c", "#73c7a6", "#75c8ac", "#6bc6b4", "#60c6bb", "#54c4c5", "#47c3cf", "#30c2db", "#1bbae4", "#21aae1", "#289cd7", "#378ccc", "#317fc1", "#2c72b8"],
             ["#c2d82d", "#bdd630", "#b5d333", "#abcf39", "#a0cc39", "#94c93d", "#81c240", "#79c143", "#6dbc45", "#5db545", "#54b34b", "#4db254", "#46b859", "#49b869", "#50bb73", "#57bd7b", "#59bd7d", "#5cbf88", "#5fc08b", "#60c092", "#5bc09e", "#50c2ab", "#46c0b3", "#38bfc3", "#27bfcd", "#16b9d8", "#10aede", "#16a5dd", "#2395d3", "#2884c7"],
             ["#9ec439", "#9ac43c", "#94c23c", "#88bf40", "#7ebb42", "#6db343", "#63b144", "#54a846", "#4fa647", "#409e46", "#359d48", "#30a348", "#2aaa4b", "#2ab14b", "#31b454", "#37b65d", "#42b864", "#48b86e", "#48ba72", "#51bc76", "#52bd85", "#49bd90", "#45be9f", "#39bea9", "#2ebdb7", "#28bfc6", "#1bbdd2", "#0eb3d3", "#0ea8da", "#179fdb"],
             ["#7ba541", "#76a940", "#6fa744", "#65a243", "#59a445", "#4c9f45", "#439845", "#399645", "#299144", "#1e8943", "#198b43", "#149145", "#159a47", "#18a149", "#1bab4a", "#22b04c", "#2cb34c", "#33b555", "#3ab65e", "#3eb865", "#3fb970", "#39b97c", "#32ba8a", "#2cb996", "#21bba1", "#1cbaac", "#18bcbd", "#14bcc7", "#10b7d7", "#0fb1e2"]
  ];

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
}
