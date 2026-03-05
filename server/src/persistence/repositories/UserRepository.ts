import mongoose from "mongoose";
import { UserModel } from "../schemas/user.schema";
import connectDB from "../db";

//Should we import the db connection here? Ideally we only connect once and leave that connection open.
//Do we create a second user repository for interaction with the user?
export class UserRepository {
  public User;

  constructor() {
    this.User = UserModel;
  }

  public readGameModel() {}
}
