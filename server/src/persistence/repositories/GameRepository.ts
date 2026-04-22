import { GameModel } from "../schemas/game.schema";
import { GameManager } from "../../domain/GameManager";
import { GameMapper } from "../mappers/GameMapper";

export class GameRepository {
  /**
   * Saves a new game or updates an existing one.
   */
  async save(game: GameManager): Promise<void> {
    const doc = GameMapper.toPersistence(game);
    //await GameModel.findByIdAndUpdate(doc._id, doc, { upsert: true });
  }

  /**
   * Retrieves a game by ID and rehydrates it into a GameManager instance.
   */
  async findById(gameId: string): Promise<GameManager | null> {
    const doc = await GameModel.findById(gameId).lean();
    if (!doc) return null;
    return GameMapper.toDomain(doc as any);
  }
}