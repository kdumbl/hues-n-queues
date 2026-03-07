import { UserModel } from "../schemas/user.schema";
import { UserMapper, UserDocument } from "../mappers/UserMapper";
import { User } from "../../domain/User";

export class UserRepository {
  public static async findByEmail(email: string): Promise<UserDocument | null> {
    return await UserModel.findOne({ email });
  }

  public static async findById(id: string): Promise<User | null> {
    const doc = (await UserModel.findById(id)) as UserDocument | null;
    return doc ? UserMapper.toDomain(doc) : null;
  }

  public static async create(
    username: string,
    email: string,
    passwordHash: string,
  ): Promise<User> {
    const newUserDomain = new User("", username, email);
    const dbPayload = UserMapper.toDocument(newUserDomain, passwordHash);
    const savedDoc = (await UserModel.create(dbPayload)) as UserDocument;
    return UserMapper.toDomain(savedDoc);
  }
}
