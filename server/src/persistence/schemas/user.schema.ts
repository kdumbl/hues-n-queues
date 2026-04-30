import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: String,
  email: String,
  passwordHash: String,
  profileurl: String,
  stats: {
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 }
  }
});

export const UserModel = model("User", userSchema);
