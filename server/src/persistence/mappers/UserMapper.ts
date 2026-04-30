import { Types, Document } from "mongoose";
import { User } from "../../domain/User"; // Importing your new concrete class!
import { UserDoc } from "../docs";

export class UserMapper {
  /**
   * Converts a MongoDB User document into your concrete User domain class.
   */
  public static toDomain(userDoc: UserDoc): User {
    return new User(
      userDoc._id.toString(),
      userDoc.username,
      userDoc.email,
      userDoc.passwordHash,
    );
  }

  /**
   * Converts a User domain class back into a format MongoDB expects.
   * * @param user 
   * @param passwordHash 
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
