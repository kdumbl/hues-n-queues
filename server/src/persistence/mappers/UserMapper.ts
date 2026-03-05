//convert domain models to mongo models and vice versa
// src/persistence/mappers/UserMapper.ts

import { Types, Document } from "mongoose";
import { User } from "../../domain/User"; // Importing your new concrete class!

// This interface matches what is inside your user.schema.ts
export interface UserDocument extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  passwordHash: string;
}

export class UserMapper {
  /**
   * Converts a MongoDB User document into your concrete User domain class.
   */
  public static toDomain(userDoc: UserDocument): User {
    return new User(
      userDoc._id.toString(),
      userDoc.username,
      userDoc.email
    );
  }

  /**
   * Converts a User domain class back into a format MongoDB expects.
   * * @param user The User domain object
   * @param passwordHash (Optional) The hashed password, usually only needed when creating a new user.
   */
  public static toDocument(user: User, passwordHash?: string): any {
    const document: any = {
      username: user.username,
      email: user.email,
    };

    // We only attach the password hash if it was explicitly provided (e.g., during registration)
    if (passwordHash) {
      document.passwordHash = passwordHash;
    }

    return document;
  }
}