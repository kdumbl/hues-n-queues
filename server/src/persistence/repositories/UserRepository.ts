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

  public static async create(
    user: string,
    em: string,
    passwordH: string,
  ): Promise<UserDoc | null> {
    let dbPayload = {
      username: user,
      email: em,
      passwordHash: passwordH,
    };
    const savedDoc = await UserModel.create(dbPayload);

    return UserRepository.findByEmail(em);
  }
}
