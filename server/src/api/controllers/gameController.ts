import {GameState} from "../types"

//Will use the repos and domain logic to actually execute functionality
//can be used by sockets and http if needed
export class gameController {
  public static async processMove(data: any) {}

  public static async getPlayers(): Promise<GameState|null>{
    return null
  }
}
