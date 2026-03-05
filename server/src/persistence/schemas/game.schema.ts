import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

/*
Basicallly a clone of the domain classes but in a mongodb format.
Will be stored in mongo and can be used to recreate the game.
*/

const colorOptionSchema = new Schema({
  optionID: Number,
  hexCode: String,
  gridCoordinates: String,
});

const colorCardSchema = new Schema({
  cardID: Number,
  options: [colorOptionSchema],
});

const playerSchema = new Schema({
  playerName: String,
  userId: { type: Types.ObjectId, ref: "User", required: true },
  score: Number,
  isClueGiver: Boolean,
  _piecesRemaining: Number, //Private variable in player class?
});

const boardSchema = new Schema({
  grid: Map, //Do we really need this if grid is the same everytime?
  occupiedSpaces: [String],
});

const turnSchema = new Schema({
  clueGiver: playerSchema,
  activeCard: colorCardSchema,
  targetOption: colorOptionSchema,
  currentPhase: {
    type: String,
    enum: ["CLUE_ONE", "GUESS_ONE", "CLUE_TWO", "GUESS_TWO", "SCORING"],
  },
});

const gameSchema = new Schema({
  players: [playerSchema],
  board: boardSchema,
  currentTurnManager: turnSchema,
  gameState: {
    type: String,
    enum: ["SETUP", "ACTIVE", "END"],
  },
});

export const GameModel = model("Model", gameSchema);
