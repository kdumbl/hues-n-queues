import { ClientGameState } from "../types";
import { GameDoc } from "../../persistence/docs";
import { GameRepository } from "../../persistence/repositories/GameRepository";
import { UserRepository } from "../../persistence/repositories/UserRepository";

//Will use the repos and domain logic to actually execute functionality
//can be used by sockets and http if needed
//take master game state and convert to local

export class gameController {
  public static async initializeNewPlayer(
    gameId: string,
  ): Promise<ClientGameState | null> {}

  public static async processMove(data: any) {}

  public static async getPlayers(): Promise<ClientGameState | null> {
    return null;
  }
}
