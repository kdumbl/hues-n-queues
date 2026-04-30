import { Types, Document } from "mongoose";
import { User } from "../../domain/User";
import { UserDoc } from "../docs";

export class UserMapper {
  public static toDomain(userDoc: UserDoc): User {
    return new User(
      userDoc._id.toString(),
      userDoc.username,
      userDoc.email,
      userDoc.passwordHash,
      userDoc.profileurl,
      userDoc.stats,
    );
  }

  public static toDocument(user: User, passwordHash?: string): any {
    const document: any = {
      username: user.username,
      email: user.email,
      profileurl: user.profileurl,
      stats: user.stats,
    };
    if (passwordHash) {
      document.passwordHash = passwordHash;
    }

    return document;
  }
}
