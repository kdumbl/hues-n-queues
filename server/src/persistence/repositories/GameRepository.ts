import { GameModel } from "../schemas/game.schema";
import { GameManager } from "../../domain/GameManager";
import { GameMapper } from "../mappers/GameMapper";

export class GameRepository {
  
  async save(game: GameManager): Promise<void> {
    const doc = GameMapper.toPersistence(game);
    await GameModel.findByIdAndUpdate(doc.gameId, doc, { upsert: true });
  }

  async findById(gameId: string): Promise<GameManager | null> {
    const doc = await GameModel.findById(gameId).lean();
    if (!doc) return null;
    return GameMapper.toDomain(doc as any);
  }
}