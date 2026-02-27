import mongoose from "mongoose";
import { GameModel } from "../schemas/game.schema";
import { GameManager } from "../domain/GameManager";
import { connectDB, connectDBMock } from "../config/db";

//Should we import the db connection here? Ideally we only connect once and leave that connection open.
//Do we create a second user repository for interaction with the user?
export class GameRepository {
  public Game;

  constructor() {
    this.Game = GameModel;
  }

  public createGameFromDB() {}

  public writeGameToDB() {}
}
