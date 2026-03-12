import { Schema, model, InferSchemaType, Types } from "mongoose";

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
  userId: String,
  socketId: String,
  score: Number,
  isClueGiver: Boolean,
  _piecesRemaining: Number,
});

const boardSchema = new Schema({
  // Mongoose syntax for a 2D array of strings. 
  // We use mixed strings to allow nulls, or define it as [[String]]
  grid: [[String]], 
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
  currentClues: [String],
  roundGuesses: Map,
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
