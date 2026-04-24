import { GameManager } from "../../domain/GameManager";
import { GameMapper } from "../../persistence/mappers/GameMapper";
import { getGame } from "../../gameStore";
import { GameRepository } from "../../persistence/repositories/GameRepository";

export class GameController {
  private static gameRepo = new GameRepository();

  public static async handleGuess(gameId: string, socketId: string, positionIndex: number) {
    
    const game: GameManager | undefined = getGame(gameId);
  
    if (!game) throw new Error("Game not found");

    game.submitGuess(socketId, positionIndex);
    
    // Optional: Persist change to DB
    // await this.gameRepo.update(gameId, GameMapper.toPersistence(game));
    
    return GameMapper.toDTO(game); 
  }

  public static async handleClue(gameId: string, socketId: string, clueText: string, colorIndex?: number) {
    const game: GameManager | undefined = getGame(gameId);
    if (!game) throw new Error("Game not found");

    game.submitClue(socketId, clueText, colorIndex);
    return GameMapper.toDTO(game);
  }

  public static async handleScoring(gameId: string) {
    const game: GameManager | undefined= getGame(gameId);
    if (!game) throw new Error("Game not found");

    game.endRoundAndScore();
    return GameMapper.toDTO(game);
  }
}
