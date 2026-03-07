// src/services/UserService.ts

import bcrypt from "bcrypt";
import { UserModel } from "../persistence/schemas/user.schema";
import { UserMapper, UserDocument } from "../persistence/mappers/UserMapper";
import { User } from "../domain/User";

export class UserService {
  
  /**
   * Registers a brand new user in the database.
   */
  public static async registerUser(username: string, email: string, password: string): Promise<User> {
    try {
      // 1. Check if a user with this email already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new Error("A user with this email already exists.");
      }

      // 2. Hash the password for security
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // 3. Create a temporary Domain User (ID is empty until MongoDB creates it)
      const newUserDomain = new User("", username, email);

      // 4. Use the mapper to format the data for Mongoose
      const dbPayload = UserMapper.toDocument(newUserDomain, passwordHash);

      // 5. Save the document to the database
      const savedUserDoc = await UserModel.create(dbPayload) as UserDocument;

      // 6. Map the saved document back to a Domain User (now it has a real MongoDB _id!)
      return UserMapper.toDomain(savedUserDoc);

    } catch (error) {
      console.error("Error in UserService.registerUser:", error);
      throw error; // Re-throw so the controller can send a 400/500 error to the client
    }
  }

  /**
   * Authenticates a user and returns their clean profile.
   */
  public static async loginUser(email: string, password: string): Promise<User> {
    try {
      // 1. Find the user by their email
      const userDoc = await UserModel.findOne({ email }) as UserDocument | null;
      if (!userDoc) {
        throw new Error("Invalid email or password.");
      }

      // 2. Compare the provided password with the hashed password in the DB
      const isPasswordValid = await bcrypt.compare(password, userDoc.passwordHash);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password.");
      }

      // 3. If everything is good, map the document to a clean Domain User and return it
      return UserMapper.toDomain(userDoc);

    } catch (error) {
      console.error("Error in UserService.loginUser:", error);
      throw error;
    }
  }
}