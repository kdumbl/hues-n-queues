import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  email: String,
  passwordHash: String,
});

export const UserModel = model("User", userSchema);
