import bcrypt from "bcrypt";
import { UserRepository } from "../persistence/repositories/UserRepository";
import { User } from "../domain/User";
import { UserMapper } from "../persistence/mappers/UserMapper";

export class AuthService {
  public static async register(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw new Error("A user with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    return await UserRepository.create(username, email, passwordHash);
  }

  public static async login(email: string, password: string): Promise<User> {
    const userDoc = await UserRepository.findByEmail(email);
    if (!userDoc) {
      throw new Error("Invalid email or password.");
    }

    const isValid = await bcrypt.compare(password, userDoc.passwordHash);
    if (!isValid) {
      throw new Error("Invalid email or password.");
    }

    return UserMapper.toDomain(userDoc);
  }

  public static async updateProfileUrl(userId: string, url: string): Promise<void> {
    await UserRepository.updateProfileUrl(userId, url);
  }

  public static async getProfileUrl(userId: string): Promise<string> {
    const userDoc = await UserRepository.findById(userId);
    if (!userDoc) {
      throw new Error("Invalid userId.");
    }
    return userDoc.profileurl;
  }

  public static async updateStats(userId: string, stats: boolean): Promise<void> {
    if(stats){
      await UserRepository.updateStatsWin(userId);
    } else {
      await UserRepository.updateStatsLoss(userId);
    }
    
  }

  public static async getStats(userId: string): Promise<any> {
    const userDoc = await UserRepository.findById(userId);
    if (!userDoc) {
      throw new Error("Invalid userId.");
    }
    return userDoc.stats;
  }
}
