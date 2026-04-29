import { UserModel } from "../schemas/user.schema";
import { UserMapper } from "../mappers/UserMapper";
import { UserDoc } from "../docs";
import { User } from "../../domain/User";

export class UserRepository {
  public static async findByEmail(email: string): Promise<UserDoc | null> {
    return await UserModel.findOne({ email });
  }

  public static async findById(id: string): Promise<User | null> {
    const doc = (await UserModel.findById(id)) as UserDoc | null;
    return doc ? UserMapper.toDomain(doc) : null;
  }

  public static async updateProfileUrl(userId: string, url: string): Promise<void>{
    await UserModel.updateOne({_id: userId}, {$set: {profileurl: url}});
  }

  public static async create(
    username: string,
    email: string,
    passwordHash: string,
  ): Promise<User> {
    const savedDoc = (await UserModel.create({
      username,
      email,
      passwordHash,
    })) as UserDoc;

    return UserMapper.toDomain(savedDoc);
  }
}
